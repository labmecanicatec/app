<?php

require_once(ROOT_DIR . 'Presenters/Reports/ReportCsvColumnView.php');

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReportExcelExporter
{
    /**
     * @var IGeneratedSavedReport
     */
    private $report;

    /**
     * @var IReportDefinition
     */
    private $definition;

    /**
     * @var ReportCsvColumnView
     */
    private $columnView;

    /**
     * @var string
     */
    private $reportName;

    /**
     * @param IGeneratedSavedReport $report
     * @param IReportDefinition $definition
     * @param string $selectedColumns
     * @param string $reportName
     */
    public function __construct($report, $definition, $selectedColumns, $reportName = 'report')
    {
        $this->report = $report;
        $this->definition = $definition;
        $this->columnView = new ReportCsvColumnView($selectedColumns);
        $this->reportName = $reportName;
    }

    /**
     * Generate Excel file and return binary content
     * @return string
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     */
    public function Export()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Report');

        $this->addHeaders($sheet);
        $this->addData($sheet);
        $this->formatSheet($sheet);

        $writer = new Xlsx($spreadsheet);
        $filename = tempnam(sys_get_temp_dir(), 'report_');
        $writer->save($filename);

        $content = file_get_contents($filename);
        unlink($filename);

        return $content;
    }

    /**
     * @param Worksheet $sheet
     */
    private function addHeaders($sheet)
    {
        $column = 1;
        $headers = $this->definition->GetColumnHeaders();

        foreach ($headers as $col) {
            if ($this->columnView->ShouldShowCol($col, $column - 1)) {
                $title = $col->HasTitle() ? $col->Title() : Resources::GetInstance()->GetString($col->TitleKey());
                $sheet->setCellValueByColumnAndRow($column, 1, $title);
                $column++;
            }
        }

        // Format header row
        for ($i = 1; $i < $column; $i++) {
            $sheet->getStyleByColumnAndRow($i, 1)->getFont()->setBold(true);
        }
    }

    /**
     * @param Worksheet $sheet
     */
    private function addData($sheet)
    {
        $rows = $this->report->GetData()->Rows();
        $rowIndex = 2;

        foreach ($rows as $row) {
            $column = 1;
            $dataItems = $this->definition->GetRow($row);

            foreach ($dataItems as $data) {
                if ($this->columnView->ShouldShowCell($column - 1)) {
                    $sheet->setCellValueByColumnAndRow($column, $rowIndex, $data->Value());
                    $column++;
                }
            }

            $rowIndex++;
        }
    }

    /**
     * @param Worksheet $sheet
     */
    private function formatSheet($sheet)
    {
        // Auto-size columns
        foreach ($sheet->getColumnIterator() as $column) {
            $sheet->getColumnDimension($column->getColumnIndex())->setAutoSize(true);
        }

        // Set minimum column width
        foreach ($sheet->getColumnIterator() as $column) {
            $width = $sheet->getColumnDimension($column->getColumnIndex())->getWidth();
            if ($width < 15) {
                $sheet->getColumnDimension($column->getColumnIndex())->setWidth(15);
            }
        }
    }
}
