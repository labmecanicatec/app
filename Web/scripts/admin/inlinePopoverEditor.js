/**
 * InlinePopoverEditor - Helper global para editores inline tipo popover con Bootstrap
 * Maneja: apertura/cierre, flatpickr integration, guardado AJAX, teclado y mouse
 */

class InlinePopoverEditor {
  constructor(config) {
    // Elementos
    this.button =
      config.buttonElement || (config.buttonSelector ? document.querySelector(config.buttonSelector) : null);
    this.display = document.querySelector(config.displaySelector);
    this.input = document.querySelector(config.inputSelector);
    this.container = document.querySelector(config.containerSelector);
    this.acceptBtn = document.querySelector(config.acceptBtnSelector);
    this.cancelBtn = document.querySelector(config.cancelBtnSelector);

    // Config
    this.namespace = config.namespace;
    this.saveUrl = config.saveUrl;
    this.getPayload = config.getPayload || (() => ({}));
    this.onBeforeSave = config.onBeforeSave || (() => {});
    this.onAfterSave = config.onAfterSave || (() => {});
    this.onClose = config.onClose || (() => {});
    this.closeEditableControls = config.closeEditableControls || (() => {});
    this.normalizeValue = config.normalizeValue || ((value) => value);
    this.useFlatpickr = Boolean(config.useFlatpickr);
    this.formatDisplay = config.formatDisplay || null;

    // Estado
    this.pendingValue = this.display?.dataset.value || '';
    this.isSaving = false;
    this.isOpen = false;
    this.popover = null;
    this.popoverClass = 'inlineDateTimePopover';

    if (this.button) {
      this.button.removeAttribute('title');
      this.button.setAttribute('data-bs-original-title', '');
    }

    // Inicializar popover si Bootstrap está disponible
    if (this.button && window.bootstrap?.Popover) {
      this.popover = new window.bootstrap.Popover(this.button, {
        html: true,
        sanitize: false,
        title: '',
        trigger: 'manual',
        placement: 'bottom',
        container: 'body',
        customClass: this.popoverClass,
        content: () => {
          this.container?.classList.remove('d-none');
          return this.container;
        },
      });
    }

    this.init();
  }

  init() {
    this.ensureStyles();
    this.attachEventListeners();
    if (this.useFlatpickr) {
      this.waitForFlatpickr();
    }
    this.registerGlobally();
  }

