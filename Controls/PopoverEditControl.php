<?php

/**
 * Class PopoverEditControl
 *
 * Control que genera campos editables inline con Bootstrap 5 Popover.
 *
 * Uso:
 * {control type="PopoverEditControl"
 *     FieldId='scheduleName'
 *     FieldValue=$schedule->GetName()
 *     PrimaryKey=$schedule->GetId()
 *     ParameterName=FormKeys::SCHEDULE_NAME
 *     SubmitUrl='schedules.php?action=updateSchedule'
 * }
 *
 * Opcionales: DisplayValue, CssClass, Required,
 *     FieldType ('text' | 'number' | 'select' | 'richtext', por defecto 'text'),
 *     DisplayHtml (true para mostrar DisplayValue como HTML; debe venir
 *     ya sanitizado, p. ej. con sanitize_rich_text),
 *     Options (array [valor => texto], solo para 'select'),
 *     OptionsUrl (solo para 'select': URL que devuelve [{value, text}],
 *     se consulta al abrir el popover),
 *     EmptyText (texto mostrado cuando el valor queda vacío),
 *     Min, Max, Step (solo para 'number'; por defecto enteros, 'any' permite decimales)
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
        // Parámetros requeridos
        $fieldId = $this->Get('FieldId');
        $fieldValue = $this->Get('FieldValue') ?? '';
        $primaryKey = $this->Get('PrimaryKey');
        $parameterName = $this->Get('ParameterName');
        $submitUrl = $this->Get('SubmitUrl');

        // Parámetros opcionales
        $displayValue = $this->Get('DisplayValue') ?? $fieldValue;
        $cssClass = $this->Get('CssClass') ?? '';
        $required = $this->Get('Required') ?? false;
        $fieldType = $this->Get('FieldType') ?? 'text';
        $options = $this->Get('Options') ?? [];
        $min = $this->Get('Min');
        $max = $this->Get('Max');
        $optionsUrl = $this->Get('OptionsUrl') ?? '';
        $step = $this->Get('Step') ?? '1';
        $emptyText = $this->Get('EmptyText') ?? '';

        // Validaciones
        if (empty($fieldId) || empty($parameterName) || empty($submitUrl)) {
            trigger_error(
                'PopoverEditControl: FieldId, ParameterName y SubmitUrl son requeridos',
                E_USER_WARNING
            );
            return;
        }

        $resources = Resources::GetInstance();

        // Construir configuración JSON (segura para inline scripts)
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
            'messages' => [
                'required' => $resources->GetString('PopoverRequiredError'),
                'invalidInteger' => $resources->GetString('PopoverInvalidIntegerError'),
                'invalidNumber' => $resources->GetString('PopoverInvalidNumberError'),
                'saved' => $resources->GetString('PopoverSaved'),
                'saveError' => $resources->GetString('PopoverSaveError'),
                'connectionError' => $resources->GetString('PopoverConnectionError'),
                'accept' => $resources->GetString('Accept'),
                'cancel' => $resources->GetString('Cancel'),
                'close' => $resources->GetString('Close'),
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
     * Convierte [valor => texto] en [['value' => valor, 'text' => texto], ...]
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
     * JSON encoding seguro para inline scripts
     */
    private function JsonEncodeForScript(array $data): string
    {
        return json_encode($data, JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_TAG);
    }
}
