function ReservationSearch(options) {
  var elements = {
    searchForm: $('#searchForm'),
    reservationResults: $('#reservation-results'),
    resources: $('#resources'),
    schedules: $('#schedules'),
    userFilter: $('#userFilter'),
    userId: $('#userId'),
    daterange: $('input[name="AVAILABILITY_RANGE"]'),
    beginDate: document.getElementById('beginDate'),
    endDate: document.getElementById('endDate'),
  };

  var init = function () {
    ConfigureAsyncForm(
      elements.searchForm,
      function () {
        elements.reservationResults.empty();
      },
      showSearchResults
    );

    elements.userFilter.userAutoComplete(options.autocompleteUrl, selectUser);

    elements.userFilter.on('change', function () {
      if ($(this).val() == '') {
        elements.userId.val('');
      }
    });

    elements.daterange.on('change', function (e) {
      if ($(e.target).val() == 'daterange') {
        setFlatpickrDisabled(elements.beginDate, false);
        setFlatpickrDisabled(elements.endDate, false);
      } else {
        setFlatpickrDisabled(elements.beginDate, true);
        setFlatpickrDisabled(elements.endDate, true);
      }
    });

    function setFlatpickrDisabled(input, disabled) {
      if (!input) return;

      const fp = input._flatpickr;
      input.disabled = disabled;

      if (fp) {
        if (fp.altInput) {
          fp.altInput.disabled = disabled;
        }

        if (disabled) fp.close();
      }
    }
  };

  function selectUser(ui, textbox) {
    elements.userId.val(ui.item.value);
    textbox.val(ui.item.label);
  }

  var showSearchResults = function (data) {
    var results = elements.reservationResults[0];

    results.innerHTML = data;

    results.querySelectorAll('tr.editable').forEach(function (row) {
      var refNum = row.getAttribute('data-refnum');
      var title = row.querySelector('.reservationTitle');

      if (title) {
        window.attachReservationPopup(title, refNum, options.popupUrl);
      }
    });
  };

  elements.reservationResults.on('click', 'tr.editable', function (e) {
    viewReservation($(this).attr('data-refnum'));
  });

  function viewReservation(referenceNumber) {
    window.location = options.reservationUrlTemplate.replace('[refnum]', referenceNumber);
  }

  return { init: init };
}
