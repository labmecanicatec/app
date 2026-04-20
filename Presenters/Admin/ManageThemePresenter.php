<?php

require_once(ROOT_DIR . 'Presenters/ActionPresenter.php');
require_once(ROOT_DIR . 'lib/Application/Admin/ImageUploadDirectory.php');

use enshrined\svgSanitize\Sanitizer;

class ManageThemePresenter extends ActionPresenter
{
    /**
     * @var ManageThemePage
     */
    private $page;
    private ?Sanitizer $svgSanitizer = null;

    public function __construct(ManageThemePage $page)
    {
        parent::__construct($page);
        $this->page = $page;
        $this->AddAction('update', 'UpdateTheme');
        $this->AddAction('removeLogo', 'RemoveLogo');
        $this->AddAction('removeFavicon', 'RemoveFavicon');
        $this->AddAction('removeCss', 'RemoveCss');
    }

    public function UpdateTheme()
    {
        $logoFile = $this->page->GetLogoFile();
        $cssFile = $this->page->GetCssFile();
        $favicon = $this->page->GetFaviconFile();

        if ($logoFile != null) {
            Log::Debug('Replacing logo with ' . $logoFile->OriginalName());

            $this->RemoveLogo();

            $imageUploadDirectory = new ImageUploadDirectory();
            $uploadDir = $imageUploadDirectory->GetDirectory();
            $target = $uploadDir . '/custom-logo.' . $logoFile->Extension();
            $copied = $this->copyFileOrSanitizedSvg($logoFile->TemporaryName(), $target, $logoFile->Extension());
            if (!$copied) {
                Log::Error(
                    'Could not replace logo with %s. Ensure %s is writable.',
                    $logoFile->OriginalName(),
                    $target
                );
            }
        }
        if ($cssFile != null) {
            Log::Debug('Replacing css file with ' . $cssFile->OriginalName());
            $target = ROOT_DIR . 'Web/css/custom-style.css';
            $copied = copy($cssFile->TemporaryName(), $target);
            if (!$copied) {
                Log::Error(
                    'Could not replace css with %s. Ensure %s is writable.',
                    $cssFile->OriginalName(),
                    $target
                );
            }
        }
        if ($favicon != null) {
            Log::Debug('Replacing favicon with ' . $favicon->OriginalName());

            $this->RemoveFavicon();

            $imageUploadDirectory = new ImageUploadDirectory();
            $uploadDir = $imageUploadDirectory->GetDirectory();
            $target = $uploadDir . '/custom-favicon.' . $favicon->Extension();

            $copied = $this->copyFileOrSanitizedSvg($favicon->TemporaryName(), $target, $favicon->Extension());
            if (!$copied) {
                Log::Error(
                    'Could not replace favicon with %s. Ensure %s is writable.',
                    $favicon->OriginalName(),
                    $target
                );
            }
        }
    }

    public function RemoveLogo()
    {
        try {
            $imageUploadDirectory = new ImageUploadDirectory();
            $dirs = [
                $imageUploadDirectory->GetDirectory(),
                ROOT_DIR . 'Web/img',
            ];
            foreach ($dirs as $dir) {
                $targets = glob($dir . '/custom-logo.*');
                foreach ($targets as $target) {
                    $removed = unlink($target);
                    if (!$removed) {
                        Log::Error('Could not remove existing logo. Ensure %s is writable.', $target);
                    }
                }
            }
        } catch (Exception $ex) {
            Log::Error('Could not remove logos. %s', $ex);
        }
    }

    public function RemoveFavicon()
    {
        try {
            $imageUploadDirectory = new ImageUploadDirectory();
            $dirs = [
                $imageUploadDirectory->GetDirectory(),
                ROOT_DIR . 'Web',
            ];
            foreach ($dirs as $dir) {
                $targets = glob($dir . '/custom-favicon.*');
                foreach ($targets as $target) {
                    $removed = unlink($target);
                    if (!$removed) {
                        Log::Error('Could not remove existing favicon. Ensure %s is writable.', $target);
                    }
                }
            }
        } catch (Exception $ex) {
            Log::Error('Could not remove favicon. %s', $ex);
        }
    }

    public function RemoveCss()
    {
        try {
            $targets = glob(ROOT_DIR . 'Web/css/custom-style.css');
            foreach ($targets as $target) {
                $removed = unlink($target);
                if (!$removed) {
                    Log::Error('Could not remove existing css. Ensure %s is writable.', $target);
                }
            }
        } catch (Exception $ex) {
            Log::Error('Could not remove css file. %s', $ex);
        }
    }
    protected function LoadValidators($action)
    {
        $this->page->RegisterValidator('logoFile', new FileUploadValidator($this->page->GetLogoFile()));
        $this->page->RegisterValidator('logoFileExt', new FileTypeValidator($this->page->GetLogoFile(), ['jpg', 'png', 'gif', 'svg']));
        $this->page->RegisterValidator('cssFile', new FileUploadValidator($this->page->GetCssFile()));
        $this->page->RegisterValidator('cssFileExt', new FileTypeValidator($this->page->GetCssFile(), 'css'));
        $this->page->RegisterValidator('faviconFile', new FileUploadValidator($this->page->GetFaviconFile()));
        $this->page->RegisterValidator('faviconFileExt', new FileTypeValidator($this->page->GetFaviconFile(), ['ico', 'jpg', 'png', 'gif', 'svg']));
    }

    private function copyFileOrSanitizedSvg(string $sourcePath, string $targetPath, string $extension): bool
    {
        if (strtolower($extension) !== 'svg') {
            return copy($sourcePath, $targetPath);
        }

        $svg = file_get_contents($sourcePath);
        if ($svg === false) {
            return false;
        }

        $sanitized = $this->sanitizeSvg($svg);
        if ($sanitized === null) {
            return false;
        }

        return file_put_contents($targetPath, $sanitized) !== false;
    }

    private function getSvgSanitizer(): Sanitizer
    {
        if ($this->svgSanitizer === null) {
            $this->svgSanitizer = new Sanitizer();
        }

        return $this->svgSanitizer;
    }

    private function sanitizeSvg(string $svg): ?string
    {
        // Remove XML declaration to normalize uploaded SVG files.
        $svg = preg_replace('/<\?xml[^?]*\?>\s*/i', '', $svg);

        $sanitized = $this->getSvgSanitizer()->sanitize($svg);

        return $sanitized !== false ? $sanitized : null;
    }
}
