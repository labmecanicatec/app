<?php

require_once(ROOT_DIR . 'Presenters/Reports/ReportCsvColumnView.php');
require_once(ROOT_DIR . 'lib/Email/Messages/ReportExcelExporter.php');

class ReportEmailMessage extends EmailMessage
{
    public const FORMAT_CSV = 'csv';
    public const FORMAT_EXCEL = 'excel';

    /**
     * @var string
     */
    private $to;
    /**
     * @var UserSession
     */
    private $reportUser;

    private $name = 'untitled-report';

    /**
     * @param IGeneratedSavedReport $report
     * @param IReportDefinition $definition
     * @param string $toAddress
     * @param UserSession $reportUser
     * @param string $selectedColumns
     * @param string $format Format to export (FORMAT_CSV or FORMAT_EXCEL)
     */
    public function __construct($report, $definition, $toAddress, $reportUser, $selectedColumns, $format = self::FORMAT_CSV)
    {
        parent::__construct($reportUser->LanguageCode);

        $this->to = $toAddress;
        $this->reportUser = $reportUser;

        $this->Set('Definition', $definition);
        $this->Set('Report', $report);
        $this->Set('ReportCsvColumnView', new ReportCsvColumnView($selectedColumns));

        $name = $report->ReportName();
        if (!empty($name)) {
            $this->name = $name;
        }

        if ($format === self::FORMAT_EXCEL) {
            $this->addExcelAttachment($report, $definition, $selectedColumns);
        } else {
            $this->addCsvAttachment();
        }
    }

    private function addCsvAttachment()
    {
        $contents = $this->email->FetchLocalized('Reports/custom-csv.tpl', false);
        $this->AddStringAttachment($contents, "{$this->name}.csv");
    }

    /**
     * @param IGeneratedSavedReport $report
     * @param IReportDefinition $definition
     * @param string $selectedColumns
     */
    private function addExcelAttachment($report, $definition, $selectedColumns)
    {
        $exporter = new ReportExcelExporter($report, $definition, $selectedColumns, $this->name);
        $contents = $exporter->Export();
        $this->AddStringAttachment($contents, "{$this->name}.xlsx");
    }

    public function From()
    {
        return new EmailAddress($this->reportUser->Email);
    }

    /**
     * @return array|EmailAddress[]|EmailAddress
     */
    public function To()
    {
        return new EmailAddress($this->to);
    }

    /**
     * @return string
     */
    public function Subject()
    {
        return $this->Translate('ReportSubject', $this->name);
    }

    /**
     * @return string
     */
    public function Body()
    {
        return $this->FetchTemplate('ReportEmail.tpl');
    }
}
