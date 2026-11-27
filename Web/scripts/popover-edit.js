/**
 * BootstrapPopoverEditor
 *
 * Inline editing with a Bootstrap 5 popover.
 * Minimal replacement for x-editable.
 *
 * Compatible with Bootstrap 5.x
 *
 * @example
 * const editor = new BootstrapPopoverEditor({
 *     fieldId: 'scheduleName',
 *     primaryKey: 123,
 *     parameterName: 'SCHEDULE_NAME',
 *     submitUrl: 'schedules.php?action=updateSchedule',
 *     fieldValue: 'Schedule Name',
 *     required: false
 * });
 */

class BootstrapPopoverEditor {
  constructor(config) {
    this.config = config;
    this.fieldId = config.fieldId;
    this.primaryKey = config.primaryKey;
    this.parameterName = config.parameterName;
    this.submitUrl = config.submitUrl;
    this.required = config.required || false;
    this.fieldType = config.fieldType || 'text';
    // Submitted values are stored entity-encoded (Server::GetForm), so decode them for the editor
    this.fieldValue =
      typeof config.fieldValue === 'string' ? this.decodeEntities(config.fieldValue) : config.fieldValue;
    this.options = config.options || [];
    this.min = config.min;
    this.max = config.max;
    this.step = config.step || '1';
    this.emptyText = config.emptyText || '';
    this.optionsUrl = config.optionsUrl || '';
    this.autocompleteUrl = config.autocompleteUrl || '';
    this.messages = config.messages || {};

    this.popoverInstance = null;
    this.valueDisplay = null;
    this.triggerButton = null;
    this.input = null;
    this.richTextInput = null;
    this.isPopoverOpen = false;
    this.autocompleteMenuOpen = false;

    this.init();
  }

  init() {
    // Get DOM elements
    this.valueDisplay = document.getElementById(this.fieldId);
    this.triggerButton = document.getElementById(this.fieldId + '_edit_btn');
    this.input = null; // Set once the popover has been created

    if (!this.valueDisplay || !this.triggerButton) {
      console.error(`BootstrapPopoverEditor: elements not found for ${this.fieldId}`);
      return;
    }

    // Initialize the Bootstrap popover
    this.initializePopover();

    // Event listeners
    this.setupEventListeners();
  }

  /**
   * Initialize the Bootstrap 5 popover
   */
  initializePopover() {
    // Bootstrap 5 requires an explicit instance
    try {
      this.popoverInstance = new bootstrap.Popover(this.triggerButton, {
        trigger: 'manual', // Manual trigger gives full control over the lifecycle
        placement: 'top',
        html: true,
        sanitize: false,
        content: this.getPopoverContent(),
      });
    } catch (e) {
      console.error('Error initializing popover:', e);
    }
  }

