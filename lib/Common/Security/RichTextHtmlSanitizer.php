<?php

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;
use Symfony\Component\HtmlSanitizer\Visitor\AttributeSanitizer\AttributeSanitizerInterface;

class RichTextHtmlSanitizer
{
    private const ALLOWED_RATIO_CLASSES = ['ratio', 'ratio-1x1', 'ratio-4x3', 'ratio-16x9', 'ratio-21x9'];

    private const ALLOWED_IFRAME_HOSTS = [
        'www.youtube.com',
        'youtube.com',
        'www.youtube-nocookie.com',
        'youtube-nocookie.com',
    ];

    private static ?HtmlSanitizer $sanitizer = null;

    public static function Sanitize(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        $decoded = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return self::GetSanitizer()->sanitize($decoded);
    }

    private static function GetSanitizer(): HtmlSanitizer
    {
        if (self::$sanitizer === null) {
            // 2026-06-06: Allow a safe subset of Trumbowyg output (headings,
            // lists, links, images) plus constrained YouTube embeds used in
            // dashboard announcements.
            $config = (new HtmlSanitizerConfig())
                ->allowElement('a', ['href', 'title', 'target'])
                ->allowElement('b')
                ->allowElement('blockquote')
                ->allowElement('br')
                ->allowElement('center')
                ->allowElement('del')
                ->allowElement('div', ['class'])
                ->allowElement('em')
                ->allowElement('h1')
                ->allowElement('h2')
                ->allowElement('h3')
                ->allowElement('h4')
                ->allowElement('h5')
                ->allowElement('h6')
                ->allowElement('i')
                ->allowElement('iframe', ['src', 'title', 'width', 'height', 'allowfullscreen'])
                ->allowElement('img', ['src', 'alt', 'title', 'width', 'height'])
                ->allowElement('li')
                ->allowElement('ol')
                ->allowElement('p')
                ->allowElement('s')
                ->allowElement('strong')
                ->allowElement('u')
                ->allowElement('ul')
                ->allowLinkSchemes(['http', 'https', 'mailto'])
                ->allowRelativeLinks()
                ->allowMediaSchemes(['http', 'https'])
                ->allowRelativeMedias()
                ->withAttributeSanitizer(self::SchemeRelativeLinkBlocker())
                ->withAttributeSanitizer(self::RatioClassSanitizer())
                ->withAttributeSanitizer(self::EmbeddedIframeSourceSanitizer())
                ->forceAttribute('a', 'rel', 'noopener noreferrer');

            self::$sanitizer = new HtmlSanitizer($config);
        }

        return self::$sanitizer;
    }

    private static function SchemeRelativeLinkBlocker(): AttributeSanitizerInterface
    {
        return new class() implements AttributeSanitizerInterface {
            public function getSupportedElements(): ?array
            {
                return ['a'];
            }

            public function getSupportedAttributes(): ?array
            {
                return ['href'];
            }

            public function sanitizeAttribute(string $element, string $attribute, string $value, HtmlSanitizerConfig $config): ?string
            {
                if (str_starts_with(trim($value), '//')) {
                    return null;
                }

                return $value;
            }
        };
    }

    private static function RatioClassSanitizer(): AttributeSanitizerInterface
    {
        $allowedClasses = self::ALLOWED_RATIO_CLASSES;

        return new class($allowedClasses) implements AttributeSanitizerInterface {
            /** @var string[] */
            private array $allowedClasses;

            /** @param string[] $allowedClasses */
            public function __construct(array $allowedClasses)
            {
                $this->allowedClasses = $allowedClasses;
            }

            public function getSupportedElements(): ?array
            {
                return ['div'];
            }

            public function getSupportedAttributes(): ?array
            {
                return ['class'];
            }

            public function sanitizeAttribute(string $element, string $attribute, string $value, HtmlSanitizerConfig $config): ?string
            {
                $allowedClasses = array_values(array_intersect(
                    preg_split('/\s+/', trim($value)) ?: [],
                    $this->allowedClasses
                ));

                if (empty($allowedClasses)) {
                    return null;
                }

                return implode(' ', $allowedClasses);
            }
        };
    }

    private static function EmbeddedIframeSourceSanitizer(): AttributeSanitizerInterface
    {
        $allowedHosts = self::ALLOWED_IFRAME_HOSTS;

        return new class($allowedHosts) implements AttributeSanitizerInterface {
            /** @var string[] */
            private array $allowedHosts;

            /** @param string[] $allowedHosts */
            public function __construct(array $allowedHosts)
            {
                $this->allowedHosts = $allowedHosts;
            }

            public function getSupportedElements(): ?array
            {
                return ['iframe'];
            }

            public function getSupportedAttributes(): ?array
            {
                return ['src'];
            }

            public function sanitizeAttribute(string $element, string $attribute, string $value, HtmlSanitizerConfig $config): ?string
            {
                $value = trim($value);

                if ($value === '' || str_starts_with($value, '//')) {
                    return null;
                }

                $parts = parse_url($value);
                if ($parts === false) {
                    return null;
                }

                $scheme = strtolower($parts['scheme'] ?? '');
                $host = strtolower($parts['host'] ?? '');
                $path = $parts['path'] ?? '';

                if ($scheme !== 'https') {
                    return null;
                }

                if (!in_array($host, $this->allowedHosts, true)) {
                    return null;
                }

                if (!str_starts_with($path, '/embed/') || $path === '/embed/') {
                    return null;
                }

                return $value;
            }
        };
    }
}
