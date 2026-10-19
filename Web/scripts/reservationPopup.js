// Caché compartida por reserva: sobrevive a re-render y se reutiliza entre elementos.
const reservationPopupCache = new Map();
// Listeners activos por elemento, para evitar duplicados si se vuelve a adjuntar.
const reservationPopupBindings = new WeakMap();

function attachReservationPopup(el, refNum, detailsUrl) {
  const HOVER_DELAY_MS = 700;

  reservationPopupBindings.get(el)?.abort();
  const listeners = new AbortController();
  reservationPopupBindings.set(el, listeners);

  let tooltip = null;
  let isTooltipVisible = false;
  let isHovering = false;
  let hoverTimer = null;
  let request = null;

  // Un tooltip en modo manual no admite show() repetidos sobre la misma instancia:
  // el segundo show() dispara _leave() internamente y lo oculta. Por eso se recrea
  // en cada cambio de contenido. Si ya hay uno visible (el "Loading..."), el
  // reemplazo se hace sin animación para que no parpadee.
  function show(content) {
    tooltip?.dispose();
    tooltip = new bootstrap.Tooltip(el, {
      trigger: 'manual',
      html: true,
      customClass: 'respopup-tooltip',
      animation: !isTooltipVisible,
      title: content,
    });
    tooltip.show();
    isTooltipVisible = true;
  }

  async function load() {
    if (reservationPopupCache.has(refNum)) {
      show(reservationPopupCache.get(refNum));
      return;
    }

    show('Loading...');

    const controller = new AbortController();
    request = controller;
    try {
      const url = new URL(detailsUrl ?? 'ajax/respopup.php', window.location.href);
      url.searchParams.set('id', refNum);

      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText);
      }

      const html = await response.text();
      reservationPopupCache.set(refNum, html);
      if (isHovering) {
        show(html);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && isHovering) {
        show(error.message);
      }
    } finally {
      if (request === controller) {
        request = null;
      }
    }
  }

  el.addEventListener(
    'mouseenter',
    () => {
      isHovering = true;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (isHovering) {
          load();
        }
      }, HOVER_DELAY_MS);
    },
    { signal: listeners.signal }
  );

  el.addEventListener(
    'mouseleave',
    () => {
      isHovering = false;
      clearTimeout(hoverTimer);
      request?.abort();
      tooltip?.hide();
      isTooltipVisible = false;
    },
    { signal: listeners.signal }
  );
}

// Compatibilidad: los llamadores actuales siguen usando $(el).attachReservationPopup(...)
// mientras se retira jQuery. Cuando ya no haya llamadores jQuery, se puede borrar este bloque.
$.fn.attachReservationPopup = function (refNum, detailsUrl) {
  return this.each(function () {
    attachReservationPopup(this, refNum, detailsUrl);
  });
};
