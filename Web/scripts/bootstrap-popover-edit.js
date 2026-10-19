/**
 * BootstrapPopoverEditor
 *
 * Edición inline con Popover + Floating UI (Bootstrap 6)
 * Reemplaza x-editable de forma minimalista
 *
 * Bootstrap 6 Popover usa Floating UI automáticamente.
 * No necesitamos importarlo por separado.
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

    this.popoverInstance = null;
    this.valueDisplay = null;
    this.triggerButton = null;
    this.input = null;

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
   * Inicializar Popover de Bootstrap 6
   * Bootstrap automáticamente usa Floating UI
   */
  initializePopover() {
    // Bootstrap 6 requiere instancia explícita
    try {
      this.popoverInstance = new bootstrap.Popover(this.triggerButton, {
        trigger: 'focus',
        placement: 'top',
        html: true,
        sanitize: false,
      });
    } catch (e) {
      console.error('Error inicializando Popover:', e);
    }
  }

  setupEventListeners() {
    // Cuando el popover se muestra
    this.triggerButton.addEventListener('shown.bs.popover', (e) => {
      this.onPopoverShown();
    });

    // Cuando el popover se oculta
    this.triggerButton.addEventListener('hidden.bs.popover', (e) => {
      this.onPopoverHidden();
    });
  }

  /**
   * Se ejecuta cuando el Popover se abre
   * Aquí obtenemos referencias a los elementos del popover
   */
  onPopoverShown() {
    // Obtener input del popover
    const inputId = this.fieldId + '_edit_input';
    this.input = document.getElementById(inputId);

    if (!this.input) {
      console.error(`No se encontró input con id: ${inputId}`);
      return;
    }

    // Asignar valor actual
    this.input.value = this.fieldValue || '';

    // Botón guardar
    const saveBtn = this.getPopoverElement('.popover-save');
    if (saveBtn) {
      // Remover listeners previos (en caso de múltiples clics)
      saveBtn.replaceWith(saveBtn.cloneNode(true));
      const newSaveBtn = this.getPopoverElement('.popover-save');
      newSaveBtn.addEventListener('click', () => this.submit());
    }

    // Botón cancelar
    const cancelBtn = this.getPopoverElement('.popover-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.closePopover());
    }

    // Enter para guardar
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.submit();
      }
    });

    // Escape para cancelar
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closePopover();
      }
    });

    // Focus en input
    setTimeout(() => this.input.focus(), 50);
  }

  /**
   * Se ejecuta cuando el Popover se cierra
   */
  onPopoverHidden() {
    // Limpiar referencias
    this.input = null;
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
    const newValue = this.input.value.trim();

    // Validación básica
    if (this.required && !newValue) {
      this.showError('Este campo es requerido');
      return;
    }

    // Si no cambió, solo cerrar
    if (newValue === (this.fieldValue || '')) {
      this.closePopover();
      return;
    }

    // Mostrar loading
    this.showLoading();
    this.clearError();

    try {
      const response = await this.sendAjax(newValue);

      if (response.success || response.value !== undefined) {
        // Actualizar valor mostrado
        this.fieldValue = newValue;
        this.valueDisplay.textContent = response.displayValue || newValue;

        // Cerrar popover
        this.closePopover();

        // Notificar éxito
        this.showSuccessToast('Cambio guardado');
      } else {
        this.showError(response.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error AJAX:', error);
      this.showError('Error de conexión: ' + error.message);
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
    } catch (e) {
      // Si no es JSON válido, asumir que fue exitoso y devolver el texto
      console.warn('Servidor devolvió respuesta no-JSON:', text);
      return { success: true, displayValue: text.trim() };
    }
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
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    document.body.appendChild(toastDiv);

    setTimeout(() => toastDiv.remove(), 3000);
  }
}