  ensureStyles() {
    if (document.getElementById('inlineDateTimePopoverStyles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'inlineDateTimePopoverStyles';
    style.textContent = [
      '.' + this.popoverClass + ' { --bs-popover-max-width: 24rem; }',
      '.' + this.popoverClass + ' .popover-body { padding: 0.5rem; min-width: 20rem; }',
      '.' +
        this.popoverClass +
        ' .inlineAttributePopoverPanel { position: static !important; border: 0 !important; box-shadow: none !important; padding: 0 !important; background: transparent !important; width: 100%; min-width: 0; }',
      '.' +
        this.popoverClass +
        ' .inlineAttributePopoverPanel .form-control, .' +
        this.popoverClass +
        ' .inlineAttributePopoverPanel .form-select { width: 100%; max-width: 100%; }',
      '.' +
        this.popoverClass +
        ' .inlineAttributePopoverPanel .form-check { display: flex; align-items: center; gap: 0.5rem; margin: 0.25rem 0; }',
      '.' + this.popoverClass + ' .inlineAttributePopoverPanel .form-check-input { margin-top: 0; flex-shrink: 0; }',
      '.' + this.popoverClass + ' .inlineAttributePopoverPanel .d-flex { width: 100%; }',
      '.' + this.popoverClass + ' .inlineAttributePopoverPanel .btn { flex: 1; }',
      '.' +
        this.popoverClass +
        ' .inlineDateTimePickerPanel { position: static !important; border: 0 !important; box-shadow: none !important; padding: 0 !important; background: transparent !important; width: 100%; }',
      '.' + this.popoverClass + ' .inlineDateTimePickerPanel .form-control { width: 100%; max-width: 100%; }',
      '.' + this.popoverClass + ' .inlineDateTimePickerPanel .d-flex { width: 100%; }',
      '.' + this.popoverClass + ' .inlineDateTimePickerPanel .btn { flex: 1; }',
      '.' + this.popoverClass + ' .inlineDateTimePickerPanel .btn span { margin-right: 0.25rem; }',
    ].join('\n');
    document.head.appendChild(style);
  }

  show() {
    if (this.popover) {
      this.popover.show();
      this.isOpen = true;
      this.registerActive();
      setTimeout(() => {
        this.input?.focus();
        this.popover.update();
      }, 0);
      return;
    }

    this.container?.classList.remove('d-none');
    this.isOpen = true;
  }

  hide() {
    if (this.popover) {
      this.popover.hide();
      return;
    }

    this.container?.classList.add('d-none');
    this.isOpen = false;
  }

  registerActive() {
    if (!document._inlineDateTimePopovers) {
      document._inlineDateTimePopovers = {};
    }
    document._inlineDateTimePopovers.active = this.namespace;
  }

  registerGlobally() {
    if (!document._inlineDateTimePopovers) {
      document._inlineDateTimePopovers = {};
    }
    document._inlineDateTimePopovers[this.namespace] = () => this.saveIfChanged();

    if (this.popover) {
      this.button?.addEventListener('hidden.bs.popover', () => {
        this.container?.classList.add('d-none');
        this.isOpen = false;
        if (document._inlineDateTimePopovers?.active === this.namespace) {
          document._inlineDateTimePopovers.active = null;
        }
      });
    }
  }

  closeOtherPopovers() {
    if (!document._inlineDateTimePopovers) {
      return;
    }

    const activeNamespace = document._inlineDateTimePopovers.active;
    if (!activeNamespace || activeNamespace === this.namespace) {
      return;
    }

    const closeFn = document._inlineDateTimePopovers[activeNamespace];
    if (typeof closeFn === 'function') {
      closeFn();
    }
  }

  extractErrorMessage(errors) {
    if (!errors) {
      return 'Error saving value';
    }

    if (typeof errors === 'string') {
      return errors;
    }

    if (Array.isArray(errors)) {
      return errors.join('\n');
    }

    if (typeof errors === 'object') {
      const messages = [];
      for (const key in errors) {
        if (!Object.prototype.hasOwnProperty.call(errors, key)) {
          continue;
        }

        const value = errors[key];
        if (Array.isArray(value)) {
          messages.push(value.join(', '));
        } else {
          messages.push(String(value));
        }
      }

      return messages.length ? messages.join('\n') : 'Error saving value';
    }

    return 'Error saving value';
  }

  save(value) {
    const payload = {
      value: value,
      ...this.getPayload(),
    };

    const body = new URLSearchParams(payload);

    // Agregar CSRF token si existe
    const csrfToken = document.getElementById('csrf_token')?.value;
    if (csrfToken) {
      body.append('CSRF_TOKEN', csrfToken);
    }

    this.onBeforeSave(value);

    fetch(this.saveUrl, { method: 'POST', body })
      .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.text();
      })
      .then((rawBody) => {
        const trimmedBody = rawBody ? rawBody.trim() : '';
        if (trimmedBody !== '') {
          let payload;
          try {
            payload = JSON.parse(trimmedBody);
          } catch {
            payload = null;
          }

          if (payload && typeof payload === 'object' && payload.errors) {
            throw new Error(this.extractErrorMessage(payload.errors));
          }
        }

        this.updateDisplay(value);
        this.pendingValue = value;
        this.isSaving = false;
        this.onAfterSave(value);
        this.hide();
        this.onClose();
      })
      .catch((error) => {
        this.isSaving = false;
        alert(error && error.message ? error.message : 'Error saving value');
      });
  }

  updateDisplay(value) {
    let displayText;
    if (typeof this.formatDisplay === 'function') {
      displayText = this.formatDisplay(value, this.input);
    } else {
      displayText = value === '' ? '-' : this.input?._flatpickr?.altInput?.value || value;
    }

    if (displayText === '') {
      displayText = '-';
    }

    if (this.display) {
      this.display.textContent = displayText;
      this.display.dataset.value = value;
    }
  }

  isTruthyCheckboxValue(value) {
    return value === true || value === 1 || value === '1' || value === 'true' || value === 'on';
  }

