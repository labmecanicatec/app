{if $attribute->AppliesToEntity($id)}
	{assign var=type value=$attribute->Type()}
	{assign var=attributeId value="inline{$attribute->Id()}{$id}"}
	{assign var=datatype value='text'}
	{assign var=inlineClass value='inlineAttribute'}
	{assign var=pickerValue value=$value}
	{assign var=popoverInputId value="popoverInput{$attributeId}"}
	{assign var=popoverFieldType value='text'}
	{assign var=allowEmptyOption value=false}
	{assign var=usePopover value=false}

	{if $type == CustomAttributeTypes::CHECKBOX}
		{assign var=datatype value='checklist'}
		{assign var=popoverFieldType value='checkbox'}
		{assign var=usePopover value=true}
	{elseif $type == CustomAttributeTypes::MULTI_LINE_TEXTBOX}
		{assign var=datatype value='textarea'}
		{assign var=popoverFieldType value='textarea'}
		{assign var=usePopover value=true}
	{elseif $type == CustomAttributeTypes::SELECT_LIST}
		{assign var=datatype value='select'}
		{assign var=popoverFieldType value='select'}
		{assign var=allowEmptyOption value=!$attribute->Required()}
		{assign var=usePopover value=true}
	{elseif $type == CustomAttributeTypes::DATETIME}
		{assign var=AltFormat value='short_datetime'}
		{assign var=inlineClass value='inlineAttributeDateTime'}
		{assign var=usePopover value=true}
		{if $value != ''}
			{assign var=pickerValue value={formatdate date=$value format='Y-m-d H:i'}}
		{/if}
	{else}
		{assign var=usePopover value=true}
	{/if}

	<div class="updateCustomAttribute mb-0 d-inline-block position-relative">
		<label class="inline fw-bold">{$attribute->Label()}</label>

		<a class="update {if $type == CustomAttributeTypes::DATETIME}changeAttributeDateTime{elseif $usePopover}changeAttributeText{else}changeAttribute{/if} link-primary"
			title="{translate key='Edit'}" href="#">
			<span class="bi bi-pencil-square"></span>
			<span class="visually-hidden">{translate key=Edit}</span>
		</a>

		<span class="{$inlineClass} update" id="{$attributeId}" data-type="{$datatype}" data-pk="{$id}"
			data-value="{$pickerValue|escape:'html'}" data-name="{FormKeys::ATTRIBUTE_PREFIX}{$attribute->Id()}"
			{if $type == CustomAttributeTypes::SELECT_LIST}
				{assign var=possibleValuesCount value=$attribute->PossibleValueList()|@count}
				data-source='[{if !$attribute->Required()}{ldelim}"value":"","text":""{rdelim}{if $possibleValuesCount > 0},{/if}{/if}{foreach from=$attribute->PossibleValueList() item=v name=vals}{ldelim}"value":"{$v|escape:'javascript'}","text":"{$v|escape:'javascript'}"{rdelim}{if not $smarty.foreach.vals.last},{/if}{/foreach}]'
			{/if} {if $type == CustomAttributeTypes::CHECKBOX}
		data-source='[{ldelim}value:"1",text:"{translate key=Yes}"{rdelim}]' {/if}>
		{if $type == CustomAttributeTypes::DATETIME}
			{if $value != ''}{formatdate date=$value key=$AltFormat}{else}-{/if}
		{elseif $type == CustomAttributeTypes::CHECKBOX}
			{if $value == '1' || $value == 1}{translate key=Yes}{else}{translate key=No}{/if}
		{elseif $type == CustomAttributeTypes::SELECT_LIST}
			{if $value != ''}{$value|escape:'html'}{else}-{/if}
		{elseif $usePopover}
			{if $value != ''}{$value|escape:'html'}{else}-{/if}
		{/if}
	</span>

	{if $usePopover}
		{include file='Admin/InlinePopoverPanel.tpl'
			panelId="inlinePicker{$attributeId}"
			panelType=$datatype
			panelClass='inlineAttributePopoverPanel'
			inputId=$popoverInputId
			fieldType=$popoverFieldType
			selectOptions=$attribute->PossibleValueList()
			allowEmptyOption=$allowEmptyOption}

		{if $type == CustomAttributeTypes::DATETIME}
			{control type="DatePickerSetupControl" ControlId=$popoverInputId HasTimepicker=true Inline=true DefaultDate=$pickerValue AltFormat=$AltFormat}
		{/if}

		<script>
			(function() {
				const namespace = 'attr{$attributeId}';
				const type = '{$type}';
				const isDatetime = type == '{CustomAttributeTypes::DATETIME}';
				const isCheckbox = type == '{CustomAttributeTypes::CHECKBOX}';
				const isSelect = type == '{CustomAttributeTypes::SELECT_LIST}';
				const selectDisplayMap = {
					'': '-'
					{if $type == CustomAttributeTypes::SELECT_LIST}
						{foreach from=$attribute->PossibleValueList() item=v}
							, '{$v|escape:'javascript'}': '{$v|escape:'javascript'}'
						{/foreach}
					{/if}
				};
				const displayEl = document.getElementById('{$attributeId}');
				const editBtn = displayEl?.previousElementSibling;

				if (!editBtn) {
					console.warn('InlinePopoverEditor: Could not find edit button for {$attributeId}');
					return;
				}

				// Ensure InlinePopoverEditor class is loaded before using it
				const initEditor = () => {
					if (typeof InlinePopoverEditor === 'undefined') {
						// Retry after a short delay
						setTimeout(initEditor, 100);
						return;
					}

					const editor = new InlinePopoverEditor({
						namespace: namespace,
						useFlatpickr: isDatetime,
						formatDisplay: isCheckbox ?
							function(value) {
								return value === '1' ? '{translate key=Yes}' : '{translate key=No}';
							} :
							(isSelect ?
								function(value) {
									const key = value == null ? '' : String(value);
									return Object.prototype.hasOwnProperty.call(selectDisplayMap, key) ?
										selectDisplayMap[key] :
										(key === '' ? '-' : key);
								} :
								null),
						buttonElement: editBtn,
						buttonSelector: null, // Will be set manually below
						displaySelector: '#{$attributeId}',
						inputSelector: '#{$popoverInputId}',
						containerSelector: '#inlinePicker{$attributeId}',
						acceptBtnSelector: '#{$popoverInputId}_accept',
						cancelBtnSelector: '#{$popoverInputId}_cancel',
						saveUrl: '{$url}',
						getPayload: function() {
							return {
								pk: '{$id}',
								name: '{FormKeys::ATTRIBUTE_PREFIX}{$attribute->Id()}'
							};
						},
						closeEditableControls: function() {},
						onBeforeSave: function(value) {
							if (isDatetime) {
								const dateInput = document.querySelector('#{$popoverInputId}');
								if (dateInput && dateInput._flatpickr) {
									dateInput._flatpickr.close();
								}
							}
						}
					});

					{if $type == CustomAttributeTypes::DATETIME}
						// Populate datetime input with formatted value
						setTimeout(() => {
							const input = document.querySelector('#{$popoverInputId}');
							if (input && !input._flatpickr) {
								input.value = '{$pickerValue}';
							}
						}, 100);
					{elseif $type == CustomAttributeTypes::CHECKBOX}
						const checkboxInput = document.querySelector('#{$popoverInputId}');
						if (checkboxInput) {
							checkboxInput.checked = '{$pickerValue|escape:'javascript'}' === '1';
						}
					{elseif $type == CustomAttributeTypes::SELECT_LIST}
						const selectInput = document.querySelector('#{$popoverInputId}');
						if (selectInput) {
							selectInput.value = '{$pickerValue|escape:'javascript'}';
						}
					{else}
						// Populate text/textarea with current value
						const textInput = document.querySelector('#{$popoverInputId}');
						if (textInput) {
							textInput.value = '{$value|escape:'javascript'}';
						}
					{/if}
				};

				// Try to initialize immediately, or wait for class to be defined
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', initEditor);
				} else {
					initEditor();
				}
			})();
		</script>
	{/if}
</div>
{/if}
