{* tpl/Controls/PopoverEdit.tpl
   Inline edit field using a Bootstrap 5 popover
   Variables:
   - $FieldId: field ID
   - $DisplayValue: displayed value
   - $DisplayHtml: when true, DisplayValue is rendered as HTML (already sanitized)
   - $CssClass: additional CSS classes
   - $ConfigJson: JSON editor configuration
   - $UniquePopoverId: unique popover ID
*}

{assign var="popoverId" value="{$UniquePopoverId}"}
{assign var="inputId" value="{$FieldId}_edit_input"}
{assign var="btnId" value="{$FieldId}_edit_btn"}

{capture name=popoverTrigger assign=popoverTrigger}
    {* Popover trigger link *}
    <a href="javascript:void(0);" tabindex="0" id="{$btnId}" class="text-decoration-none link-primary" role="button"
        aria-label="{translate key=Edit}">
        <i class="bi bi-pencil-square"></i>
    </a>
{/capture}

{if $DisplayHtml}
    {* Rich text is block content (paragraphs, lists): show the trigger first,
       next to the label, and the value below it *}
    <span class="ms-2">{$popoverTrigger nofilter}</span>
    <div id="{$FieldId}" class="editable-value {$CssClass}">{$DisplayValue nofilter}</div>
{else}
    <div class="d-inline-flex align-items-center gap-2 {$CssClass}">
        {* Element showing the current value *}
        <span id="{$FieldId}" class="editable-value">{$DisplayValue}</span>
        {$popoverTrigger nofilter}
    </div>
{/if}

{* Load the initializer only once *}
{if !isset($bootstrapPopoverEditLoaded)}
    {assign var="bootstrapPopoverEditLoaded" value=true}

    <script>
        // Flag to avoid initializing more than once
        window.bootstrapPopoverEditReady = false;
    </script>
{/if}

<script>
    // Initialize this field
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