  syncPendingFromInput() {
    if (!this.input || this.input._flatpickr) {
      return;
    }

    if (this.input.type === 'checkbox') {
      this.pendingValue = this.input.checked ? '1' : '';
      return;
    }

    this.pendingValue = this.normalizeValue(this.input.value, this.input);
  }

  saveIfChanged() {
    if (this.isSaving) {
      return;
    }

    this.syncPendingFromInput();
    this.pendingValue = this.normalizeValue(this.pendingValue, this.input);

    const currentValue = this.display?.dataset.value || '';
    if (this.pendingValue === currentValue) {
      this.hide();
      this.onClose();
      return;
    }

    this.isSaving = true;
    this.save(this.pendingValue);
  }

  resetValue() {
    this.pendingValue = this.display?.dataset.value || '';
    if (this.input?._flatpickr) {
      this.input._flatpickr.setDate(this.display?.dataset.value || null, false);
    } else if (this.input?.type === 'checkbox') {
      this.input.checked = this.isTruthyCheckboxValue(this.pendingValue);
    } else {
      // For text/textarea inputs, update the value property directly
      if (this.input) {
        this.input.value = this.pendingValue;
      }
    }
  }

  waitForFlatpickr(retries = 60) {
    if (this.input?._flatpickr) {
      this.onFlatpickrReady(this.input._flatpickr);
      return;
    }

    let attempts = 0;
    const id = setInterval(() => {
      if (this.input?._flatpickr) {
        clearInterval(id);
        this.onFlatpickrReady(this.input._flatpickr);
        return;
      }

      attempts += 1;
      if (attempts >= retries) {
        clearInterval(id);
        // Some inline editors may initialize their date controls later;
        // avoid flooding the console with one warning per field.
      }
    }, 50);
  }

  onFlatpickrReady(picker) {
    const visualInput = picker.altInput || this.input;
    visualInput?.classList.add('w-100');

    picker.config.onChange.push((selectedDates, dateStr) => {
      this.pendingValue = dateStr;
    });
  }

  attachEventListeners() {
    // Botón principal (abrir/guardar)
    this.button?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (this.isOpen) {
        this.saveIfChanged();
        return;
      }

      this.closeOtherPopovers();
      this.closeEditableControls();
      this.resetValue();
      this.show();
    });

    // Track value changes for text/textarea editors
    this.input?.addEventListener('input', () => {
      this.syncPendingFromInput();
    });
    this.input?.addEventListener('change', () => {
      this.syncPendingFromInput();
    });

    // Botón aceptar
    this.acceptBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.saveIfChanged();
    });

    // Botón cancelar
    this.cancelBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.resetValue();
      this.hide();
      this.onClose();
    });

    // Click fuera (cierra sin guardar)
    const mousedownHandler = (e) => {
      if (!this.isOpen) return;
      if (this.container?.contains(e.target) || this.button?.contains(e.target)) return;
      this.resetValue();
      this.hide();
      this.onClose();
    };

    if (!document._popoverMouseHandlers) {
      document._popoverMouseHandlers = {};
    }
    document._popoverMouseHandlers[this.namespace] = mousedownHandler;
    document.addEventListener('mousedown', mousedownHandler);

    // ESC key
    const keydownHandler = (e) => {
      if (e.key !== 'Escape') return;
      if (!this.isOpen) return;
      this.resetValue();
      this.hide();
      this.onClose();
    };

    if (!document._popoverKeyHandlers) {
      document._popoverKeyHandlers = {};
    }
    document._popoverKeyHandlers[this.namespace] = keydownHandler;
    document.addEventListener('keydown', keydownHandler);
  }

  destroy() {
    if (document._popoverMouseHandlers?.[this.namespace]) {
      document.removeEventListener('mousedown', document._popoverMouseHandlers[this.namespace]);
    }
    if (document._popoverKeyHandlers?.[this.namespace]) {
      document.removeEventListener('keydown', document._popoverKeyHandlers[this.namespace]);
    }
    if (document._inlineDateTimePopovers?.[this.namespace]) {
      delete document._inlineDateTimePopovers[this.namespace];
    }
  }
}
