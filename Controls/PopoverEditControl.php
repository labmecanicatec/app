<?php

/**
 * Class PopoverEditControl
 *
 * Renders a field that is edited inline through a Bootstrap 5 popover.
 *
 * Usage:
 * {control type="PopoverEditControl"
 *     FieldId='scheduleName'
 *     FieldValue=$schedule->GetName()
 *     PrimaryKey=$schedule->GetId()
 *     ParameterName=FormKeys::SCHEDULE_NAME
 *     SubmitUrl='schedules.php?action=updateSchedule'
 * }
 *
 * Optional: DisplayValue, CssClass, Required,
 *     FieldType ('text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'richtext',
 *     defaults to 'text'),
 *     DisplayHtml (true to render DisplayValue as HTML; it must already be
 *     sanitized, e.g. with sanitize_rich_text),
 *     Options (array [value => text], 'select' and 'checkbox' only),
 *     OptionsUrl ('select' only: URL returning [{value, text}], fetched
 *     when the popover opens),
 *     AutocompleteUrl ('text' only: user autocomplete URL; suggestions fill
 *     the field with "Name <email>" and free text is still allowed),
 *     EmptyText (text shown when the value is empty),
 *     Min, Max, Step ('number' only; integers by default, 'any' allows decimals)
 */

require_once(ROOT_DIR . 'Controls/Control.php');

class PopoverEditControl extends Control
{
    public function __construct(SmartyPage $smarty)
    {
        parent::__construct($smarty);
    }

    public function PageLoad()
    {
        // Required parameters
        $fieldId = $this->Get('FieldId');
        $fieldValue = $this->Get('FieldValue') ?? '';
        $primaryKey = $this->Get('PrimaryKey');
        $parameterName = $this->Get('ParameterName');
        $submitUrl = $this->Get('SubmitUrl');

        // Optional parameters
        $displayValue = $this->Get('DisplayValue') ?? $fieldValue;
        $cssClass = $this->Get('CssClass') ?? '';
        $required = $this->Get('Required') ?? false;
        $fieldType = $this->Get('FieldType') ?? 'text';
        $options = $this->Get('Options') ?? [];
        $min = $this->Get('Min');
        $max = $this->Get('Max');
        $optionsUrl = $this->Get('OptionsUrl') ?? '';
        $autocompleteUrl = $this->Get('AutocompleteUrl') ?? '';
        $step = $this->Get('Step') ?? '1';
        $emptyText = $this->Get('EmptyText') ?? '';

        // Validation
        if (empty($fieldId) || empty($parameterName) || empty($submitUrl)) {
            trigger_error(
                'PopoverEditControl: FieldId, ParameterName and SubmitUrl are required',
                E_USER_WARNING
            );
            return;
        }

        $resources = Resources::GetInstance();

        // Build the JSON config (safe to embed in inline scripts)
        $config = [
            'fieldId' => $fieldId,
            'primaryKey' => $primaryKey,
            'parameterName' => $parameterName,
            'submitUrl' => $submitUrl,
            'fieldValue' => $fieldValue,
            'required' => $required,
            'fieldType' => $fieldType,
            'options' => $this->NormalizeOptions($options),
            'min' => $min,
            'max' => $max,
            'step' => $step,
            'emptyText' => $emptyText,
            'optionsUrl' => $optionsUrl,
            'autocompleteUrl' => $autocompleteUrl,
            'messages' => [
                'required' => $resources->GetString('PopoverRequiredError'),
                'invalidInteger' => $resources->GetString('PopoverInvalidIntegerError'),
                'invalidNumber' => $resources->GetString('PopoverInvalidNumberError'),
                'saveError' => $resources->GetString('PopoverSaveError'),
                'connectionError' => $resources->GetString('PopoverConnectionError'),
                'clear' => $resources->GetString('PopoverClear'),
                'accept' => $resources->GetString('Accept'),
                'cancel' => $resources->GetString('Cancel'),
            ],
        ];

        $this->Set('FieldId', $fieldId);
        $this->Set('DisplayValue', $displayValue);
        $this->Set('DisplayHtml', (bool)($this->Get('DisplayHtml') ?? false));
        $this->Set('CssClass', $cssClass);
        $this->Set('ConfigJson', $this->JsonEncodeForScript($config));
        $this->Set('UniquePopoverId', $fieldId . '_popover_' . uniqid());

        $this->Display('Controls/PopoverEdit.tpl');
    }

    /**
     * Converts [value => text] into [['value' => value, 'text' => text], ...]
     */
    private function NormalizeOptions($options): array
    {
        $normalized = [];
        foreach ((array)$options as $value => $text) {
            $normalized[] = ['value' => (string)$value, 'text' => (string)$text];
        }
        return $normalized;
    }

    /**
     * JSON encoding that is safe inside inline scripts
     */
    private function JsonEncodeForScript(array $data): string
    {
        return json_encode($data, JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_TAG);
    }
}