  /**
   * Build the popover content
   */
  getPopoverContent() {
    const inputId = this.fieldId + '_edit_input';
    return `<div class='popover-inline-edit'>
    ${this.getInputHtml(inputId)}
    <div class='popover-buttons d-flex gap-2'>
      <button type='button' class='btn btn-sm btn-primary popover-save w-50'>${this.escapeHtml(this.messages.accept)}</button>
      <button type='button' class='btn btn-sm btn-secondary popover-cancel w-50'>${this.escapeHtml(this.messages.cancel)}</button>
    </div>
    <div id='${inputId}_error' class='alert alert-danger alert-sm d-none mt-2'></div>
    <div id='${inputId}_loading' class='spinner-border spinner-border-sm d-none'></div>
</div>`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /**
   * Input control HTML for the field type
   */
  getInputHtml(inputId) {
    if (this.fieldType === 'select') {
      const options = this.options
        .map((o) => `<option value='${this.escapeHtml(o.value)}'>${this.escapeHtml(o.text)}</option>`)
        .join('');
      return `<select class='form-select form-select-sm mb-2' id='${inputId}'>${options}</select>`;
    }

    if (this.fieldType === 'checkbox') {
      const label = this.options.length ? this.options[0].text : '';
      return `<div class='form-check mb-2'><input type='checkbox' class='form-check-input' id='${inputId}'><label class='form-check-label' for='${inputId}'>${this.escapeHtml(label)}</label></div>`;
    }

    if (this.fieldType === 'textarea') {
      return `<textarea autocomplete='off' class='form-control form-control-sm mb-2' rows='4' id='${inputId}'></textarea>`;
    }

    if (this.fieldType === 'richtext') {
      return `<textarea class='form-control form-control-sm mb-2' rows='7' id='${inputId}'></textarea>`;
    }

    if (this.fieldType === 'number') {
      const min = this.min !== null && this.min !== undefined ? ` min='${this.escapeHtml(String(this.min))}'` : '';
      const max = this.max !== null && this.max !== undefined ? ` max='${this.escapeHtml(String(this.max))}'` : '';
      return `<input type='number' autocomplete='off' step='${this.escapeHtml(String(this.step))}'${min}${max} class='form-control form-control-sm mb-2' id='${inputId}'>`;
    }

    const clearLabel = this.escapeHtml(this.messages.clear);
    return `<div class='position-relative mb-2'>
      <input type='text' autocomplete='off' class='form-control form-control-sm pe-4' id='${inputId}'>
      <span class='searchclear bi bi-x-circle-fill popover-clear' role='button' title='${clearLabel}' aria-label='${clearLabel}'></span>
    </div>`;
  }

  /**
   * Text to display for a value (for selects, the option text)
   */
  getDisplayText(value) {
    if (this.fieldType === 'select') {
      const option = this.options.find((o) => String(o.value) === String(value));
      return option && option.text !== '' ? option.text : value === '' ? this.emptyText : option ? option.text : value;
    }
    if (this.fieldType === 'checkbox') {
      return String(value) === '1' && this.options.length ? this.options[0].text : this.emptyText;
    }
    return value === '' ? this.emptyText : value;
  }

  decodeEntities(encoded) {
    // A <textarea> decodes entities without creating elements
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encoded ?? '';
    return textarea.value;
  }

  isRichText() {
    return this.fieldType === 'richtext';
  }

  sanitizeHtml(html) {
    return typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(html || '') : html || '';
  }

  setupRichTextEditor() {
    const $input = window.jQuery ? window.jQuery(this.input) : null;
    if (!$input || !$input.trumbowyg) {
      this.input.value = this.fieldValue ?? '';
      return;
    }

    $input.trumbowyg({
      tagsToRemove: ['script', 'link'],
      removeformatPasted: true,
      urlProtocol: true,
      btns: [['bold', 'italic', 'underline'], ['link'], ['unorderedList', 'orderedList']],
    });
    $input.trumbowyg('html', this.fieldValue ?? '');
    this.richTextInput = $input;

    const tip = this.getPopoverTip();
    if (tip) {
      tip.style.setProperty('--bs-popover-max-width', '520px');
      tip.style.width = '520px';
      this.popoverInstance.update();
    }
  }

  /**
   * Suggests users while typing in a text field (autocomplete.js, jQuery UI).
   * The value stays free text, so a contact that is not a user can still be typed.
   */
  setupUserAutocomplete() {
    const $input = window.jQuery ? window.jQuery(this.input) : null;
    if (!this.autocompleteUrl || this.fieldType !== 'text' || !$input || !$input.userAutoComplete) {
      return;
    }

    $input.userAutoComplete(this.autocompleteUrl, (ui) => {
      const user = ui.item.data;
      this.input.value = user.Email ? `${user.Name} <${user.Email}>` : user.Name;
      this.clearError();
    });
    $input.autocomplete('option', 'minLength', BootstrapPopoverEditor.AUTOCOMPLETE_MIN_LENGTH);

    // Enter and Escape belong to the suggestions menu while it is open. jQuery UI
    // closes the menu before the input's own listeners run, so record the state
    // in the capture phase, before the key reaches the input.
    this.getPopoverTip()?.addEventListener(
      'keydown',
      () => {
        this.autocompleteMenuOpen = $input.autocomplete('widget').is(':visible');
      },
      true
    );
  }

  getInputValue() {
    if (this.isRichText()) {
      const html = this.richTextInput ? this.richTextInput.trumbowyg('html') : this.input.value;
      return this.sanitizeHtml(html).trim();
    }
    if (this.fieldType === 'checkbox') {
      return this.input.checked ? '1' : '';
    }
    return this.input.value.trim();
  }

  setupEventListeners() {
    // Clicking the trigger toggles the popover
    this.triggerButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (this.isPopoverOpen) {
        this.closePopover();
      } else {
        this.showPopover();
      }
    });

    // When the popover is shown (Bootstrap 5)
    this.triggerButton.addEventListener('shown.bs.popover', (e) => {
      this.onPopoverShown();
    });

    // When the popover is hidden (Bootstrap 5)
    this.triggerButton.addEventListener('hidden.bs.popover', (e) => {
      this.onPopoverHidden();
    });

