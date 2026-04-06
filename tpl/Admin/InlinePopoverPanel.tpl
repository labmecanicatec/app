<div class="d-none position-absolute border rounded bg-body shadow p-2 z-3 update {if isset($panelClass)}{$panelClass}{/if}"
	id="{$panelId}"
	{if isset($panelType)}data-type="{$panelType}"{/if}
	{if isset($panelStyle) && $panelStyle != ''}style="{$panelStyle}"{/if}>

	{if $fieldType == 'checkbox'}
		<div class="form-check mt-1">
			<input type="checkbox" id="{$inputId}" class="form-check-input" autocomplete="off">
			<label class="form-check-label" for="{$inputId}">{translate key=Yes}</label>
		</div>
	{elseif $fieldType == 'select'}
		<select id="{$inputId}" class="form-select form-select-sm w-100" autocomplete="off">
			{if isset($selectOptionsHtml)}
				{$selectOptionsHtml nofilter}
			{else}
			{if isset($prependOptionValue)}
				<option value="{$prependOptionValue|escape:'html'}">{$prependOptionText|escape:'html'}</option>
			{/if}
			{if isset($allowEmptyOption) && $allowEmptyOption}
				<option value=""></option>
			{/if}
			{if isset($selectOptionsMap)}
				{foreach from=$selectOptionsMap key=optionKey item=optionText}
					<option value="{$optionKey|escape:'html'}">{$optionText|escape:'html'}</option>
				{/foreach}
			{elseif isset($selectOptions)}
				{foreach from=$selectOptions item=optionValue}
					<option value="{$optionValue|escape:'html'}">{$optionValue|escape:'html'}</option>
				{/foreach}
			{/if}
			{/if}
		</select>
	{elseif $fieldType == 'textarea'}
		<textarea id="{$inputId}" class="form-control form-control-sm w-100" rows="{if isset($textareaRows)}{$textareaRows}{else}3{/if}"
			autocomplete="off">{if isset($inputValue)}{$inputValue|escape:'html'}{/if}</textarea>
	{else}
		<input type="{if isset($fieldInputType)}{$fieldInputType}{else}{$fieldType}{/if}" id="{$inputId}"
			{if isset($inputStep) && $inputStep != ''}step="{$inputStep}"{/if}
			{if isset($inputMin) && $inputMin != ''}min="{$inputMin}"{/if}
			{if isset($inputMax) && $inputMax != ''}max="{$inputMax}"{/if}
			class="form-control form-control-sm w-100" autocomplete="off"
			value="{if isset($inputValue)}{$inputValue|escape:'html'}{/if}">
	{/if}

	<div class="d-flex gap-2 mt-2">
		<button type="button" class="btn btn-sm btn-primary inlinePopoverAccept" id="{$inputId}_accept">
			<span class="bi bi-check-circle"></span>
			{translate key='Accept'}
		</button>
		<button type="button" class="btn btn-sm btn-secondary inlinePopoverCancel" id="{$inputId}_cancel">
			<span class="bi bi-x-circle"></span>
			{translate key='Cancel'}
		</button>
	</div>
</div>
