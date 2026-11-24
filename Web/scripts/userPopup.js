var userDetailsCache = new Map();
var activeUserDetailsPopover = null;

document.addEventListener('click', function (event) {
  if (!activeUserDetailsPopover) {
    return;
  }

  var activeElement = activeUserDetailsPopover.element;
  var popoverId = activeElement.getAttribute('aria-describedby');
  var popoverElement = popoverId && document.getElementById(popoverId);
  if (!activeElement.contains(event.target) && !(popoverElement && popoverElement.contains(event.target))) {
    activeUserDetailsPopover.close();
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && activeUserDetailsPopover) {
    activeUserDetailsPopover.close();
  }
});

window.bindUserDetails = function (elements, options) {
  var targets;
  if (typeof elements === 'string') {
    targets = document.querySelectorAll(elements);
  } else if (elements instanceof Element) {
    targets = [elements];
  } else {
    targets = Array.from(elements || []);
  }

  var settings = Object.assign({ preventClick: true }, options || {});
  targets.forEach(function (element) {
    if (!element || element.getAttribute('user-details-bound') === '1') {
      return;
    }

    var requestController = null;
    var isOpen = false;
    var popover = new bootstrap.Popover(element, {
      trigger: 'manual',
      placement: 'right',
      container: 'body',
      html: true,
      customClass: 'user-details-popover',
      content: 'Loading...',
    });

    function showContent(content) {
      popover.setContent({ '.popover-body': content });
      popover.show();
    }

    function closePopover() {
      if (!isOpen) {
        return;
      }

      isOpen = false;
      element.setAttribute('aria-expanded', 'false');
      if (activeUserDetailsPopover === popoverState) {
        activeUserDetailsPopover = null;
      }
      if (requestController) {
        requestController.abort();
        requestController = null;
      }
      popover.hide();
    }

    var popoverState = {
      element: element,
      close: closePopover,
    };

    function openPopover() {
      var userId = element.getAttribute('data-userid');
      if (!userId) {
        return;
      }

      if (activeUserDetailsPopover && activeUserDetailsPopover !== popoverState) {
        activeUserDetailsPopover.close();
      }

      isOpen = true;
      element.setAttribute('aria-expanded', 'true');
      activeUserDetailsPopover = popoverState;

      var cacheKey = String(userId);
      if (userDetailsCache.has(cacheKey)) {
        showContent(userDetailsCache.get(cacheKey));
        return;
      }

      showContent('Loading...');
      requestController = new AbortController();
      var controller = requestController;
      fetch('ajax/user_details.php?uid=' + encodeURIComponent(userId), {
        method: 'GET',
        credentials: 'same-origin',
        signal: controller.signal,
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Unable to load user details: ' + response.status);
          }
          return response.text();
        })
        .then(function (content) {
          userDetailsCache.set(cacheKey, content);
          if (isOpen) {
            showContent(content);
          }
        })
        .catch(function (error) {
          if (error.name !== 'AbortError' && isOpen) {
            showContent('Error loading user data!');
          }
        })
        .finally(function () {
          if (requestController === controller) {
            requestController = null;
          }
        });
    }

    element.addEventListener('click', function (event) {
      if (settings.preventClick) {
        event.preventDefault();
      }

      if (isOpen) {
        closePopover();
      } else {
        openPopover();
      }
    });

    element.setAttribute('aria-expanded', 'false');
    element.setAttribute('user-details-bound', '1');
  });
};

window.bindUserDetails(document.querySelectorAll('#userName, .bindableUser'));
