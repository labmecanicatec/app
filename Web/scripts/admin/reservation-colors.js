function ReservationColorManagement(opts) {
  var elements = {
    reservationColorTable: $('#reservationColorTable'),

    deleteRuleId: $('#deleteRuleId'),
    attributeOption: document.getElementById('attributeOption'),

    colorDialog: $('#colorDialog'),
    colorValue: $('#reservationColor'),
    colorForm: $('#colorForm'),

    addDialog: document.getElementById('addDialog'),
    addForm: $('#addForm'),
    deleteDialog: document.getElementById('deleteDialog'),
    deleteForm: $('#deleteForm'),
  };

  ReservationColorManagement.prototype.init = function () {
    elements.reservationColorTable.on('click', '.update', function (e) {
      e.preventDefault();
    });

    elements.reservationColorTable.on('click', '.delete', function () {
      elements.deleteRuleId.val($(this).attr('ruleId'));
      setDialogVisible(elements.deleteDialog, true);
    });

    $('.save').click(function () {
      $(this).closest('form').submit();
    });

    document.getElementById('addRuleButton').addEventListener('click', () => {
      const template = document.getElementById(`attribute${elements.attributeOption.value}`);
      if (!template) return;

      const fillIn = document.getElementById('attributeFillIn');
      const copy = template.cloneNode(true);
      copy.classList.remove('d-none');
      fillIn.replaceChildren(copy);

      setDialogVisible(elements.addDialog, true);
    });

    ConfigureAsyncForm(elements.addForm);
    ConfigureAsyncForm(elements.deleteForm);
  };
}
