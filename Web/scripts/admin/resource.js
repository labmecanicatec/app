/* global InlinePopoverEditor */

function ResourceManagement(opts) {
  var options = opts;

  var elements = {
    activeId: $('#activeId'),
    resourcesList: $('#resourceList'),

    imageDialog: $('#imageDialog'),
    deleteDialog: $('#deletePrompt'),
    statusDialog: $('#statusDialog'),
    durationDialog: $('#durationDialog'),
    capacityDialog: $('#capacityDialog'),
    accessDialog: $('#accessDialog'),

    imageForm: $('#imageForm'),
    removeImageForm: $('#removeImageForm'),
    defaultImageForm: $('#defaultImageForm'),
    deleteForm: $('#deleteForm'),
    durationForm: $('#durationForm'),
    capacityForm: $('#capacityForm'),
    accessForm: $('#accessForm'),
    statusForm: $('#statusForm'),

    statusReasons: '.reasonId',
    statusOptions: '.statusId',
    addStatusReason: '.addStatusReason',
    newStatusReason: '.newStatusReason',
    existingStatusReason: '.existingStatusReason',
    resourceStatusReason: '.resourceStatusReason',
    addStatusIcon: '.addStatusIcon',

    addForm: $('#addResourceForm'),
    statusOptionsFilter: $('#resourceStatusIdFilter'),
    statusReasonsFilter: $('#resourceReasonIdFilter'),
    filterTable: $('#filter-resources-panel'),
    filterButton: $('#filter'),
    clearFilterButton: $('#clearFilter'),

    bulkUpdatePromptButton: $('#bulkUpdatePromptButton'),
    bulkUpdateDialog: $('#bulkUpdateDialog'),
    bulkUpdateList: $('#bulkUpdateList'),
    bulkUpdateForm: $('#bulkUpdateForm'),
    bulkEditStatusOptions: $('#bulkEditStatusId'),
    bulkEditStatusReasons: $('#bulkEditStatusReasonId'),

    addResourceButtons: $('.add-resource'),
    addResourceDialog: $('#add-resource-dialog'),

    userSearch: $('#userSearch'),
    userDialog: $('#userDialog'),
    changeUserForm: $('#changeUserForm'),
    browseUserDialog: $('#allUsers'),
    browseUsersButton: $('#browseUsers'),
    resourceUserList: $('#resourceUserList'),
    allUsersList: $('#allUsersList'),

    groupSearch: $('#groupSearch'),
    groupDialog: $('#groupDialog'),
    browseGroupDialog: $('#allGroups'),
    browseGroupsButton: $('#browseGroups'),
    resourceGroupList: $('#resourceGroupList'),
    allGroupsList: $('#allGroupsList'),

    resourceGroupDialog: $('#resourceGroupDialog'),
    resourceGroupForm: $('#resourceGroupForm'),
    changeGroupForm: $('#changeGroupForm'),
    groupDiv: $('#resourceGroups'),
    autoAssign: $('#autoAssign'),
    removeAllPermissions: $('#autoAssignRemoveAllPermissions'),

    enableCheckIn: $('#enableCheckIn'),
    autoReleaseMinutes: $('#autoReleaseMinutes'),
    autoReleaseMinutesDiv: $('#autoReleaseMinutesDiv'),

    colorForm: $('#colorForm'),
    reservationColor: $('#reservationColor'),

    creditsDialog: $('#creditsDialog'),
    creditsForm: $('#creditsForm'),
    creditsPerSlot: $('#creditsPerSlot'),
    peakCreditsPerSlot: $('#peakCreditsPerSlot'),

    checkAllResources: $('#checkAllResources'),
    checkNoResources: $('#checkNoResources'),

    copyDialog: $('#copyDialog'),
    copyName: $('#copyResourceName'),
    copyForm: $('#copyForm'),

    importDialog: $('#importDialog'),
    importForm: $('#importForm'),
    importTrigger: $('#import-resources'),
    removeImageName: $('#removeImageName'),
    defaultImageName: $('#defaultImageName'),

    bulkDeletePromptButton: $('#bulkDeletePromptButton'),
    bulkDeleteDialog: $('#bulkDeleteDialog'),
    bulkDeleteList: $('#bulkDeleteList'),
    bulkDeleteForm: $('#bulkDeleteForm'),
    checkAllDeleteResources: $('#checkAllDeleteResources'),
    checkNoDeleteResources: $('#checkNoDeleteResources'),

    checkAllowConcurrent: $('#allowConcurrentChk'),
    maxConcurrent: $('#maxConcurrentReservations'),
    allowConcurrentDiv: $('#allowConcurrentDiv'),

    toggleStatusChangeMessage: $('#toggleStatusChangeMessage'),
    sendStatusChangeMessageContent: $('#sendStatusChangeMessageContent'),
    statusMessageContent: $('#statusMessageContent'),
  };

  var resources = {};
  var reasons = [];

  ResourceManagement.prototype.init = function () {
    this.initializeInlineEditors();
    this.bindEventListeners();
    this.configureAsyncForms();
  };

  ResourceManagement.prototype.initializeInlineEditors = function () {
    if (typeof InlinePopoverEditor === 'undefined') {
      return;
    }

    elements.resourcesList.find('.resourceDetails').each(function () {
      var resourceDetails = this;
      if (!resourceDetails.__inlineEditorInit) {
        resourceDetails.__inlineEditorInit = {};
      }
      initializeNameEditor(resourceDetails);
      initializeScheduleEditor(resourceDetails);
      initializeResourceTypeEditor(resourceDetails);
      initializeSortOrderEditor(resourceDetails);
      initializeLocationEditor(resourceDetails);
      initializeContactEditor(resourceDetails);
      initializeResourceAdminEditor(resourceDetails);
      initializeDescriptionEditor(resourceDetails);
      initializeNotesEditor(resourceDetails);
    });
  };

  var initializeNameEditor = function (resourceDetails) {
    var resourceId = resourceDetails.getAttribute('data-resourceId');
    if (!resourceId) {
      return;
    }

    var namespace = 'resourceName' + resourceId;
    if (resourceDetails.__inlineEditorInit[namespace]) {
      return;
    }

    var displayId = 'inlineName' + resourceId;
    var inputId = 'popoverInput' + displayId;
    var editBtnId = 'editBtn' + displayId;
    var displayEl = resourceDetails.querySelector('#' + displayId);
    var inputEl = resourceDetails.querySelector('#' + inputId);
    var editBtn = resourceDetails.querySelector('#' + editBtnId);

    if (!displayEl || !inputEl || !editBtn) {
      return;
    }

    var updateName = function (value) {
      var name = value == null ? '' : String(value);
      displayEl.textContent = name;
      displayEl.dataset.value = name;

      var headerButton = resourceDetails.closest('.resourceItem')?.querySelector('.accordion-header .accordion-button');
      if (headerButton) {
        headerButton.textContent = name;
      }

      if (resources[resourceId]) {
        resources[resourceId].name = name;
      }
    };

    editBtn.addEventListener('click', function () {
      inputEl.value = displayEl.dataset.value || '';
    });

    new InlinePopoverEditor({
      namespace: namespace,
      useFlatpickr: false,
      buttonElement: editBtn,
      buttonSelector: null,
      displaySelector: '#' + displayId,
      inputSelector: '#' + inputId,
      containerSelector: '#inlinePicker' + displayId,
      acceptBtnSelector: '#' + inputId + '_accept',
      cancelBtnSelector: '#' + inputId + '_cancel',
      saveUrl: options.submitUrl + '?action=' + options.changeNameAction,
      getPayload: function () {
        return {
          pk: resourceId,
          name: options.resourceNameKey,
        };
      },
      normalizeValue: function (value) {
        return value == null ? '' : String(value).trim();
      },
      onAfterSave: function (value) {
        updateName(value);
      },
    });

    inputEl.value = displayEl.dataset.value || '';
    resourceDetails.__inlineEditorInit[namespace] = true;
  };

  var initializeScheduleEditor = function (resourceDetails) {
    var resourceId = resourceDetails.getAttribute('data-resourceId');
    if (!resourceId) {
      return;
    }

    var namespace = 'resourceSchedule' + resourceId;
    if (resourceDetails.__inlineEditorInit[namespace]) {
      return;
    }

    var displayId = 'inlineSchedule' + resourceId;
    var inputId = 'popoverInput' + displayId;
    var editBtnId = 'editBtn' + displayId;
    var displayEl = resourceDetails.querySelector('#' + displayId);
    var inputEl = resourceDetails.querySelector('#' + inputId);
    var editBtn = resourceDetails.querySelector('#' + editBtnId);

    if (!displayEl || !inputEl || !editBtn) {
      return;
    }

    editBtn.addEventListener('click', function () {
      inputEl.value = String(displayEl.dataset.value || '');
    });

    new InlinePopoverEditor({
      namespace: namespace,
      useFlatpickr: false,
      buttonElement: editBtn,
      buttonSelector: null,
      displaySelector: '#' + displayId,
      inputSelector: '#' + inputId,
      containerSelector: '#inlinePicker' + displayId,
      acceptBtnSelector: '#' + inputId + '_accept',
      cancelBtnSelector: '#' + inputId + '_cancel',
      saveUrl: options.submitUrl + '?action=' + options.changeScheduleAction,
      getPayload: function () {
        return {
          pk: resourceId,
          name: options.resourceScheduleKey,
        };
      },
      normalizeValue: function (value) {
        return String(value == null ? '' : value);
      },
      formatDisplay: function (value) {
        var key = String(value == null ? '' : value);
        if (options.scheduleNames && Object.prototype.hasOwnProperty.call(options.scheduleNames, key)) {
          return options.scheduleNames[key];
        }
        return key;
      },
      onAfterSave: function (value) {
        if (resources[resourceId]) {
          resources[resourceId].scheduleId = String(value == null ? '' : value);
        }
      },
    });

    inputEl.value = String(displayEl.dataset.value || '');
    resourceDetails.__inlineEditorInit[namespace] = true;
  };

  var initializeResourceTypeEditor = function (resourceDetails) {
    var resourceId = resourceDetails.getAttribute('data-resourceId');
    if (!resourceId) {
      return;
    }

    var namespace = 'resourceType' + resourceId;
    if (resourceDetails.__inlineEditorInit[namespace]) {
      return;
    }

    var displayId = 'inlineResourceType' + resourceId;
    var inputId = 'popoverInput' + displayId;
    var editBtnId = 'editBtn' + displayId;
    var displayEl = resourceDetails.querySelector('#' + displayId);
    var inputEl = resourceDetails.querySelector('#' + inputId);
    var editBtn = resourceDetails.querySelector('#' + editBtnId);

    if (!displayEl || !inputEl || !editBtn) {
      return;
    }

    editBtn.addEventListener('click', function () {
      inputEl.value = String(displayEl.dataset.value || '0');
    });

    new InlinePopoverEditor({
      namespace: namespace,
      useFlatpickr: false,
      buttonElement: editBtn,
      buttonSelector: null,
      displaySelector: '#' + displayId,
      inputSelector: '#' + inputId,
      containerSelector: '#inlinePicker' + displayId,
      acceptBtnSelector: '#' + inputId + '_accept',
      cancelBtnSelector: '#' + inputId + '_cancel',
      saveUrl: options.submitUrl + '?action=' + options.changeResourceTypeAction,
      getPayload: function () {
        return {
          pk: resourceId,
          name: options.resourceTypeKey,
        };
      },
      normalizeValue: function (value) {
        var normalized = String(value == null ? '' : value);
        return normalized === '' ? '0' : normalized;
      },
      formatDisplay: function (value) {
        var key = String(value == null ? '' : value);
        var normalized = key === '' ? '0' : key;
        if (options.resourceTypeNames && Object.prototype.hasOwnProperty.call(options.resourceTypeNames, normalized)) {
          return options.resourceTypeNames[normalized];
        }
        return options.noResourceTypeLabel;
      },
      onAfterSave: function (value) {
        if (resources[resourceId]) {
          resources[resourceId].resourceTypeId = String(value == null ? '0' : value);
        }
      },
    });

    inputEl.value = String(displayEl.dataset.value || '0');
    resourceDetails.__inlineEditorInit[namespace] = true;
  };

  var initializeSortOrderEditor = function (resourceDetails) {
    var resourceId = resourceDetails.getAttribute('data-resourceId');
    if (!resourceId) {
      return;
    }

    var namespace = 'resourceSortOrder' + resourceId;
    if (resourceDetails.__inlineEditorInit[namespace]) {
      return;
    }

    var displayId = 'inlineSortOrder' + resourceId;
    var inputId = 'popoverInput' + displayId;
    var editBtnId = 'editBtn' + displayId;
    var displayEl = resourceDetails.querySelector('#' + displayId);
    var inputEl = resourceDetails.querySelector('#' + inputId);
    var editBtn = resourceDetails.querySelector('#' + editBtnId);

    if (!displayEl || !inputEl || !editBtn) {
      return;
    }

    var normalizeSortOrder = function (value) {
      var parsed = Number.parseInt(String(value == null ? '' : value), 10);
      if (Number.isNaN(parsed)) {
        return '0';
      }
      if (parsed < 0) {
        return '0';
      }
      if (parsed > 999) {
        return '999';
      }
      return String(parsed);
    };

    editBtn.addEventListener('click', function () {
      inputEl.value = normalizeSortOrder(displayEl.dataset.value || '0');
    });

    new InlinePopoverEditor({
      namespace: namespace,
      useFlatpickr: false,
      buttonElement: editBtn,
      buttonSelector: null,
      displaySelector: '#' + displayId,
      inputSelector: '#' + inputId,
      containerSelector: '#inlinePicker' + displayId,
      acceptBtnSelector: '#' + inputId + '_accept',
      cancelBtnSelector: '#' + inputId + '_cancel',
      saveUrl: options.submitUrl + '?action=' + options.changeSortOrderAction,
      getPayload: function () {
        return {
          pk: resourceId,
          name: options.sortOrderKey,
        };
      },
      normalizeValue: function (value) {
        return normalizeSortOrder(value);
      },
      formatDisplay: function (value) {
        return normalizeSortOrder(value);
      },
      onAfterSave: function (value) {
        var normalized = normalizeSortOrder(value);
        if (resources[resourceId]) {
          resources[resourceId].sortOrder = normalized;
        }
      },
    });

    inputEl.value = normalizeSortOrder(displayEl.dataset.value || '0');
    resourceDetails.__inlineEditorInit[namespace] = true;
  };

  var initializeLocationEditor = function (resourceDetails) {
    var resourceId = resourceDetails.getAttribute('data-resourceId');
    if (!resourceId) {
      return;
    }

    var namespace = 'resourceLocation' + resourceId;
    if (resourceDetails.__inlineEditorInit[namespace]) {
      return;
    }

    var displayId = 'inlineLocation' + resourceId;
    var inputId = 'popoverInput' + displayId;
    var editBtnId = 'editBtn' + displayId;
    var displayEl = resourceDetails.querySelector('#' + displayId);
    var inputEl = resourceDetails.querySelector('#' + inputId);
    var editBtn = resourceDetails.querySelector('#' + editBtnId);

    if (!displayEl || !inputEl || !editBtn) {
      return;
    }

    editBtn.addEventListener('click', function () {
      inputEl.value = displayEl.dataset.value || '';
    });

    new InlinePopoverEditor({
      namespace: namespace,
      useFlatpickr: false,
      buttonElement: editBtn,
      buttonSelector: null,
      displaySelector: '#' + displayId,
      inputSelector: '#' + inputId,
      containerSelector: '#inlinePicker' + displayId,
      acceptBtnSelector: '#' + inputId + '_accept',
      cancelBtnSelector: '#' + inputId + '_cancel',
      saveUrl: options.submitUrl + '?action=' + options.changeLocationAction,
      getPayload: function () {
        return {
          pk: resourceId,
          name: options.resourceLocationKey,
        };
      },
      normalizeValue: function (value) {
        return value == null ? '' : String(value).trim();
      },
      formatDisplay: function (value) {
        var normalized = value == null ? '' : String(value).trim();
        return normalized === '' ? options.noLocationLabel : normalized;
      },
      onAfterSave: function (value) {
        var normalized = value == null ? '' : String(value).trim();
        if (resources[resourceId]) {
          resources[resourceId].location = normalized;
        }
      },
    });

    inputEl.value = displayEl.dataset.value || '';
    resourceDetails.__inlineEditorInit[namespace] = true;
  };

  var initializeContactEditor = function (resourceDetails) {
    var resourceId = resourceDetails.getAttribute('data-resourceId');
    if (!resourceId) {
      return;
    }

    var namespace = 'resourceContact' + resourceId;
    if (resourceDetails.__inlineEditorInit[namespace]) {
      return;
    }

    var displayId = 'inlineContact' + resourceId;
    var inputId = 'popoverInput' + displayId;
    var editBtnId = 'editBtn' + displayId;
    var displayEl = resourceDetails.querySelector('#' + displayId);
    var inputEl = resourceDetails.querySelector('#' + inputId);
    var editBtn = resourceDetails.querySelector('#' + editBtnId);

    if (!displayEl || !inputEl || !editBtn) {
      return;
    }

    if (options.resourceContactIsUser && window.jQuery && window.jQuery.fn && window.jQuery.fn.userAutoComplete) {
      var $input = window.jQuery(inputEl);
      if (!$input.data('inlineContactAutocompleteInit')) {
        $input.userAutoComplete(options.userAutocompleteUrl);
        $input.data('inlineContactAutocompleteInit', true);
      }
    }

    editBtn.addEventListener('click', function () {
      inputEl.value = displayEl.dataset.value || '';
    });

    new InlinePopoverEditor({
      namespace: namespace,
      useFlatpickr: false,
      buttonElement: editBtn,
      buttonSelector: null,
      displaySelector: '#' + displayId,
      inputSelector: '#' + inputId,
      containerSelector: '#inlinePicker' + displayId,
      acceptBtnSelector: '#' + inputId + '_accept',
      cancelBtnSelector: '#' + inputId + '_cancel',
      saveUrl: options.submitUrl + '?action=' + options.changeContactAction,
      getPayload: function () {
        return {
          pk: resourceId,
          name: options.resourceContactKey,
        };
      },
      normalizeValue: function (value) {
        return value == null ? '' : String(value).trim();
      },
      formatDisplay: function (value) {
        var normalized = value == null ? '' : String(value).trim();
        return normalized === '' ? options.noContactLabel : normalized;
      },
      onAfterSave: function (value) {
        var normalized = value == null ? '' : String(value).trim();
        if (resources[resourceId]) {
          resources[resourceId].contact = normalized;
        }
      },
    });

    inputEl.value = displayEl.dataset.value || '';
    resourceDetails.__inlineEditorInit[namespace] = true;
  };

  var initializeResourceAdminEditor = function (resourceDetails) {
    var resourceId = resourceDetails.getAttribute('data-resourceId');
    if (!resourceId) {
      return;
    }

    var namespace = 'resourceAdmin' + resourceId;
    if (resourceDetails.__inlineEditorInit[namespace]) {
      return;
    }

    var displayId = 'inlineResourceAdmin' + resourceId;
    var inputId = 'popoverInput' + displayId;
    var editBtnId = 'editBtn' + displayId;
    var displayEl = resourceDetails.querySelector('#' + displayId);
    var inputEl = resourceDetails.querySelector('#' + inputId);
    var editBtn = resourceDetails.querySelector('#' + editBtnId);

    if (!displayEl || !inputEl || !editBtn) {
      return;
    }

    var normalizeAdminValue = function (value) {
      var normalized = String(value == null ? '' : value).trim();
      return normalized === '' ? '0' : normalized;
    };

    editBtn.addEventListener('click', function () {
      inputEl.value = normalizeAdminValue(displayEl.dataset.value || '0');
    });

    new InlinePopoverEditor({
      namespace: namespace,
      useFlatpickr: false,
      buttonElement: editBtn,
      buttonSelector: null,
      displaySelector: '#' + displayId,
      inputSelector: '#' + inputId,
      containerSelector: '#inlinePicker' + displayId,
      acceptBtnSelector: '#' + inputId + '_accept',
      cancelBtnSelector: '#' + inputId + '_cancel',
      saveUrl: options.submitUrl + '?action=' + options.changeResourceAdminAction,
      getPayload: function () {
        return {
          pk: resourceId,
          name: options.resourceAdminKey,
        };
      },
      normalizeValue: function (value) {
        return normalizeAdminValue(value);
      },
      formatDisplay: function (value) {
        var normalized = normalizeAdminValue(value);
        if (
          options.resourceAdminNames &&
          Object.prototype.hasOwnProperty.call(options.resourceAdminNames, normalized)
        ) {
          return options.resourceAdminNames[normalized];
        }
        return options.noResourceAdminLabel;
      },
      onAfterSave: function (value) {
        var normalized = normalizeAdminValue(value);
        if (resources[resourceId]) {
          resources[resourceId].adminGroupId = normalized;
        }
      },
    });

    inputEl.value = normalizeAdminValue(displayEl.dataset.value || '0');
    resourceDetails.__inlineEditorInit[namespace] = true;
  };
  ResourceManagement.prototype.bindEventListeners = function () {
    elements.resourcesList.on('click', '.update', function (e) {
      e.preventDefault();
      var id = $(this).closest('.resourceDetails').attr('data-resourceId');
      setActiveResourceId(id);
    });

    elements.resourcesList.on('click', '.copyButton', function (e) {
      e.stopPropagation();
      elements.copyName.val(getActiveResource().name + ' ' + options.copyText);
      elements.copyDialog.modal('show');
      elements.copyName.select().focus();
    });

    //edit image
    elements.resourcesList.on('click', '.imageButton', function (e) {
      showChangeImage(e);
    });

    elements.imageDialog.on('click', '.defaultImage', function (e) {
      e.preventDefault();
      var image = $(e.target).closest('.resource-image').attr('id');
      elements.defaultImageName.val(image);
      elements.defaultImageForm.submit();
    });

    elements.imageDialog.on('click', '.deleteImage', function (e) {
      e.preventDefault();
      var image = $(e.target).closest('.resource-image').attr('id');
      elements.removeImageName.val(image);
      elements.removeImageForm.submit();
    });

    elements.imageDialog.on('hidden.bs.modal', function () {
      window.location.reload();
    });

    //edit resource color
    elements.resourcesList.on('change', '.resourceColorPicker', function (e) {
      setActiveResourceId($(this).closest('.resourceDetails').attr('data-resourceId'));
      var color = $(this).val();
      elements.reservationColor.val(color);
      elements.colorForm.submit();
    });

    elements.resourcesList.on('click', '.clearColor', function (e) {
      $(this).siblings('.resourceColorPicker').val('#ffffff');
      elements.reservationColor.val('');
      elements.colorForm.submit();
    });

    //modals
    elements.resourcesList.on('click', '.adminButton', function (e) {
      showResourceAdmin(e);
    });

    elements.resourcesList.on('click', '.deleteButton', function (e) {
      showDeletePrompt(e);
    });

    elements.resourcesList.on('click', '.changeStatus', function (e) {
      showStatusPrompt(e);
    });

    elements.resourcesList.on('click', '.changeDuration', function (e) {
      showDurationPrompt(e);
    });

    elements.resourcesList.on('click', '.changeCapacity', function (e) {
      showCapacityPrompt(e);
    });

    elements.resourcesList.on('click', '.changeAccess', function (e) {
      showAccessPrompt(e);
    });

    elements.resourcesList.on('click', '.changeUserPermission', function (e) {
      changeUserPermissions();
      elements.userDialog.modal('show');
    });

    elements.resourcesList.on('click', '.changeGroupPermissions', function (e) {
      changeGroupPermissions();
      elements.groupDialog.modal('show');
    });

    elements.resourcesList.on('click', '.changeResourceGroups', function (e) {
      changeResourceGroups();
      elements.resourceGroupDialog.modal('show');
    });

    elements.resourcesList.on('click', '.changeCredits', function (e) {
      var resource = getActiveResource();
      elements.creditsPerSlot.val(resource.credits);
      elements.peakCreditsPerSlot.val(resource.peakCredits);
      elements.creditsDialog.modal('show');
    });

    elements.resourcesList.on('click', '.enableSubscription, .disableSubscription', function (e) {
      e.preventDefault();
      const details = $(this).closest('.resourceDetails');
      const action = $(this).hasClass('enableSubscription')
        ? options.actions.enableSubscription
        : options.actions.disableSubscription; // Determine the action
      const subscriptionCallback = function (data) {
        details.find('.publicSettingsPlaceHolder').html(data || '<p>No data received</p>');
      };
      PerformAsyncAction(details, getSubmitCallback(action), $('#subscriptionIndicator'), subscriptionCallback);
    });

    elements.checkAllResources.click(function (e) {
      e.preventDefault();
      elements.bulkUpdateList.find('input:checkbox').prop('checked', true);
    });

    elements.checkNoResources.click(function (e) {
      e.preventDefault();
      elements.bulkUpdateList.find('input:checkbox').prop('checked', false);
    });

    elements.checkAllDeleteResources.click(function (e) {
      e.preventDefault();
      elements.bulkDeleteList.find('input:checkbox').prop('checked', true);
    });

    elements.checkNoDeleteResources.click(function (e) {
      e.preventDefault();
      elements.bulkDeleteList.find('input:checkbox').prop('checked', false);
    });

    $('.save').click(function () {
      $(this).closest('form').submit();
    });

    $('.cancel').click(function () {
      $(this).closest('.modal').modal('hide');
    });

    elements.addResourceButtons.click(function (e) {
      e.preventDefault();
      elements.addResourceDialog.modal('show');
      $('#resourceName').focus();
    });

    elements.bulkEditStatusOptions.change(function (e) {
      populateReasonOptions(elements.bulkEditStatusOptions.val(), elements.bulkEditStatusReasons);
    });

    elements.statusOptionsFilter.change(function (e) {
      populateReasonOptions(elements.statusOptionsFilter.val(), elements.statusReasonsFilter);
    });

    elements.clearFilterButton.click(function (e) {
      e.preventDefault();
      elements.filterTable.find('input,select,textarea').val('');

      filterResources();
    });

    wireUpCheckboxToggle(elements.bulkUpdateDialog);

    $('#bulkEditEnableCheckIn').change(function () {
      if ($(this).val() == '1') {
        $('#bulkUpdateAutoReleaseMinutesDiv').removeClass('d-none');
      }

      if ($(this).val() == '0') {
        $('#bulkUpdateAutoReleaseMinutesDiv').addClass('d-none');
      }
    });

    $('#bulkEditConcurrent').change(function () {
      if ($(this).val() == '1') {
        $('#bulkEditAllowConcurrentDiv').removeClass('d-none');
      }

      if ($(this).val() == '0') {
        $('#bulkEditAllowConcurrentDiv').addClass('d-none');
      }
    });

    elements.bulkUpdatePromptButton.click(function (e) {
      e.preventDefault();

      var items = [];
      elements.bulkUpdateList.empty();
      $.each(resources, function (i, r) {
        var checkId = 'bulk' + r.id;
        items.push(
          '<div class="form-check">' +
            '<input class="form-check-input" type="checkbox" id="' +
            checkId +
            '" name="resourceId[]" checked="checked" value="' +
            r.id +
            '" />' +
            '<label class="form-check-label" for="' +
            checkId +
            '">' +
            r.name +
            '</label>' +
            '</div>'
        );
      });
      $('<div/>', { html: items.join('') }).appendTo(elements.bulkUpdateList);

      $('#bulkUpdateDialog').modal('show');
    });

    elements.bulkDeletePromptButton.click(function (e) {
      e.preventDefault();

      var items = [];
      elements.bulkDeleteList.empty();
      $.each(resources, function (i, r) {
        var checkId = 'bulk' + r.id;
        items.push(
          '<div class="form-check">' +
            '<input class="form-check-input" type="checkbox" id="' +
            checkId +
            '" name="resourceId[]" checked="checked" value="' +
            r.id +
            '" />' +
            '<label class="form-check-label" for="' +
            checkId +
            '">' +
            r.name +
            '</label>' +
            '</div>'
        );
      });
      $('<div/>', { html: items.join('') }).appendTo(elements.bulkDeleteList);

      $('#bulkDeleteDialog').modal('show');
    });

    elements.userSearch.userAutoComplete(options.userAutocompleteUrl, function (ui) {
      changeUserPermission(ui.item.value, '1');
      elements.userSearch.val('');
    });

    elements.groupSearch.groupAutoComplete(options.groupAutocompleteUrl, function (ui) {
      changeGroupPermission(ui.item.value, '1');
      elements.groupSearch.val('');
    });

    elements.browseUsersButton.click(function (e) {
      e.preventDefault();
      showAllUsersToAdd();
    });

    elements.resourceUserList.on('change', '.change-permission-type', function (e) {
      e.preventDefault();
      var userId = $(this).data('user-id');
      var type = $(this).val();
      changeUserPermission(userId, type);
    });

    elements.allUsersList.on('change', '.change-permission-type', function (e) {
      e.preventDefault();
      var userId = $(this).data('user-id');
      var type = $(this).val();
      changeUserPermission(userId, type);
    });

    elements.browseGroupsButton.click(function (e) {
      e.preventDefault();
      showAllGroupsToAdd();
    });

    elements.resourceGroupList.on('change', '.change-permission-type', function (e) {
      e.preventDefault();
      var groupId = $(this).data('group-id');
      var type = $(this).val();
      changeGroupPermission(groupId, type);
    });

    elements.allGroupsList.on('change', '.change-permission-type', function (e) {
      e.preventDefault();
      var groupId = $(this).data('group-id');
      var type = $(this).val();
      changeGroupPermission(groupId, type);
    });

    elements.autoAssign.on('click', function () {
      elements.removeAllPermissions.find('input').prop('checked', false);
      if (!elements.autoAssign.is(':checked')) {
        elements.removeAllPermissions.collapse('show');
      } else {
        elements.removeAllPermissions.collapse('hide');
      }
    });

    elements.enableCheckIn.on('click', function () {
      showHideAutoRelease();
    });

    elements.checkAllowConcurrent.on('click', function () {
      showHideConcurrent();
    });

    wireUpCheckboxToggle(elements.durationForm);
    wireUpCheckboxToggle(elements.capacityForm);
    wireUpCheckboxToggle(elements.accessForm);
    wireUpCheckboxToggle(elements.bulkUpdateForm);

    elements.importTrigger.click(function (e) {
      e.preventDefault();
      $('#importErrors').empty().addClass('d-none');
      $('#importResults').addClass('d-none');
      elements.importDialog.modal('show');
    });

    elements.toggleStatusChangeMessage.on('change', function (e) {
      if ($(this).is(':checked')) {
        elements.sendStatusChangeMessageContent.removeClass('d-none');
      } else {
        elements.sendStatusChangeMessageContent.addClass('d-none');
      }
    });
  };

  var initializeDescriptionEditor = function (resourceDetails) {
    var resourceId = resourceDetails.getAttribute('data-resourceId');
    if (!resourceId) {
      return;
    }

    var namespace = 'resourceDescription' + resourceId;
    if (resourceDetails.__inlineEditorInit[namespace]) {
      return;
    }

    var displayId = 'inlineDescription' + resourceId;
    var inputId = 'popoverInput' + displayId;
    var editBtnId = 'editBtn' + displayId;
    var displayEl = resourceDetails.querySelector('#' + displayId);
    var inputEl = resourceDetails.querySelector('#' + inputId);
    var editBtn = resourceDetails.querySelector('#' + editBtnId);

    if (!displayEl || !inputEl || !editBtn) {
      return;
    }

    var $input = null;

    var sanitizeHtml = function (value) {
      var html = value == null ? '' : String(value);
      if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
        return window.DOMPurify.sanitize(html);
      }
      return html;
    };

    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.trumbowyg) {
      $input = window.jQuery(inputEl);
      if (!$input.data('trumbowyg')) {
        $input.trumbowyg({
          tagsToRemove: ['script', 'link'],
          removeformatPasted: true,
          urlProtocol: true,
          btns: [['bold', 'italic', 'underline'], ['link'], ['unorderedList', 'orderedList']],
        });
      }

      $input.on('tbwchange', function () {
        inputEl.value = sanitizeHtml($input.trumbowyg('html'));
      });
    }

    editBtn.addEventListener('click', function () {
      var value = displayEl.dataset.value || '';
      if ($input && $input.data('trumbowyg')) {
        $input.trumbowyg('html', value);
        inputEl.value = sanitizeHtml(value);
      } else {
        inputEl.value = value;
      }
    });

    new InlinePopoverEditor({
      namespace: namespace,
      useFlatpickr: false,
      buttonElement: editBtn,
      buttonSelector: null,
      displaySelector: '#' + displayId,
      inputSelector: '#' + inputId,
      containerSelector: '#inlinePicker' + displayId,
      acceptBtnSelector: '#' + inputId + '_accept',
      cancelBtnSelector: '#' + inputId + '_cancel',
      saveUrl: options.submitUrl + '?action=' + options.changeDescriptionAction,
      getPayload: function () {
        return {
          pk: resourceId,
          name: options.resourceDescriptionKey,
        };
      },
      normalizeValue: function (value) {
        if ($input && $input.data('trumbowyg')) {
          return sanitizeHtml($input.trumbowyg('html'));
        }
        return sanitizeHtml(value);
      },
      formatDisplay: function (value) {
        var cleaned = sanitizeHtml(value);
        return cleaned === '' ? options.noDescriptionLabel : cleaned;
      },
      onAfterSave: function (value) {
        var cleaned = sanitizeHtml(value);
        if (cleaned === '') {
          displayEl.textContent = options.noDescriptionLabel;
          displayEl.dataset.value = '';
          if ($input && $input.data('trumbowyg')) {
            $input.trumbowyg('html', '');
          }
          return;
        }

        displayEl.innerHTML = cleaned;
        displayEl.dataset.value = cleaned;

        if ($input && $input.data('trumbowyg')) {
          $input.trumbowyg('html', cleaned);
        }
      },
    });

    var currentValue = displayEl.dataset.value || '';
    if ($input && $input.data('trumbowyg')) {
      $input.trumbowyg('html', currentValue);
      inputEl.value = sanitizeHtml(currentValue);
    } else {
      inputEl.value = currentValue;
    }

    resourceDetails.__inlineEditorInit[namespace] = true;
  };

  var initializeNotesEditor = function (resourceDetails) {
    var resourceId = resourceDetails.getAttribute('data-resourceId');
    if (!resourceId) {
      return;
    }

    var namespace = 'resourceNotes' + resourceId;
    if (resourceDetails.__inlineEditorInit[namespace]) {
      return;
    }

    var displayId = 'inlineNotes' + resourceId;
    var inputId = 'popoverInput' + displayId;
    var editBtnId = 'editBtn' + displayId;
    var displayEl = resourceDetails.querySelector('#' + displayId);
    var inputEl = resourceDetails.querySelector('#' + inputId);
    var editBtn = resourceDetails.querySelector('#' + editBtnId);

    if (!displayEl || !inputEl || !editBtn) {
      return;
    }

    var $input = null;

    var sanitizeHtml = function (value) {
      var html = value == null ? '' : String(value);
      if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
        return window.DOMPurify.sanitize(html);
      }
      return html;
    };

    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.trumbowyg) {
      $input = window.jQuery(inputEl);
      if (!$input.data('trumbowyg')) {
        $input.trumbowyg({
          tagsToRemove: ['script', 'link'],
          removeformatPasted: true,
          urlProtocol: true,
          btns: [['bold', 'italic', 'underline'], ['link'], ['unorderedList', 'orderedList']],
        });
      }

      $input.on('tbwchange', function () {
        inputEl.value = sanitizeHtml($input.trumbowyg('html'));
      });
    }

    editBtn.addEventListener('click', function () {
      var value = displayEl.dataset.value || '';
      if ($input && $input.data('trumbowyg')) {
        $input.trumbowyg('html', value);
        inputEl.value = sanitizeHtml(value);
      } else {
        inputEl.value = value;
      }
    });

    new InlinePopoverEditor({
      namespace: namespace,
      useFlatpickr: false,
      buttonElement: editBtn,
      buttonSelector: null,
      displaySelector: '#' + displayId,
      inputSelector: '#' + inputId,
      containerSelector: '#inlinePicker' + displayId,
      acceptBtnSelector: '#' + inputId + '_accept',
      cancelBtnSelector: '#' + inputId + '_cancel',
      saveUrl: options.submitUrl + '?action=' + options.changeNotesAction,
      getPayload: function () {
        return {
          pk: resourceId,
          name: options.resourceNotesKey,
        };
      },
      normalizeValue: function (value) {
        if ($input && $input.data('trumbowyg')) {
          return sanitizeHtml($input.trumbowyg('html'));
        }
        return sanitizeHtml(value);
      },
      formatDisplay: function (value) {
        var cleaned = sanitizeHtml(value);
        return cleaned === '' ? options.noNotesLabel : cleaned;
      },
      onAfterSave: function (value) {
        var cleaned = sanitizeHtml(value);
        if (cleaned === '') {
          displayEl.textContent = options.noNotesLabel;
          displayEl.dataset.value = '';
          if ($input && $input.data('trumbowyg')) {
            $input.trumbowyg('html', '');
          }
          return;
        }

        displayEl.innerHTML = cleaned;
        displayEl.dataset.value = cleaned;

        if ($input && $input.data('trumbowyg')) {
          $input.trumbowyg('html', cleaned);
        }
      },
    });

    var currentValue = displayEl.dataset.value || '';
    if ($input && $input.data('trumbowyg')) {
      $input.trumbowyg('html', currentValue);
      inputEl.value = sanitizeHtml(currentValue);
    } else {
      inputEl.value = currentValue;
    }

    resourceDetails.__inlineEditorInit[namespace] = true;
  };

  ResourceManagement.prototype.configureAsyncForms = function () {
    var imageSaveErrorHandler = function (result) {
      alert(result);
    };

    var combineIntervals = function (jqForm, opts) {
      $(jqForm)
        .find('.interval')
        .each(function (i, v) {
          var id = $(v).attr('id');
          var d = $('#' + id + 'Days').val();
          var h = $('#' + id + 'Hours').val();
          var m = $('#' + id + 'Minutes').val();
          $(v).val(d + 'd' + h + 'h' + m + 'm');
        });
    };

    var bulkUpdateErrorHandler = function (result) {
      $('#bulkUpdateErrors').html(result).show();
    };

    var errorHandler = function (result) {
      $('#globalError').html(result).show();
    };

    var importHandler = function (responseText, form) {
      if (!responseText) {
        return;
      }

      $('#importCount').text(responseText.importCount);
      $('#importSkipped').text(responseText.skippedRows.length > 0 ? responseText.skippedRows.join(',') : '0');
      $('#importResult').removeClass('d-none');

      var errors = $('#importErrors');
      errors.empty();
      if (responseText.messages && responseText.messages.length > 0) {
        var messages = responseText.messages.join('</li><li>');
        errors.html('<div>' + messages + '</div>').removeClass('d-none');
      }
    };

    ConfigureAsyncForm(
      elements.imageForm,
      defaultSubmitCallback(elements.imageForm),
      function (data) {
        onImagesUpdated(data);
      },
      imageSaveErrorHandler
    );

    ConfigureAsyncForm(elements.removeImageForm, defaultSubmitCallback(elements.removeImageForm), function (data) {
      onImagesUpdated(data);
    });

    ConfigureAsyncForm(elements.defaultImageForm, defaultSubmitCallback(elements.defaultImageForm), function (data) {
      onImagesUpdated(data);
    });

    ConfigureAsyncForm(elements.addForm, defaultSubmitCallback(elements.addForm), null, handleAddError);
    ConfigureAsyncForm(elements.deleteForm, defaultSubmitCallback(elements.deleteForm), function (result) {
      var id = getActiveResourceId();
      console.log('deleting ' + id);
      elements.resourcesList
        .find('[data-resourceid="' + id + '"]')
        .closest('tr')
        .remove();
      elements.deleteDialog.modal('hide');
    });
    ConfigureAsyncForm(elements.durationForm, defaultSubmitCallback(elements.durationForm), onDurationSaved, null, {
      onBeforeSerialize: combineIntervals,
    });
    ConfigureAsyncForm(elements.capacityForm, defaultSubmitCallback(elements.capacityForm), onCapacitySaved);
    ConfigureAsyncForm(elements.accessForm, defaultSubmitCallback(elements.accessForm), onAccessSaved, null, {
      onBeforeSerialize: combineIntervals,
    });
    ConfigureAsyncForm(
      elements.bulkUpdateForm,
      defaultSubmitCallback(elements.bulkUpdateForm),
      null,
      bulkUpdateErrorHandler,
      { onBeforeSerialize: combineIntervals }
    );
    ConfigureAsyncForm(
      elements.changeUserForm,
      defaultSubmitCallback(elements.changeUserForm),
      changeUserPermissions,
      errorHandler
    );
    ConfigureAsyncForm(
      elements.changeGroupForm,
      defaultSubmitCallback(elements.changeGroupForm),
      changeGroupPermissions,
      errorHandler
    );
    ConfigureAsyncForm(
      elements.resourceGroupForm,
      defaultSubmitCallback(elements.resourceGroupForm),
      onResourceGroupsSaved
    );
    ConfigureAsyncForm(elements.colorForm, defaultSubmitCallback(elements.colorForm), function () {});
    ConfigureAsyncForm(
      elements.creditsForm,
      defaultSubmitCallback(elements.creditsForm),
      onCreditsSaved,
      null,
      errorHandler
    );
    ConfigureAsyncForm(elements.copyForm, defaultSubmitCallback(elements.copyForm));
    ConfigureAsyncForm(elements.importForm, defaultSubmitCallback(elements.importForm), importHandler);
    ConfigureAsyncForm(elements.bulkDeleteForm, defaultSubmitCallback(elements.bulkDeleteForm));
    ConfigureAsyncForm(elements.statusForm, defaultSubmitCallback(elements.statusForm));
  };

  ResourceManagement.prototype.add = function (resource) {
    resources[resource.id] = resource;
  };

  ResourceManagement.prototype.addStatusReason = function (id, statusId, description) {
    if (!(statusId in reasons)) {
      reasons[statusId] = [];
    }

    reasons[statusId].push({ id: id, description: description });
  };

  ResourceManagement.prototype.initializeStatusFilter = function (statusId, reasonId) {
    elements.statusOptionsFilter.val(statusId);
    elements.statusOptionsFilter.trigger('change');
    elements.statusReasonsFilter.val(reasonId);
  };

  ResourceManagement.prototype.addResourceGroups = function (resourceGroups) {
    elements.groupDiv.tree({
      data: resourceGroups,
      saveState: false,
      dragAndDrop: false,
      selectable: false,
      autoOpen: true,

      onCreateLi: function (node, $li) {
        var span = $li.find('span');
        var itemName = span.text();
        var id = 'group_id' + node.id;

        var label = $(
          '<div class="form-check"><input group-id="' +
            node.id +
            '" name="group_id[]" class="form-check-input" type="checkbox" id="' +
            id +
            '" value="' +
            node.id +
            '"/><label class="form-check-label" for="' +
            id +
            '">' +
            itemName +
            '</label></div>'
        );

        $li.find('span').html(label);
      },
    });
  };

  var getSubmitCallback = function (action) {
    return function () {
      return options.submitUrl + '?rid=' + getActiveResourceId() + '&action=' + action;
    };
  };

  var defaultSubmitCallback = function (form) {
    return function () {
      return options.submitUrl + '?action=' + form.attr('ajaxAction') + '&rid=' + getActiveResourceId();
    };
  };

  var setActiveResourceId = function (resourceId) {
    elements.activeId.val(resourceId);
  };

  var getActiveResourceId = function () {
    return elements.activeId.val();
  };

  var getResource = function (id) {
    return resources[id];
  };

  var getActiveResource = function () {
    return getResource(getActiveResourceId());
  };

  var refreshResourceImages = function (resource) {
    var imageContainer = $('#resource-images');
    imageContainer.empty();

    var imageContents = function (image, isDefault) {
      imageContainer.append(
        '<div class="resource-image col-4" id="' +
          image +
          '"><img class="w-100" src="' +
          image +
          '"/><div class="text-center">' +
          (isDefault ? 'Default' : '<a href="#" class="defaultImage link-primary">Default</a>') +
          ' | <a href="#" class="deleteImage link-danger"><i class="bi bi-trash3-fill me-1"></i>Remove</a></div></div>'
      );
    };

    if (resource.image) {
      imageContents(resource.image, true);
    }

    for (var i = 0; i < resource.images.length; i++) {
      imageContents(resource.images[i]);
    }
  };

  var showChangeImage = function (e) {
    e.preventDefault();
    var resource = getActiveResource();
    refreshResourceImages(resource);
    elements.imageDialog.modal('show');
  };

  var onImagesUpdated = function (resource) {
    refreshResourceImages(resource);
    getActiveResource().image = resource.image;
    getActiveResource().images = resource.images;
  };

  var showResourceAdmin = function (e) {
    $('#adminGroupId').val(getActiveResource().adminGroupId);
    elements.groupAdminDialog.modal('show');
  };

  var showDeletePrompt = function (e) {
    e.preventDefault();
    elements.deleteDialog.modal('show');
  };

  var showDurationPrompt = function (e) {
    var resource = getActiveResource();

    setDaysHoursMinutes('#minDuration', resource.minLength, $('#noMinimumDuration'));
    setDaysHoursMinutes('#maxDuration', resource.maxLength, $('#noMaximumDuration'));
    setDaysHoursMinutes('#bufferTime', resource.bufferTime, $('#noBufferTime'));
    $('#allowMultiDay').prop('checked', resource.allowMultiday && resource.allowMultiday == '1');

    elements.durationDialog.modal('show');
  };

  var showCapacityPrompt = function (e) {
    var resource = getActiveResource();

    showHideConfiguration(resource.maxParticipants, $('#maxCapacity'), $('#unlimitedCapacity'));
    elements.capacityDialog.modal('show');
  };

  var showAccessPrompt = function (e) {
    var resource = getActiveResource();

    setDaysHoursMinutes('#startNoticeAdd', resource.startNoticeAdd, $('#noStartNoticeAdd'));
    setDaysHoursMinutes('#startNoticeUpdate', resource.startNoticeUpdate, $('#noStartNoticeUpdate'));
    setDaysHoursMinutes('#startNoticeDelete', resource.startNoticeDelete, $('#noStartNoticeDelete'));
    setDaysHoursMinutes('#endNotice', resource.endNotice, $('#noEndNotice'));

    $('#requiresApproval').prop('checked', resource.requiresApproval && resource.requiresApproval == '1');

    elements.autoAssign.prop('checked', resource.autoAssign && resource.autoAssign == '1');

    elements.removeAllPermissions.addClass('collapse');

    elements.enableCheckIn.prop('checked', resource.enableCheckin && resource.enableCheckin == '1');
    elements.autoReleaseMinutes.val(resource.autoReleaseMinutes);
    showHideAutoRelease();

    elements.checkAllowConcurrent.prop('checked', resource.allowConcurrent && resource.allowConcurrent == '1');
    elements.maxConcurrent.val(Math.max(2, Number.parseInt(resource.maxConcurrent)));
    showHideConcurrent();

    elements.accessDialog.modal('show');
  };

  var showHideAutoRelease = function () {
    if (!elements.enableCheckIn.is(':checked')) {
      elements.autoReleaseMinutesDiv.collapse('hide');
    } else {
      elements.autoReleaseMinutesDiv.collapse('show');
    }
  };

  var showHideConcurrent = function () {
    if (elements.checkAllowConcurrent.is(':checked')) {
      elements.allowConcurrentDiv.collapse('show');
    } else {
      elements.allowConcurrentDiv.collapse('hide');
    }
  };

  var setDuration = function (container, resourceDuration) {
    var emptyIfZero = function (val) {
      if (val == 0) {
        return '';
      }
      return val;
    };
    resourceDuration.value = container.attr('data-value');
    resourceDuration.days = emptyIfZero(container.attr('data-days'));
    resourceDuration.hours = emptyIfZero(container.attr('data-hours'));
    resourceDuration.minutes = emptyIfZero(container.attr('data-minutes'));
  };

  var onDurationSaved = function (resultHtml) {
    var resource = getActiveResource();
    var resourceDiv = $('div[data-resourceId=' + resource.id + ']');
    resourceDiv.find('.durationPlaceHolder').html(resultHtml);

    var result = resourceDiv.find('.durationPlaceHolder');
    var minDuration = result.find('.minDuration');
    var maxDuration = result.find('.maxDuration');
    var bufferTime = result.find('.bufferTime');
    var allowMultiDay = result.find('.allowMultiDay');

    setDuration(minDuration, resource.minLength);
    setDuration(maxDuration, resource.maxLength);
    setDuration(bufferTime, resource.bufferTime);
    resource.allowMultiday = allowMultiDay.attr('data-value');

    elements.durationDialog.modal('hide');
  };

  var onCapacitySaved = function (resultHtml) {
    var resource = getActiveResource();
    var resourceDiv = $('div[data-resourceId=' + resource.id + ']');
    resourceDiv.find('.capacityPlaceHolder').html(resultHtml);

    var result = resourceDiv.find('.capacityPlaceHolder');
    var maxParticipants = result.find('.maxParticipants');
    resource.maxParticipants = maxParticipants.attr('data-value');

    elements.capacityDialog.modal('hide');
  };

  var onAccessSaved = function (resultHtml) {
    var resource = getActiveResource();
    var resourceDiv = $('div[data-resourceId=' + resource.id + ']');
    resourceDiv.find('.accessPlaceHolder').html(resultHtml);

    var result = resourceDiv.find('.accessPlaceHolder');
    var startNoticeAdd = result.find('.startNoticeAdd');
    var startNoticeUpdate = result.find('.startNoticeUpdate');
    var startNoticeDelete = result.find('.startNoticeDelete');
    var endNotice = result.find('.endNotice');
    var requiresApproval = result.find('.requiresApproval');
    var autoAssign = result.find('.autoAssign');
    var enableCheckin = result.find('.enableCheckin');
    var autoRelease = result.find('.autoRelease');
    var maxConcurrent = result.find('.allowConcurrent');

    setDuration(startNoticeAdd, resource.startNoticeAdd);
    setDuration(startNoticeUpdate, resource.startNoticeUpdate);
    setDuration(startNoticeDelete, resource.startNoticeDelete);
    setDuration(endNotice, resource.endNotice);
    resource.requiresApproval = requiresApproval.attr('data-value');
    resource.autoAssign = autoAssign.attr('data-value');

    resource.enableCheckin = enableCheckin.attr('data-value');
    resource.autoReleaseMinutes = autoRelease.attr('data-value');

    resource.maxConcurrent = maxConcurrent.data('max-concurrent');
    resource.allowConcurrent = maxConcurrent.data('allow-concurrent');

    elements.accessDialog.modal('hide');
  };

  var onResourceGroupsSaved = function (resultHtml) {
    var resource = getActiveResource();
    var resourceDiv = $('div[data-resourceId=' + resource.id + ']');
    resourceDiv.find('.resourceGroupsPlaceHolder').html(resultHtml);

    var result = resourceDiv.find('.resourceGroupsPlaceHolder');
    var groupIdElements = result.find('.resourceGroupId');

    var groupIds = [];
    $.each(groupIdElements, function (i, group) {
      groupIds.push($(group).attr('data-value'));
    });
    resource.resourceGroupIds = groupIds;

    elements.resourceGroupDialog.modal('hide');
  };

  var onCreditsSaved = function (resultHtml) {
    var resource = getActiveResource();
    var resourceDiv = $('div[data-resourceId=' + resource.id + ']');
    resourceDiv.find('.creditsPlaceHolder').html(resultHtml);

    var credits = resourceDiv.find('.creditsPerSlot');
    var peak = resourceDiv.find('.peakCreditsPerSlot');

    resource.credits = credits.attr('data-value');
    resource.peakCredits = peak.attr('data-value');

    elements.creditsDialog.modal('hide');
  };

  var showStatusPrompt = function (e) {
    var resource = getActiveResource();
    var statusForm = elements.statusForm;

    var statusOptions = statusForm.find(elements.statusOptions);
    var statusReasons = statusForm.find(elements.statusReasons);
    var addStatusReason = statusForm.find(elements.addStatusReason);
    // var saveButton = statusForm.find('.save');

    statusOptions.val(resource.statusId);
    statusReasons.val(resource.reasonId);

    statusOptions.unbind();
    statusOptions.change(function (e) {
      populateReasonOptions(statusOptions.val(), statusReasons);
    });

    populateReasonOptions(statusOptions.val(), statusReasons);

    addStatusReason.unbind();
    addStatusReason.click(function (e) {
      e.preventDefault();
      statusForm.find(elements.newStatusReason).toggleClass('d-none');
      statusForm.find(elements.existingStatusReason).toggleClass('d-none');

      if (statusForm.find(elements.newStatusReason).hasClass('d-none')) {
        statusForm.find(elements.statusReasons).data('prev', statusReasons.val());
        statusForm.find(elements.statusReasons).val('');
        statusForm.find(elements.resourceStatusReason).focus();
      } else {
        statusForm.find(elements.statusReasons).val(statusReasons.data('prev'));
        statusForm.find(elements.statusReasons).focus();
      }
    });

    // saveButton.unbind();
    //
    //
    //
    // saveButton.click(function () {
    // 	statusForm.submit();
    // });
    //

    elements.toggleStatusChangeMessage.prop('checked', false);
    elements.sendStatusChangeMessageContent.addClass('d-none');
    elements.statusMessageContent.val('');

    elements.statusDialog.modal('show');
    statusOptions.focus();
  };

  function populateReasonOptions(statusId, reasonsElement) {
    reasonsElement.empty().append($('<option>', { value: '', text: '-' }));

    if (statusId in reasons) {
      $.each(reasons[statusId], function (i, v) {
        reasonsElement.append(
          $('<option>', {
            value: v.id,
            text: v.description,
          })
        );
      });
    }
  }

  function setDaysHoursMinutes(elementPrefix, interval, attributeCheckbox) {
    if (!interval) {
      interval = { days: null, hours: null, minutes: null, value: null };
    }
    $(elementPrefix + 'Days').val(interval.days);
    $(elementPrefix + 'Hours').val(interval.hours);
    $(elementPrefix + 'Minutes').val(interval.minutes);

    showHideConfiguration(interval.value, $(elementPrefix), attributeCheckbox);
  }

  function showHideConfiguration(attributeValue, attributeDisplayElement, attributeCheckbox) {
    attributeDisplayElement.val(attributeValue);
    var selector = attributeCheckbox.attr('data-related-inputs');
    var container = attributeCheckbox.closest('form');
    var span = container.find(selector);

    if (attributeValue == '' || attributeValue == undefined) {
      attributeCheckbox.prop('checked', true);
      span.collapse('hide');
    } else {
      attributeCheckbox.prop('checked', false);
      span.collapse('show');
    }
  }

  function wireUpCheckboxToggle(container) {
    container.find(':checkbox').change(function () {
      var selector = $(this).attr('data-related-inputs');
      var span = container.find(selector);

      if ($(this).is(':checked')) {
        span.find('input[type=text],input[type=number]').val('');
        span.collapse('hide');
      } else {
        span.collapse('show');
      }
    });
  }

  var handleAddError = function (result) {
    $('#addResourceResults').text(result).show();
  };

  var changeUserPermissions = function () {
    var resourceId = getActiveResourceId();
    $.get(opts.permissionsUrl + '?dr=users', { rid: resourceId }, function (data) {
      elements.resourceUserList.html(data);
      $('.user-permission-spinner').addClass('d-none');
    });
  };

  var changeUserPermission = function (userId, type) {
    $('.user-permission-spinner').removeClass('d-none');
    $('#changeUserId').val(userId);
    $('#changeUserType').val(type);
    elements.changeUserForm.submit();
  };

  var showAllUsersToAdd = function () {
    elements.userDialog.modal('hide');
    elements.allUsersList.empty();

    var resourceId = getActiveResourceId();
    $.get(opts.permissionsUrl + '?dr=usersAll', { rid: resourceId }, function (data) {
      elements.allUsersList.html(data);
    });

    elements.browseUserDialog.modal('show');
  };

  var changeGroupPermissions = function () {
    var resourceId = getActiveResourceId();
    $.get(opts.permissionsUrl + '?dr=groups', { rid: resourceId }, function (data) {
      elements.resourceGroupList.html(data);
      $('.group-permission-spinner').addClass('d-none');
    });
  };

  var changeGroupPermission = function (groupId, type) {
    $('.group-permission-spinner').removeClass('d-none');
    $('#changeGroupId').val(groupId);
    $('#changeGroupType').val(type);
    elements.changeGroupForm.submit();
  };

  var showAllGroupsToAdd = function () {
    elements.groupDialog.modal('hide');
    elements.allGroupsList.empty();

    var resourceId = getActiveResourceId();
    $.get(opts.permissionsUrl + '?dr=groupsAll', { rid: resourceId }, function (data) {
      elements.allGroupsList.html(data);
    });

    elements.browseGroupDialog.modal('show');
  };

  function changeResourceGroups() {
    var resource = getActiveResource();

    elements.groupDiv.find(':checked').prop('checked', false);

    $.each(resource.resourceGroupIds, function (i, id) {
      elements.groupDiv.find('[group-id=' + id + ']').prop('checked', true);
    });
  }
}
