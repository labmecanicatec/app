/* exported eraseCookie, getQueryStringValue, init, validateEmail, cookies, setDialogVisible */
// Cookie functions from http://www.quirksmode.org/js/cookies.html //

function startsWith(haystack, needle) {
  return haystack.slice(0, needle.length) == needle;
}

function createCookie(name, value, days, path) {
  var getLocation = function (href) {
    var l = document.createElement('a');
    l.href = href;
    return l;
  };

  if (!path) {
    path = '/';
  } else {
    var location = getLocation(path);
    path = location.pathname;
    if (!startsWith(path, '/')) {
      path = '/' + path;
    }
  }
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = '; expires=' + date.toGMTString();
  } else {
    var expires = '';
  }
  document.cookie = name + '=' + value + expires + '; path=' + path;
}

function readCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

function eraseCookie(name, path) {
  createCookie(name, '', -30, path);
}

function getQueryStringValue(name) {
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
  var regexS = '[\\?&]' + name + '=([^&#]*)';
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null) {
    return '';
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
}

function init() {}

function validateEmail(email) {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var cookies = {
  // cookieName: 'dismissed',

  isDismissed: function (id) {
    var dismissed = readCookie('dismissed');

    if (!dismissed) {
      return false;
    }

    var idsDismissed = dismissed.split(',');

    return idsDismissed.indexOf(id) !== -1;
  },

  dismiss: function (id, path) {
    var dismissed = readCookie('dismissed');

    if (!dismissed) {
      dismissed = [];
    } else {
      dismissed = dismissed.split(',');
    }
    if (dismissed.indexOf(id) === -1) {
      dismissed.push(id);
    }
    createCookie('dismissed', dismissed, 30, path);
  },
};

document.addEventListener('DOMContentLoaded', function () {
  var buttonUp = document.getElementById('button-up');

  buttonUp.addEventListener('click', scrollUp);

  function scrollUp() {
    var currentScroll = document.documentElement.scrollTop;
    if (currentScroll > 0) {
      window.scrollTo(0, currentScroll - currentScroll / 1);
    }
  }

  window.onscroll = function () {
    var scroll = document.documentElement.scrollTop;
    if (scroll > 500) {
      buttonUp.style.transform = 'scale(1)';
    } else if (scroll < 500) {
      buttonUp.style.transform = 'scale(0)';
    }
  };
});

function initializeAccordions() {
  document.querySelectorAll('.accordion-item').forEach((item) => {
    const id = item.id;
    if (!id) return;

    const expanded = localStorage.getItem(id) !== 'collapsed';

    // Bootstrap 6 accordions are native <details> elements
    if (item instanceof HTMLDetailsElement) {
      item.open = expanded;
      // "toggle" does not bubble, so nested accordions never reach this one
      item.addEventListener('toggle', () => {
        localStorage.setItem(id, item.open ? 'expanded' : 'collapsed');
      });
      return;
    }

    // Bootstrap 5 accordions use the collapse plugin
    const collapse = item.querySelector('.accordion-collapse');
    const button = item.querySelector('.accordion-button');
    if (!collapse) return;

    collapse.classList.toggle('show', expanded);
    if (button) {
      button.classList.toggle('collapsed', !expanded);
      button.setAttribute('aria-expanded', expanded);
    }

    // Save the state when it finishes opening or closing
    collapse.addEventListener('shown.bs.collapse', (e) => {
      if (e.target === collapse) localStorage.setItem(id, 'expanded');
    });
    collapse.addEventListener('hidden.bs.collapse', (e) => {
      if (e.target === collapse) localStorage.setItem(id, 'collapsed');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccordions);
} else {
  initializeAccordions();
}

// Exposed on window because it's invoked from inline onclick="" handlers in
// Smarty templates, which ESLint has no visibility into for usage checks.
window.showToastById = function (id) {
  var toastEl = document.getElementById(id);
  if (toastEl && window.bootstrap && window.bootstrap.Toast) {
    toastEl.classList.remove('d-none');
    window.bootstrap.Toast.getOrCreateInstance(toastEl).show();
  }
};

window.copyUrlToClipboard = function (url) {
  if (!url || url === '#') {
    return;
  }
  var showToast = function () {
    window.showToastById('clipboardCopyToast');
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(url)
      .then(showToast)
      .catch(function () {
        if (fallbackCopyToClipboard(url)) {
          showToast();
        }
      });
  } else {
    if (fallbackCopyToClipboard(url)) {
      showToast();
    }
  }
};

function fallbackCopyToClipboard(url) {
  var textarea = document.createElement('textarea');
  textarea.value = url;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  var succeeded = false;
  try {
    succeeded = document.execCommand('copy');
  } catch {
    succeeded = false;
  } finally {
    document.body.removeChild(textarea);
  }
  return succeeded;
}

// Names are stored entity-encoded (e.g. &#039;); jqTree escapes again, so decode once to plain text.
// eslint-disable-next-line no-unused-vars -- Used by page scripts loaded separately.
function decodeNames(nodes) {
  return _.map(nodes, function (n) {
    const copy = _.extend({}, n);
    _.each(['name', 'label'], function (k) {
      if (typeof copy[k] === 'string') copy[k] = HtmlDecode(copy[k]);
    });
    if (n.children) copy.children = decodeNames(n.children);
    return copy;
  });
}

/**
 * Gets an existing Bootstrap Collapse instance or creates a new one.
 *
 * @param {HTMLElement} element The Collapse element.
 * @returns {bootstrap.Collapse|null} The Collapse instance or null.
 */
window.getCollapseInstance = (element) => {
  if (!element) {
    return null;
  }

  return bootstrap.Collapse.getOrCreateInstance(element, {
    toggle: false,
  });
};

const collapseSyncGetters = new WeakMap();

/**
 * Synchronizes a Bootstrap Collapse element with its desired state.
 *
 * @param {HTMLElement} element The Collapse element.
 * @param {Function} getShouldShow Returns whether the element should be shown.
 */
window.syncCollapse = (element, getShouldShow) => {
  if (!element || typeof getShouldShow !== 'function') {
    return;
  }

  const collapse = getCollapseInstance(element);

  if (!collapse) {
    return;
  }

  collapseSyncGetters.set(element, getShouldShow);

  const sync = () => {
    if (element.classList.contains('collapsing')) {
      return;
    }

    const shouldShow = collapseSyncGetters.get(element)();
    const isShown = element.classList.contains('show');

    if (shouldShow && !isShown) {
      collapse.show();
    } else if (!shouldShow && isShown) {
      collapse.hide();
    }
  };

  if (!element.dataset.collapseSyncInitialized) {
    element.addEventListener('shown.bs.collapse', sync);
    element.addEventListener('hidden.bs.collapse', sync);
    element.dataset.collapseSyncInitialized = 'true';
  }

  sync();
};

/** Last queued operation per dialog: calls on the same dialog run one after another. */
const dialogQueue = new WeakMap();

async function applyDialogVisibility(el, visible, options) {
  if (visible) {
    await bootstrap.Dialog.getOrCreateInstance(el, options).show();
  } else {
    // If it was never opened there is no instance, and nothing to hide.
    await bootstrap.Dialog.getInstance(el)?.hide();
  }
  return el;
}

/**
 * Shows or hides a Bootstrap 6 Dialog.
 *
 * Calls on the same dialog are queued, so a show() requested during a closing
 * transition (or a hide() during an opening one) runs when the running
 * transition ends instead of being ignored by Bootstrap.
 *
 * @param {string|HTMLDialogElement|jQuery} target The dialog to act on. Accepts:
 *   - A CSS selector string, including the "#" for ids (e.g. '#wait-box').
 *     If several elements match, only the first one is used.
 *   - A DOM element (e.g. document.getElementById('wait-box')).
 *   - A jQuery object (e.g. $('#wait-box')). Only its first element is used.
 *     Supported only to ease the migration away from jQuery.
 *   If nothing is found, or the element is not a <dialog>, a warning is logged
 *   and nothing else happens. An invalid selector (e.g. '#my dialog') throws a SyntaxError.
 * @param {boolean} [visible=true] true to show the dialog, false to hide it.
 * @param {Object} [options] Options for the Bootstrap Dialog constructor.
 *   They only apply the first time the dialog is created; later calls ignore them.
 * @returns {Promise<HTMLDialogElement|null>} Resolves when the transition ends
 *   (or immediately if the dialog was already in that state or the call was
 *   cancelled), or with null if the dialog was not found.
 */
function setDialogVisible(target, visible = true, options) {
  const el = typeof target === 'string' ? document.querySelector(target) : target?.jquery ? target[0] : target;
  if (!el) {
    console.warn('setDialogVisible: Dialog not found', target);
    return Promise.resolve(null);
  }
  if (!(el instanceof HTMLDialogElement)) {
    console.warn('setDialogVisible: element is not a <dialog>', el);
    return Promise.resolve(null);
  }

  const previous = dialogQueue.get(el) ?? Promise.resolve();
  const next = previous.then(() => applyDialogVisibility(el, visible, options));
  dialogQueue.set(
    el,
    next.catch(() => {})
  );
  return next;
}

// Only while other scripts are not modules yet.
window.setDialogVisible = setDialogVisible;