    // Close when clicking outside the popover
    document.addEventListener('click', (e) => {
      if (
        this.isPopoverOpen &&
        !this.triggerButton.contains(e.target) &&
        !e.target.closest('.popover, .trumbowyg-modal, .trumbowyg-modal-box, .ui-autocomplete')
      ) {
        this.closePopover();
      }
    });
  }

  /**
   * Show the popover
   */
  showPopover() {
    if (!this.popoverInstance) return;

    const previous = BootstrapPopoverEditor.openEditor;
    if (previous && previous !== this) {
      previous.closePopover();
    }

    this.popoverInstance.show();
    this.isPopoverOpen = true;
    BootstrapPopoverEditor.openEditor = this;
  }

  /**
   * Runs when the popover opens
   * Gets references to the elements inside the popover
   */
  onPopoverShown() {
    // Short delay to make sure the DOM is updated
    setTimeout(() => {
      // Get the popover input
      const inputId = this.fieldId + '_edit_input';
      this.input = this.getPopoverElement(`#${inputId}`);

      if (!this.input) {
        console.error(`Input not found with id: ${inputId}`);
        return;
      }

      // Set the current value
      if (this.isRichText()) {
        this.setupRichTextEditor();
      } else if (this.fieldType === 'checkbox') {
        this.input.checked = String(this.fieldValue) === '1';
      } else {
        this.input.value = this.fieldValue !== null && this.fieldValue !== undefined ? this.fieldValue : '';
      }

      // Save button
      const saveBtn = this.getPopoverElement('.popover-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.submit();
        });
      }

      // Cancel button
      const cancelBtn = this.getPopoverElement('.popover-cancel');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closePopover();
        });
      }

      // Clear button (text fields only)
      const clearBtn = this.getPopoverElement('.popover-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.input.value = '';
          this.clearError();
          this.input.focus();
        });
      }

      // Enter saves
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !this.isRichText() && this.fieldType !== 'textarea' && !this.autocompleteMenuOpen) {
          e.preventDefault();
          this.submit();
        }
      });

      // Escape cancels
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.autocompleteMenuOpen) {
          e.preventDefault();
          this.closePopover();
        }
      });

      if (this.optionsUrl && this.fieldType === 'select') {
        this.loadRemoteOptions();
      }

      this.setupUserAutocomplete();

      // Focus the input
      if (!this.isRichText()) {
        this.input.focus();
      }
    }, 50);
  }

  /**
   * Loads the select options from optionsUrl ([{value, text}]) when the popover opens
   */
  async loadRemoteOptions() {
    const select = this.input;
    select.disabled = true;
    try {
      const response = await fetch(this.optionsUrl);
      const items = await response.json();
      this.options = items.map((item) => ({ value: String(item.value), text: String(item.text) }));
    } catch (error) {
      console.warn('Error loading options:', error);
    }

    // Keep the current value even if it is not in the list
    const current = this.fieldValue !== null && this.fieldValue !== undefined ? String(this.fieldValue) : '';
    if (!this.options.some((o) => o.value === current)) {
      this.options.unshift({ value: current, text: current });
    }

    if (this.input !== select) return;
    select.innerHTML = this.options
      .map((o) => `<option value='${this.escapeHtml(o.value)}'>${this.escapeHtml(o.text)}</option>`)
      .join('');
    select.value = current;
    select.disabled = false;
  }

  /**
   * Runs when the popover closes
   */
  onPopoverHidden() {
    // Clear references
    this.input = null;
    this.autocompleteMenuOpen = false;
    this.isPopoverOpen = false;
    if (BootstrapPopoverEditor.openEditor === this) {
      BootstrapPopoverEditor.openEditor = null;
    }
  }

  /**
   * The popover element owned by this editor, or null while it is closed.
   * Never use a global '.popover' lookup: other popovers may be in the DOM.
   */
  getPopoverTip() {
    return this.popoverInstance ? this.popoverInstance.tip || null : null;
  }

  /**
   * Find an element inside this editor's own popover
   */
  getPopoverElement(selector) {
    const tip = this.getPopoverTip();
    return tip ? tip.querySelector(selector) : null;
  }

  /**
   * Send the change to the server
   */
  async submit() {
    if (!this.input) return;

    const newValue = this.getInputValue();

    // Basic validation
    if (this.required && !newValue) {
      this.showError(this.messages.required);
      return;
    }

    if (this.fieldType === 'number' && newValue !== '') {
      const number = Number(newValue);
      const belowMin = this.min !== null && this.min !== undefined && number < Number(this.min);
      const aboveMax = this.max !== null && this.max !== undefined && number > Number(this.max);
      const validFormat = this.step === 'any' ? Number.isFinite(number) : /^-?\d+$/.test(newValue);
      if (!validFormat || belowMin || aboveMax) {
        this.showError(this.step === 'any' ? this.messages.invalidNumber : this.messages.invalidInteger);
        return;
      }
    }

    // Unchanged: just close
    if (String(newValue) === String(this.fieldValue ?? '')) {
      this.closePopover();
      return;
    }

    // Show loading indicator
    this.showLoading();
    this.clearError();

    try {
      const response = await this.sendAjax(newValue);

      const serverError = this.extractServerError(response);
      if (!serverError) {
        // Update the displayed value
        this.fieldValue = newValue;
        if (this.isRichText() && newValue) {
          this.valueDisplay.innerHTML = this.sanitizeHtml(newValue);
        } else {
          this.valueDisplay.textContent = response?.displayValue || this.getDisplayText(newValue);
        }

        // Close the popover
        this.closePopover();

        // Notify success
        this.showSuccessToast();
      } else {
        console.error('Error saving:', response);
        this.showError(serverError);
      }
    } catch (error) {
      console.error('Error AJAX:', error);
      this.showError(this.messages.connectionError + ': ' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Send the AJAX request to the server
   */
  async sendAjax(newValue) {
    const formData = new FormData();

    // Parameters the server expects for every inline action
    formData.append('pk', this.primaryKey);
    formData.append('name', this.parameterName);
    formData.append('value', newValue); // Always 'value', not parameterName

    // CSRF token from the page's hidden input
    const csrfInput = document.querySelector('input[name="CSRF_TOKEN"]');
    if (csrfInput) {
      formData.append('CSRF_TOKEN', csrfInput.value);
    }

    const response = await fetch(this.submitUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Parse JSON when the response has content
    const text = await response.text();
    if (!text || text.trim() === '') {
      // Empty response: treat as success (server returned no data)
      return { success: true };
    }

    try {
      return JSON.parse(text);
    } catch {
      // Not valid JSON: assume success and return the text
      console.warn('Server returned a non-JSON response:', text);
      return { success: true, displayValue: text.trim() };
    }
  }

  /**
   * Returns the server error message, or '' when the response has no error
   */
  extractServerError(response) {
    if (!response || typeof response !== 'object') return '';
    if (response.success === false) {
      return response.error || this.messages.saveError;
    }
    const errors = response.errors || response.error;
    if (!errors) return '';
    if (typeof errors === 'string') return errors;
    return [].concat(...Object.values(errors)).join('\n') || this.messages.saveError;
  }

  /**
   * Show an error message in the popover
   */
  showError(message) {
    const errorDiv = this.getPopoverElement(`#${this.fieldId}_edit_input_error`);
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('d-none');
    }
  }

  /**
   * Clear the error message
   */
  clearError() {
    const errorDiv = this.getPopoverElement(`#${this.fieldId}_edit_input_error`);
    if (errorDiv) {
      errorDiv.classList.add('d-none');
      errorDiv.textContent = '';
    }
  }

  /**
   * Show the loading indicator
   */
  showLoading() {
    const loadingDiv = this.getPopoverElement(`#${this.fieldId}_edit_input_loading`);
    if (loadingDiv) {
      loadingDiv.classList.remove('d-none');
    }
  }

  /**
   * Hide the loading indicator
   */
  hideLoading() {
    const loadingDiv = this.getPopoverElement(`#${this.fieldId}_edit_input_loading`);
    if (loadingDiv) {
      loadingDiv.classList.add('d-none');
    }
  }

  /**
   * Close the popover
   */
  closePopover() {
    if (this.popoverInstance) {
      this.popoverInstance.hide();
      this.isPopoverOpen = false;
    }
    if (BootstrapPopoverEditor.openEditor === this) {
      BootstrapPopoverEditor.openEditor = null;
    }
  }

  /**
   * Show the shared "saved" toast defined in globalfooter.tpl
   */
  showSuccessToast() {
    if (typeof window.showToastById === 'function') {
      window.showToastById('inlineEditSavedToast');
    }
  }
}

/**
 * Editor whose popover is currently open; only one may be open at a time
 */
BootstrapPopoverEditor.openEditor = null;

/**
 * Characters typed before user suggestions are requested
 */
BootstrapPopoverEditor.AUTOCOMPLETE_MIN_LENGTH = 2;
