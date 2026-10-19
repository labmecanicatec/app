<?php

/**
 * Class BootstrapPopoverEditControl
 * 
 * Control que genera campos editables inline con Bootstrap 6 Popover + Floating UI.
 * Reemplaza x-editable con enfoque minimalista.
 * 
 * Uso:
 * {control type="BootstrapPopoverEditControl"
 *     FieldId='scheduleName'
 *     FieldValue=$schedule->GetName()
 *     PrimaryKey=$schedule->GetId()
 *     ParameterName=FormKeys::SCHEDULE_NAME
 *     SubmitUrl='schedules.php?action=updateSchedule'
 * }
 */

require_once(ROOT_DIR . 'Controls/Control.php');

class BootstrapPopoverEditControl extends Control
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
        $buttonClass = $this->Get('ButtonClass') ?? 'theme-primary';
        $required = $this->Get('Required') ?? false;

        // Validaciones
        if (empty($fieldId) || empty($parameterName) || empty($submitUrl)) {
            trigger_error(
                'BootstrapPopoverEditControl: FieldId, ParameterName y SubmitUrl son requeridos',
                E_USER_WARNING
            );
            return;
        }

        // Construir configuración JSON (segura para inline scripts)
        $config = [
            'fieldId' => $fieldId,
            'primaryKey' => $primaryKey,
            'parameterName' => $parameterName,
            'submitUrl' => $submitUrl,
            'fieldValue' => $fieldValue,
            'required' => $required
        ];

        $this->Set('FieldId', $fieldId);
        $this->Set('DisplayValue', $displayValue);
        $this->Set('CssClass', $cssClass);
        $this->Set('ButtonClass', $buttonClass);
        $this->Set('ConfigJson', $this->JsonEncodeForScript($config));
        $this->Set('UniquePopoverId', $fieldId . '_popover_' . uniqid());

        $this->Display('Controls/BootstrapPopoverEdit.tpl');
    }

    /**
     * JSON encoding seguro para inline scripts
     */
    private function JsonEncodeForScript(array $data): string
    {
        return json_encode($data, JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_TAG);
    }
}
