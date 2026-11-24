function Dashboard(opts) {
  var options = opts;

  var ShowReservationAjaxResponse = function () {
    $('#creatingNotification').hide();
    $('#result').show();
  };

  var CloseSaveDialog = function () {
    setDialogVisible('#wait-box', false);
  };
  Dashboard.prototype.init = function () {
    $('.resourceNameSelector').each(function () {
      $(this).bindResourceDetails($(this).attr('resource-id'));
    });

    var reservations = $('.reservation');

    function initializeReservationPopups() {
      document.querySelectorAll('.reservationTitle').forEach(function (title) {
        var refNum = title.closest('.reservation')?.getAttribute('id');
        window.attachReservationPopup(title, refNum, options.summaryPopupUrl);
      });

      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (element) {
        bootstrap.Tooltip.getOrCreateInstance(element);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeReservationPopups);
    } else {
      initializeReservationPopups();
    }

    reservations.hover(
      function () {
        $(this).addClass('hover');
      },
      function () {
        $(this).removeClass('hover');
      }
    );

    reservations.mousedown(function () {
      $(this).addClass('clicked');
    });

    reservations.mouseup(function () {
      $(this).removeClass('clicked');
    });

    reservations.click(function () {
      var refNum = $(this).attr('id');
      window.location = options.reservationUrl + refNum;
    });

    $('.btnCheckin').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      var button = $(this);
      button.attr('disabled', 'disabled');
      button.find('i').removeClass('bi-box-arrow-in-right').addClass('spinner-border').css({
        width: '1rem',
        height: '1rem',
      });

      var form = $('#form-checkin');
      var refNum = $(this).attr('data-referencenumber');
      $('#referenceNumber').val(refNum);
      setDialogVisible($('#wait-box'), true);
      ajaxPost(form, $(this).data('url'), null, function (data) {
        $('button[data-referencenumber="' + refNum + '"]').addClass('d-none');
        $('#result').html(data);
        ShowReservationAjaxResponse();
      });
    });

    $('.btnCheckout').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      var button = $(this);
      button.attr('disabled', 'disabled');
      button.find('i').removeClass('bi-box-arrow-in-left').addClass('spinner-border').css({
        width: '1rem',
        height: '1rem',
      });

      var form = $('#form-checkout');
      var refNum = $(this).attr('data-referencenumber');
      $('#referenceNumber').val(refNum);
      ajaxPost(form, null, null, function (data) {
        $('button[data-referencenumber="' + refNum + '"]').addClass('d-none');
        $('#result').html(data);
        ShowReservationAjaxResponse();
      });
    });

    $('#wait-box').on('click', '#btnSaveSuccessful', function (e) {
      CloseSaveDialog();
    });

    $('#wait-box').on('click', '#btnSaveFailed', function (e) {
      CloseSaveDialog();
    });
  };
}
