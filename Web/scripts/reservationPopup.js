/**
 * Reservation details popup.
 *
 * Usage:
 *
 *   attachReservationPopup(element, refNum, detailsUrl);
 *
 * The call stores the reservation ID (and URL) as `data-reservation-popup`
 * and `data-reservation-popup-url` attributes on the element. Hover events
 * are delegated from the document, so no per-element listeners are added and
 * elements removed from the DOM need no cleanup.
 *
 * The URL attribute is looked up on the element or its closest ancestor;
 * when none is found, `ajax/respopup.php` (relative to the page) is used.
 */
(function () {
  const HOVER_DELAY_MS = 700;
  const DEFAULT_DETAILS_URL = 'ajax/respopup.php';
  const TRIGGER_SELECTOR = '[data-reservation-popup]';
  const URL_SELECTOR = '[data-reservation-popup-url]';

  /**
   * Per-element popup state. Tied to the element so re-rendered elements
   * (e.g. after a schedule refresh or a reservation move) fetch fresh details.
   */
  const states = new WeakMap();

  /**
   * Element whose popup is currently active (hovered or visible).
   */
  let activeElement = null;

  function getState(el) {
    let state = states.get(el);

    if (!state) {
      state = {
        cache: new Map(),
        tooltip: null,
        isTooltipVisible: false,
        isHovering: false,
        hoverTimer: null,
        request: null,
      };
      states.set(el, state);
    }

    return state;
  }

  function resolveDetailsUrl(el) {
    return el.closest(URL_SELECTOR)?.dataset.reservationPopupUrl || DEFAULT_DETAILS_URL;
  }

  // Recreate the tooltip whenever its content changes.
  // Disable animation when replacing visible content to prevent flickering.
  function show(el, state, content) {
    state.tooltip?.dispose();

    state.tooltip = new bootstrap.Tooltip(el, {
      trigger: 'manual',
      html: true,
      customClass: 'respopup-tooltip',
      animation: !state.isTooltipVisible,
      title: content,
    });

    state.tooltip.show();
    state.isTooltipVisible = true;
  }

  async function load(el, state) {
    const refNum = el.dataset.reservationPopup;
    const detailsUrl = resolveDetailsUrl(el);
    const cacheKey = detailsUrl + '|' + refNum;

    if (state.cache.has(cacheKey)) {
      show(el, state, state.cache.get(cacheKey));
      return;
    }

    show(el, state, 'Loading...');

    const controller = new AbortController();
    state.request = controller;

    try {
      const url = new URL(detailsUrl, window.location.href);
      url.searchParams.set('id', refNum);

      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText);
      }

      const html = await response.text();

      state.cache.set(cacheKey, html);

      if (state.isHovering) {
        show(el, state, html);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && state.isHovering) {
        show(el, state, error.message);
      }
    } finally {
      if (state.request === controller) {
        state.request = null;
      }
    }
  }

  function enter(el) {
    if (!el.dataset.reservationPopup) {
      return;
    }

    if (activeElement && activeElement !== el) {
      leave(activeElement);
    }

    activeElement = el;

    const state = getState(el);
    state.isHovering = true;
    clearTimeout(state.hoverTimer);

    state.hoverTimer = setTimeout(() => {
      if (state.isHovering) {
        load(el, state);
      }
    }, HOVER_DELAY_MS);
  }

  function leave(el) {
    if (activeElement === el) {
      activeElement = null;
    }

    const state = states.get(el);

    if (!state) {
      return;
    }

    state.isHovering = false;
    clearTimeout(state.hoverTimer);

    state.request?.abort();

    state.tooltip?.hide();
    state.isTooltipVisible = false;
  }

  function reset(el) {
    const state = states.get(el);

    if (!state) {
      return;
    }

    leave(el);
    state.tooltip?.dispose();
    state.tooltip = null;
  }

  // mouseenter/mouseleave do not bubble, so emulate them with
  // mouseover/mouseout and ignore moves between descendants.
  document.addEventListener('mouseover', (event) => {
    // The active element was removed from the DOM (e.g. re-rendered)
    // without a mouseout; hide its orphaned tooltip.
    if (activeElement && !activeElement.isConnected) {
      leave(activeElement);
    }

    const el = event.target.closest?.(TRIGGER_SELECTOR);

    if (!el || el.contains(event.relatedTarget)) {
      return;
    }

    enter(el);
  });

  document.addEventListener('mouseout', (event) => {
    const el = event.target.closest?.(TRIGGER_SELECTOR);

    if (!el || el.contains(event.relatedTarget)) {
      return;
    }

    leave(el);
  });

  // Hide the popup (and cancel a pending one) when the trigger is dragged.
  document.addEventListener('dragstart', (event) => {
    const el = event.target.closest?.(TRIGGER_SELECTOR);

    if (el) {
      leave(el);
    }
  });

  /**
   * Marks a DOM element as a reservation popup trigger.
   *
   * @param {HTMLElement|null} el - Element that triggers the reservation popup.
   * @param {string|number} refNum - Reservation ID.
   * @param {string} [detailsUrl] - URL used to retrieve reservation details.
   * @returns {void}
   */
  function attachReservationPopup(el, refNum, detailsUrl) {
    if (!el) {
      return;
    }

    reset(el);

    el.dataset.reservationPopup = refNum ?? '';

    if (detailsUrl) {
      el.dataset.reservationPopupUrl = detailsUrl;
    }
  }

  /**
   * Hides the popup of an element and cancels any pending load, keeping the
   * element as a trigger. Use when a library moves the element without
   * firing native mouse or drag events (e.g. FullCalendar drags).
   *
   * @param {HTMLElement|null} el - Reservation popup trigger.
   * @returns {void}
   */
  function hideReservationPopup(el) {
    if (el) {
      leave(el);
    }
  }

  /**
   * Removes the popup from an element and disposes its tooltip. Use before a
   * library discards the element (e.g. FullCalendar's eventWillUnmount).
   *
   * @param {HTMLElement|null} el - Reservation popup trigger.
   * @returns {void}
   */
  function detachReservationPopup(el) {
    if (!el) {
      return;
    }

    reset(el);
    delete el.dataset.reservationPopup;
    delete el.dataset.reservationPopupUrl;
  }

  // Expose the functions for native JavaScript callers.
  window.attachReservationPopup = attachReservationPopup;
  window.hideReservationPopup = hideReservationPopup;
  window.detachReservationPopup = detachReservationPopup;
})();
