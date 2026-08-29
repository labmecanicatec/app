function UserCredits(opts) {
  var elements = {
    creditLog: $('#credit-log-content'),
    creditLogIndicator: $('#creditLogIndicator'),
    transactionLog: $('#transaction-log-content'),
    transactionLogIndicator: $('#transactionLogIndicator'),
  };

  UserCredits.prototype.init = function () {
    $('#quantity, #count').change(function (e) {
      ajaxGet(opts.calcQuantityUrl + $('#quantity').val() + '&count=' + $('#count').val(), null, function (data) {
        var values = data.split('|');
        $('#cost').text(values[0]);
        $('#totalCost').text(values[1]);
      });
    });

    loadCreditLog(0, 0);
    loadTransactionLog(0, 0);
  };

  function loadCreditLog(page, pageSize) {
    elements.creditLogIndicator.removeClass('d-none');

    ajaxGet(opts.creditLogUrl.replace('[page]', page).replace('[pageSize]', pageSize), null, function (data) {
      elements.creditLogIndicator.addClass('d-none');
      elements.creditLog.html(data);

      ajaxPagination(elements.creditLog, function (page, size) {
        loadCreditLog(page, size);
      });
    });
  }

  function loadTransactionLog(page, pageSize) {
    elements.transactionLogIndicator.removeClass('d-none');

    ajaxGet(opts.transactionLogUrl.replace('[page]', page).replace('[pageSize]', pageSize), null, function (data) {
      elements.transactionLogIndicator.addClass('d-none');
      elements.transactionLog.html(data);

      ajaxPagination(elements.transactionLog, function (page, size) {
        loadTransactionLog(page, size);
      });
    });
  }
}
