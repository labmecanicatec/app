{* tpl/Controls/BootstrapPopoverEdit.tpl

   Popover inline edit con Bootstrap 6 + Floating UI.
   Variables:
   - $FieldId: ID del campo
   - $DisplayValue: Valor mostrado
   - $CssClass: Clases CSS adicionales
   - $ButtonClass: Clase del botón (ej: theme-primary)
   - $ConfigJson: Configuración JSON
   - $UniquePopoverId: ID único para popover
*}

{assign var="popoverId" value="{$UniquePopoverId}"}
{assign var="inputId" value="{$FieldId}_edit_input"}
{assign var="btnId" value="{$FieldId}_edit_btn"}

{* Construir contenido del popover con traducciones *}
{capture name="popoverContent"}<div class='popover-inline-edit'>
    <input type='text' class='form-control form-control-sm mb-2' id='{$inputId}' placeholder='Ingresa nuevo valor'>
    <div class='popover-buttons d-flex gap-2'>
        <button type='button' class='btn-solid btn-sm theme-primary popover-save w-50'>{translate key=Accept}</button>
        <button type='button' class='btn-outline btn-sm theme-secondary popover-cancel w-50'>{translate key=Cancel}</button>
    </div>
    <div id='{$inputId}_error' class='alert alert-danger alert-sm d-none mt-2'></div>
    <div id='{$inputId}_loading' class='spinner-border spinner-border-sm d-none'></div>
</div>{/capture}
{assign var="popoverContentHtml" value=$smarty.capture.popoverContent|escape:'html'}

<div class="d-inline-flex align-items-center gap-2 {$CssClass}">
    {* Elemento que muestra valor actual *}
    <span id="{$FieldId}" class="editable-value">
        {$DisplayValue}
    </span>

    {* Link trigger del popover *}
    <a href="javascript:void(0);"
            tabindex="0"
            id="{$btnId}"
            class="text-decoration-none {$ButtonClass}"
            role="button"
            data-bs-toggle="popover"
            data-bs-trigger="focus"
            data-bs-placement="top"
            data-bs-html="true"
            data-bs-content="{$popoverContentHtml}"
            aria-label="{translate key=Edit}">
        <i class="bi bi-pencil-square"></i>
    </a>
</div>

{* Cargar inicializador solo la primera vez *}
{if !isset($bootstrapPopoverEditLoaded)}
    {assign var="bootstrapPopoverEditLoaded" value=true}

    <script>
        // Cargar BootstrapPopoverEditor cuando DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                if (typeof BootstrapPopoverEditor !== 'undefined') {
                    console.log('BootstrapPopoverEditor cargado');
                }
            });
        }
    </script>
{/if}

<script>
    // Inicializar este campo específico
    (function() {
        function initPopoverEdit() {
            if (typeof BootstrapPopoverEditor === 'undefined') {
                setTimeout(initPopoverEdit, 100);
                return;
            }

            const config = {$ConfigJson nofilter};
            new BootstrapPopoverEditor(config);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPopoverEdit);
        } else {
            initPopoverEdit();
        }
    })();
</script>
