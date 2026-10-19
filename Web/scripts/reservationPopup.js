/**
 * Shared cache keyed by reservation ID.
 * Reused across elements and preserved across DOM re-renders.
 */
const reservationPopupCache = new Map();

/**
 * Tracks active popup bindings per element to prevent duplicate listeners.
 */
const reservationPopupBindings = new WeakMap();

/**
 * Attaches a reservation details popup to a DOM element.
 *
 * The popup is displayed after a short hover delay. Reservation details
 * are fetched on demand and cached for subsequent interactions.
 *
 * @param {HTMLElement} el - Element that triggers the reservation popup.
 * @param {string|number} refNum - Reservation ID.
 * @param {string} [detailsUrl] - URL used to retrieve reservation details.
 * @returns {void}
 */
function attachReservationPopup(el, refNum, detailsUrl) {
  const HOVER_DELAY_MS = 700;

  // Clean up any previous binding on this element.
  reservationPopupBindings.get(el)?.cleanup();

  const listeners = new AbortController();

  let tooltip = null;
  let isTooltipVisible = false;
  let isHovering = false;
  let hoverTimer = null;
  let request = null;

  function cleanup() {
    clearTimeout(hoverTimer);
    request?.abort();
    tooltip?.dispose();
    listeners.abort();
  }

  reservationPopupBindings.set(el, { cleanup });

  // Recreate the tooltip whenever its content changes.
  // Disable animation when replacing visible content to prevent flickering.
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

      const response = await fetch(url, {
        signal: controller.signal,
      });

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

// Expose the function for native JavaScript callers.
window.attachReservationPopup = attachReservationPopup;

// Temporary jQuery compatibility layer.
// Remove once all jQuery callers have been migrated.
$.fn.attachReservationPopup = function (refNum, detailsUrl) {
  return this.each(function () {
    attachReservationPopup(this, refNum, detailsUrl);
  });
};
