{* tpl/Controls/PopoverEdit.tpl
   Popover inline edit con Bootstrap 5
   Variables:
   - $FieldId: ID del campo
   - $DisplayValue: Valor mostrado
   - $DisplayHtml: Si es true, DisplayValue se muestra como HTML (ya sanitizado)
   - $CssClass: Clases CSS adicionales
   - $ConfigJson: Configuración JSON
   - $UniquePopoverId: ID único para popover
*}

{assign var="popoverId" value="{$UniquePopoverId}"}
{assign var="inputId" value="{$FieldId}_edit_input"}
{assign var="btnId" value="{$FieldId}_edit_btn"}

<div class="d-inline-flex align-items-center gap-2 {$CssClass}">
    {* Elemento que muestra valor actual *}
    <span id="{$FieldId}" class="editable-value">
        {if $DisplayHtml}{$DisplayValue nofilter}{else}{$DisplayValue}{/if}
    </span>

    {* Link trigger del popover *}
    <a href="javascript:void(0);" tabindex="0" id="{$btnId}" class="text-decoration-none link-primary" role="button"
        aria-label="{translate key=Edit}">
        <i class="bi bi-pencil-square"></i>
    </a>
</div>

{* Cargar inicializador solo la primera vez *}
{if !isset($bootstrapPopoverEditLoaded)}
    {assign var="bootstrapPopoverEditLoaded" value=true}

    <script>
        // Flag para evitar múltiples inicializaciones
        window.bootstrapPopoverEditReady = false;
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
