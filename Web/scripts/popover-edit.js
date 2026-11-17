/**
 * BootstrapPopoverEditor
 *
 * Edición inline con Popover (Bootstrap 5)
 * Reemplaza x-editable de forma minimalista
 *
 * Compatible con Bootstrap 5.x
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
    this.fieldValue = config.fieldValue;
    this.required = config.required || false;
    this.fieldType = config.fieldType || 'text';
    this.options = config.options || [];
    this.min = config.min;
    this.max = config.max;
    this.step = config.step || '1';
    this.emptyText = config.emptyText || '';
    this.optionsUrl = config.optionsUrl || '';
    this.messages = config.messages || {};

    this.popoverInstance = null;
    this.valueDisplay = null;
    this.triggerButton = null;
    this.input = null;
    this.richTextInput = null;
    this.isPopoverOpen = false;

    this.init();
  }

  init() {
    // Obtener elementos del DOM
    this.valueDisplay = document.getElementById(this.fieldId);
    this.triggerButton = document.getElementById(this.fieldId + '_edit_btn');
    this.input = null; // Se obtendrá cuando el popover se cree

    if (!this.valueDisplay || !this.triggerButton) {
      console.error(`BootstrapPopoverEditor: No se encontraron elementos para ${this.fieldId}`);
      return;
    }

    // Inicializar Bootstrap Popover
    this.initializePopover();

    // Event listeners
    this.setupEventListeners();
  }

  /**
   * Inicializar Popover de Bootstrap 5
   */
  initializePopover() {
    // Bootstrap 5 requiere instancia explícita
    try {
      this.popoverInstance = new bootstrap.Popover(this.triggerButton, {
        trigger: 'manual', // Usar manual para controlar mejor el ciclo de vida
        placement: 'top',
        html: true,
        sanitize: false,
        content: this.getPopoverContent(),
      });
    } catch (e) {
      console.error('Error inicializando Popover:', e);
    }
  }

  /**
   * Obtener el contenido del popover
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
   * HTML del control de entrada según el tipo de campo
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
      return `<textarea class='form-control form-control-sm mb-2' rows='4' id='${inputId}'></textarea>`;
    }

    if (this.fieldType === 'richtext') {
      return `<textarea class='form-control form-control-sm mb-2' rows='7' id='${inputId}'></textarea>`;
    }

    if (this.fieldType === 'number') {
      const min = this.min !== null && this.min !== undefined ? ` min='${this.escapeHtml(String(this.min))}'` : '';
      const max = this.max !== null && this.max !== undefined ? ` max='${this.escapeHtml(String(this.max))}'` : '';
      return `<input type='number' step='${this.escapeHtml(String(this.step))}'${min}${max} class='form-control form-control-sm mb-2' id='${inputId}'>`;
    }

    return `<input type='text' class='form-control form-control-sm mb-2' id='${inputId}'>`;
  }

  /**
   * Texto a mostrar para un valor (para selects, el texto de la opción)
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

    const tip = document.querySelector('.popover');
    if (tip) {
      tip.style.setProperty('--bs-popover-max-width', '520px');
      tip.style.width = '520px';
      this.popoverInstance.update();
    }
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
    // Click en el botón trigger para mostrar/ocultar popover
    this.triggerButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (this.isPopoverOpen) {
        this.closePopover();
      } else {
        this.showPopover();
      }
    });

    // Cuando el popover se muestra (Bootstrap 5)
    this.triggerButton.addEventListener('shown.bs.popover', (e) => {
      this.onPopoverShown();
    });

    // Cuando el popover se oculta (Bootstrap 5)
    this.triggerButton.addEventListener('hidden.bs.popover', (e) => {
      this.onPopoverHidden();
    });

    // Cerrar al clickear fuera del popover
    document.addEventListener('click', (e) => {
      if (
        this.isPopoverOpen &&
        !this.triggerButton.contains(e.target) &&
        !e.target.closest('.popover, .trumbowyg-modal, .trumbowyg-modal-box')
      ) {
        this.closePopover();
      }
    });
  }

  /**
   * Mostrar el popover
   */
  showPopover() {
    if (this.popoverInstance) {
      this.popoverInstance.show();
      this.isPopoverOpen = true;
    }
  }

  /**
   * Se ejecuta cuando el Popover se abre
   * Aquí obtenemos referencias a los elementos del popover
   */
  onPopoverShown() {
    // Pequeño delay para asegurar que el DOM esté actualizado
    setTimeout(() => {
      // Obtener input del popover
      const inputId = this.fieldId + '_edit_input';
      this.input = document.getElementById(inputId);

      if (!this.input) {
        console.error(`No se encontró input con id: ${inputId}`);
        return;
      }

      // Asignar valor actual
      if (this.isRichText()) {
        this.setupRichTextEditor();
      } else if (this.fieldType === 'checkbox') {
        this.input.checked = String(this.fieldValue) === '1';
      } else {
        this.input.value = this.fieldValue !== null && this.fieldValue !== undefined ? this.fieldValue : '';
      }

      // Botón guardar
      const saveBtn = this.getPopoverElement('.popover-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.submit();
        });
      }

      // Botón cancelar
      const cancelBtn = this.getPopoverElement('.popover-cancel');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closePopover();
        });
      }

      // Enter para guardar
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !this.isRichText() && this.fieldType !== 'textarea') {
          e.preventDefault();
          this.submit();
        }
      });

      // Escape para cancelar
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closePopover();
        }
      });

      if (this.optionsUrl && this.fieldType === 'select') {
        this.loadRemoteOptions();
      }

      // Focus en input
      if (!this.isRichText()) {
        this.input.focus();
      }
    }, 50);
  }

  /**
   * Carga las opciones del select desde optionsUrl ([{value, text}]) al abrir el popover
   */
  async loadRemoteOptions() {
    const select = this.input;
    select.disabled = true;
    try {
      const response = await fetch(this.optionsUrl);
      const items = await response.json();
      this.options = items.map((item) => ({ value: String(item.value), text: String(item.text) }));
    } catch (error) {
      console.warn('Error cargando opciones:', error);
    }

    // Conserva el valor actual aunque no esté en la lista
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
   * Se ejecuta cuando el Popover se cierra
   */
  onPopoverHidden() {
    // Limpiar referencias
    this.input = null;
    this.isPopoverOpen = false;
  }

  /**
   * Obtener elemento dentro del popover
   * Bootstrap pone el popover en body, no en el elemento trigger
   */
  getPopoverElement(selector) {
    const popoverDiv = document.querySelector('.popover');
    if (!popoverDiv) return null;

    return popoverDiv.querySelector(selector);
  }

  /**
   * Enviar cambios al servidor
   */
  async submit() {
    if (!this.input) return;

    const newValue = this.getInputValue();

    // Validación básica
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

    // Si no cambió, solo cerrar
    if (String(newValue) === String(this.fieldValue ?? '')) {
      this.closePopover();
      return;
    }

    // Mostrar loading
    this.showLoading();
    this.clearError();

    try {
      const response = await this.sendAjax(newValue);

      const serverError = this.extractServerError(response);
      if (!serverError) {
        // Actualizar valor mostrado
        this.fieldValue = newValue;
        if (this.isRichText() && newValue) {
          this.valueDisplay.innerHTML = this.sanitizeHtml(newValue);
        } else {
          this.valueDisplay.textContent = response?.displayValue || this.getDisplayText(newValue);
        }

        // Cerrar popover
        this.closePopover();

        // Notificar éxito
        this.showSuccessToast(this.messages.saved);
      } else {
        console.error('Error al guardar:', response);
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
   * Enviar AJAX al servidor
   */
  async sendAjax(newValue) {
    const formData = new FormData();

    // Parámetros que espera el servidor para cualquier acción inline
    formData.append('pk', this.primaryKey);
    formData.append('name', this.parameterName);
    formData.append('value', newValue); // Siempre 'value', no el parameterName

    // CSRF token - buscar el input del formulario
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

    // Intentar parsear JSON si la respuesta contiene contenido válido
    const text = await response.text();
    if (!text || text.trim() === '') {
      // Respuesta vacía - considerar como éxito (servidor procesó sin devolver datos)
      return { success: true };
    }

    try {
      return JSON.parse(text);
    } catch {
      // Si no es JSON válido, asumir que fue exitoso y devolver el texto
      console.warn('Servidor devolvió respuesta no-JSON:', text);
      return { success: true, displayValue: text.trim() };
    }
  }

  /**
   * Devuelve el mensaje de error del servidor, o '' si la respuesta no indica error
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
   * Mostrar mensaje de error en el popover
   */
  showError(message) {
    const errorDiv = this.getPopoverElement(`#${this.fieldId}_edit_input_error`);
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('d-none');
    }
  }

  /**
   * Limpiar mensaje de error
   */
  clearError() {
    const errorDiv = this.getPopoverElement(`#${this.fieldId}_edit_input_error`);
    if (errorDiv) {
      errorDiv.classList.add('d-none');
      errorDiv.textContent = '';
    }
  }

  /**
   * Mostrar indicador de carga
   */
  showLoading() {
    const loadingDiv = this.getPopoverElement(`#${this.fieldId}_edit_input_loading`);
    if (loadingDiv) {
      loadingDiv.classList.remove('d-none');
    }
  }

  /**
   * Ocultar indicador de carga
   */
  hideLoading() {
    const loadingDiv = this.getPopoverElement(`#${this.fieldId}_edit_input_loading`);
    if (loadingDiv) {
      loadingDiv.classList.add('d-none');
    }
  }

  /**
   * Cerrar el popover
   */
  closePopover() {
    if (this.popoverInstance) {
      this.popoverInstance.hide();
      this.isPopoverOpen = false;
    }
  }

  /**
   * Mostrar notificación de éxito (Toast)
   */
  showSuccessToast(message) {
    const toastDiv = document.createElement('div');
    toastDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    toastDiv.style.top = '20px';
    toastDiv.style.right = '20px';
    toastDiv.style.zIndex = '9999';
    toastDiv.setAttribute('role', 'alert');

    toastDiv.innerHTML = `
            ${this.escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="${this.escapeHtml(this.messages.close)}"></button>
        `;

    document.body.appendChild(toastDiv);

    setTimeout(() => toastDiv.remove(), 3000);
  }
}
