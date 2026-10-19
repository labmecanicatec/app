<!DOCTYPE html>
<html lang="{$HtmlLang}" dir="{$HtmlTextDirection}" data-bs-theme="light">

<head>
    <title>{if isset($TitleKey) && $TitleKey neq ''}{translate key=$TitleKey args=$TitleArgs}{else}{$Title}{/if}</title>
    <meta http-equiv="Content-Type" content="text/html; charset={$Charset}" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex" />
    {if isset($ShouldLogout) && $ShouldLogout}
        <meta http-equiv="REFRESH"
            content="{$SessionTimeoutSeconds};URL={$Path}logout.php?{QueryStringKeys::REDIRECT}={$smarty.server.REQUEST_URI|urlencode}" />
    {/if}
    {if $FaviconUrl == 'favicon.svg'}
        {* PNG for browsers without SVG favicons; its `sizes` attribute keeps Chrome on the SVG *}
        <link rel="icon" href="{$Path}favicon.png" sizes="62x75" type="image/png" />
        <link rel="icon" href="{$Path}{$FaviconUrl}" type="image/svg+xml" />
    {else}
        <link rel="icon" href="{$Path}{$FaviconUrl}" />
    {/if}
    <!-- JavaScript -->
    {if isset($UseLocalJquery) && $UseLocalJquery}
        {vendor_js src="jquery/3.3.1/jquery-3.3.1.min.js"}
        {vendor_js src="jquery-migrate/3.6.0/jquery-migrate-3.6.0.min.js"}
        {vendor_js src="jquery-ui/1.14.2/js/jquery-ui.1.14.2.min.js"}
        {vendor_js src="bootstrap/5.3.3/js/bootstrap.bundle.min.js"}
    {else}
        <script src="https://code.jquery.com/jquery-3.3.1.min.js"
            integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/jquery-migrate-3.6.0.min.js"
            integrity="sha256-LWwll4H5AAC/20gH21NFgk4rYMvZhvc1KD0c5iG7QvM=" crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/ui/1.14.2/jquery-ui.min.js"
            integrity="sha256-mblSWfbYzaq/f+4akyMhE6XELCou4jbkgPv+JQPER2M=" crossorigin="anonymous"></script>
        <script type="module">
            import *
            as bootstrap from 'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.2/dist/js/bootstrap.bundle.min.js';
            window.bootstrap = bootstrap;
        </script>
    {/if}

    <!-- End JavaScript -->

    <!-- CSS -->
    {if isset($UseLocalJquery) && $UseLocalJquery}
        {vendor_css src="jquery-ui/1.14.2/css/jquery-ui.1.14.2.min.css"}
        {vendor_css src="bootstrap-icons/1.11.3/css/bootstrap-icons.min.css"}
        {vendor_css src="bootstrap/5.3.3/css/bootstrap.css"}
        {vendor_css src="flatpickr/4.6.13/css/flatpickr.min.css"}
        {if isset($Trumbowyg) && $Trumbowyg}
            {vendor_css src="trumbowyg/2.27.3/css/trumbowyg.min.css"}
        {/if}
        {if isset($DataTable) && $DataTable}
            {vendor_css src="datatables/3.0.1/css/dataTables.bootstrap5.min.css"}
            {vendor_css src="datatables-responsive/4.0.1/css/responsive.bootstrap5.min.css"}
            {vendor_css src="datatables-buttons/4.0.1/css/buttons.bootstrap5.min.css"}
        {/if}
    {else}
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.14.2/themes/smoothness/jquery-ui.css" type="text/css" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-MKn5NWVBEuQXJE7TSKSgPUmMiSCmVTfCsR+VSSeQpHnoyJQZZFn/kBn+Ht5jZDPQ" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css"
            integrity="sha384-RkASv+6KfBMW9eknReJIJ6b3UnjKOKC5bOUaNgIY778NFbQ8MtWq9Lr/khUgqtTt" crossorigin="anonymous">
        {if isset($Trumbowyg) && $Trumbowyg}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/ui/trumbowyg.min.css"
                type="text/css" />
        {/if}
        {if isset($DataTable) && $DataTable}
            <link href="https://cdn.datatables.net/3.0.1/css/dataTables.bootstrap5.min.css" rel="stylesheet"
                integrity="sha384-OlHQFPrLwnmeXJfLPQ4jqFbOgPdCIW0hRoNKjPLyIZv7FxVwt3dythZstNHJQRtV" crossorigin="anonymous">
            <link href="https://cdn.datatables.net/responsive/4.0.1/css/responsive.bootstrap5.min.css" rel="stylesheet"
                integrity="sha384-IccFVZxMebKzou2YAT+5kHCpRTtvbJKtU1WS6PmGGeO3LvfGhMNgmeDE5k59j9Qk" crossorigin="anonymous">
            <link href="https://cdn.datatables.net/buttons/4.0.1/css/buttons.bootstrap5.min.css" rel="stylesheet"
                integrity="sha384-bYPwNBWmi1WFXmRpFZBo/GIeUEOJhbZ+Lcavx5JEeGMZVFxBtV7+FXUtsJZd/+yD" crossorigin="anonymous">
        {/if}
    {/if}
    {if isset($InlineEdit) && $InlineEdit}
        {vendor_css src="x-editable/1.5.1/css/bootstrap-editable.css"}
    {/if}
    {if isset($Select2) && $Select2}
        {if isset($UseLocalJquery) && $UseLocalJquery}
            {vendor_css src="select2/4.1.0/css/select2.min.css"}
        {else}
            <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0/dist/css/select2.min.css" rel="stylesheet" />
        {/if}
    {/if}

    {if isset($CssFontStylesheet) && $CssFontStylesheet neq ''}
        {cssfile src=$CssFontStylesheet}
    {/if}
    {cssfile src="librebooking.css"}
    {if isset($cssFiles) && $cssFiles neq ''}
        {assign var='CssFileList' value=$cssFiles|split:','}
        {foreach from=$CssFileList item=cssFile}
            {cssfile src=$cssFile}
        {/foreach}
    {/if}
    {if isset($CssUrl) && $CssUrl neq ''}
        {cssfile src=$CssUrl}
    {/if}
    {if isset($CssStylingFile) && $CssStylingFile neq ''}
        {cssfile src='styling-plugin.php'}
    {/if}
    {if isset($CssExtensionFile) && $CssExtensionFile neq ''}
        {cssfile src=$CssExtensionFile}
    {/if}

    {if isset($printCssFiles) && $printCssFiles neq ''}
        {assign var='PrintCssFileList' value=$printCssFiles|split:','}
        {foreach from=$PrintCssFileList item=cssFile}
            <link rel='stylesheet' type='text/css' href='{$Path}{$cssFile}' media='print' />
        {/foreach}
    {/if}

    <!-- End CSS -->
</head>

<body data-bs-theme='{$cssTheme}' data-font='{$CssFont|escape}'>

    <noscript>
        <div class="alert theme-warning text-center m-3" role="alert">
            {translate key="JavascriptRequired"}
        </div>
    </noscript>

    {* Alert everyone if `script.url` is unset or missing the required `/Web` suffix, as either will cause issues. *}
    {if !isset($ScriptUrl) || $ScriptUrl eq ''}
        <div id="script-url-warning" class="alert theme-danger text-center m-3" role="alert">
            {translate key="ScriptUrlNotConfigured"}
        </div>
    {elseif !empty($ScriptUrlMissingWebSuffix)}
        <div id="script-url-web-suffix-warning" class="alert theme-danger text-center m-3" role="alert">
            {translate key="ScriptUrlMissingWebSuffix"}
        </div>
    {/if}

    {if !isset($HideNavBar) || $HideNavBar == false}
        <div class="d-flex align-items-center gap-3 m-3">
            <a class="navbar-brand" href="{$HomeUrl}">
                {if !empty($LogoSvg)}
                    <span class="logo logo-svg" role="img" aria-label="{$Title}">{$LogoSvg nofilter}</span>
                {else}
                    <img src="{$Path}{$LogoUrl}?{$Version}" alt="{$Title}" class="logo">
                {/if}
            </a>
            <div class="vr mx-3"></div>
            <div class="d-flex flex-column">
                {if $CompanyName neq ''}
                    <h5 class="mb-0"><a class="fg-primary" href="{$CompanyUrl}">{$CompanyName}</a></h5>
                {/if}
                <h5 class="mb-0"><a class="fg-primary" href="{$HomeUrl}">{$AppTitle}</a></h5>
            </div>
        </div>
        <nav class="navbar md:navbar-expand sticky-top bg-primary" data-bs-theme="dark">
            <div class="container-fluid">
                <button class="btn-icon navbar-toggler" type="button" data-bs-toggle="drawer"
                    data-bs-target="#librebooking-navigation" aria-controls="librebooking-navigation" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon" aria-hidden="true"></span>
                </button>

                <dialog class="drawer drawer-end" tabindex="-1" id="librebooking-navigation"
                    aria-labelledby="librebooking-navigation-label">
                    <div class="drawer-header">
                        <h5 class="drawer-title" id="librebooking-navigation-label">{$AppTitle}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="drawer" aria-label="Close"></button>
                    </div>
                    <div class="drawer-body">
                        <ul class="navbar-nav me-auto mb-3 md:mb-0">
                            {if isset($LoggedIn) && $LoggedIn}
                                <li class="nav-item" id="navDashboard"><a class="nav-link"
                                        href="{$Path}{Pages::DASHBOARD}">{translate key="Dashboard"}</a></li>

                                <li class="nav-item" id="navMyAccountDropdown">
                                    <button class="nav-link" type="button" data-bs-toggle="menu"
                                        aria-expanded="false">{translate key="MyAccount"}</button>
                                    <div class="menu">
                                        <a class="menu-item" id="navProfile"
                                            href="{$Path}{Pages::PROFILE}">{translate key="Profile"}</a>
                                        <a class="menu-item" id="navPassword"
                                            href="{$Path}{Pages::PASSWORD}">{translate key="ChangePassword"}</a>
                                        <a class="menu-item" id="navNotification"
                                            href="{$Path}{Pages::NOTIFICATION_PREFERENCES}">{translate key="NotificationPreferences"}</a>
                                        {if isset($ShowParticipation) && $ShowParticipation}
                                            <a class="menu-item" id="navInvitations"
                                                href="{$Path}{Pages::PARTICIPATION}">{translate key="OpenInvitations"}</a>
                                        {/if}
                                        {if isset($CreditsEnabled) && $CreditsEnabled}
                                            <a class="menu-item" id="navUserCredits"
                                                href="{$Path}{Pages::CREDITS}">{translate key="Credits"}</a>
                                        {/if}
                                    </div>
                                </li>

                                <li class="nav-item" id="navScheduleDropdown">
                                    <button class="nav-link" type="button" data-bs-toggle="menu"
                                        aria-expanded="false">{translate key="Schedule"}</button>
                                    <div class="menu">
                                        <a class="menu-item" id="navBookings"
                                            href="{$Path}{Pages::SCHEDULE}">{translate key="Bookings"}</a>
                                        <hr class="menu-divider">
                                        <a class="menu-item" id="navMyCalendar"
                                            href="{$Path}{Pages::MY_CALENDAR}">{translate key="MyCalendar"}</a>
                                        <a class="menu-item" id="navResourceCalendar"
                                            href="{$Path}{Pages::CALENDAR}">{translate key="ResourceCalendar"}</a>
                                        <hr class="menu-divider">
                                        <a class="menu-item" id="navFindATime"
                                            href="{$Path}{Pages::OPENINGS}">{translate key="FindATime"}</a>
                                        <a class="menu-item" id="navSearchReservations"
                                            href="{$Path}{Pages::SEARCH_RESERVATIONS}">{translate key="SearchReservations"}</a>
                                    </div>
                                </li>

                                <li class="nav-item" id="navCheckDropdown">
                                    <button class="nav-link" type="button" data-bs-toggle="menu"
                                        aria-expanded="false">{translate key="Check"}</button>
                                    <div class="menu">
                                        <a class="menu-item" id="CheckResources"
                                            href="{$Path}view_resources.php">{translate key=Resources}</a>
                                        <a class="menu-item" id="CheckSchedules"
                                            href="{$Path}view_schedules.php">{translate key=Schedules}</a>
                                    </div>
                                </li>

                                {if isset($CanViewAdmin) && $CanViewAdmin}
                                    <li class="nav-item" id="navApplicationManagementDropdown">
                                        <button class="nav-link" type="button" data-bs-toggle="menu"
                                            aria-expanded="false">{translate key="ApplicationManagement"}</button>
                                        <div class="menu">
                                            <a class="menu-item" id="navManageReservations"
                                                href="{$Path}admin/manage_reservations.php">{translate key="ManageReservations"}</a>
                                            <a class="menu-item" id="navManageBlackouts"
                                                href="{$Path}admin/manage_blackouts.php">{translate key="ManageBlackouts"}</a>
                                            <a class="menu-item" id="navManageQuotas"
                                                href="{$Path}admin/manage_quotas.php">{translate key="ManageQuotas"}</a>
                                            <hr class="menu-divider">
                                            <a class="menu-item" id="navManageSchedules"
                                                href="{$Path}admin/manage_schedules.php">{translate key="ManageSchedules"}</a>
                                            <a class="menu-item" id="navManageResources"
                                                href="{$Path}admin/manage_resources.php">{translate key="ManageResources"}</a>
                                            <a class="menu-item" id="navManageAccessories"
                                                href="{$Path}admin/manage_accessories.php">{translate key="ManageAccessories"}</a>
                                            <hr class="menu-divider">
                                            <a class="menu-item" id="navManageUsers"
                                                href="{$Path}admin/manage_users.php">{translate key="ManageUsers"}</a>
                                            <a class="menu-item" id="navManageGroups"
                                                href="{$Path}admin/manage_groups.php">{translate key="ManageGroups"}</a>
                                            <a class="menu-item" id="navManageAnnouncements"
                                                href="{$Path}admin/manage_announcements.php">{translate key="ManageAnnouncements"}</a>
                                            <hr class="menu-divider">
                                            {if isset($PaymentsEnabled) && $PaymentsEnabled}
                                                <a class="menu-item" id="navManagePayments"
                                                    href="{$Path}admin/manage_payments.php">{translate key="ManagePayments"}</a>
                                            {/if}
                                            <a class="menu-item" id="navManageAttributes"
                                                href="{$Path}admin/manage_attributes.php">{translate key="CustomAttributes"}</a>
                                        </div>
                                    </li>
                                {/if}

                                {if isset($CanViewResponsibilities) && $CanViewResponsibilities}
                                    <li class="nav-item" id="navResponsibilitiesDropdown">
                                        <button class="nav-link" type="button" data-bs-toggle="menu"
                                            aria-expanded="false">{translate key="Responsibilities"}</button>
                                        <div class="menu">
                                            {if isset($CanViewGroupAdmin) && $CanViewGroupAdmin}
                                                <a class="menu-item" id="navResponsibilitiesGAUsers"
                                                    href="{$Path}admin/manage_group_users.php">{translate key="ManageUsers"}</a>
                                                <a class="menu-item" id="navResponsibilitiesGAReservations"
                                                    href="{$Path}admin/manage_group_reservations.php">{translate key="GroupReservations"}</a>
                                                <a class="menu-item" id="navResponsibilitiesGAGroups"
                                                    href="{$Path}admin/manage_admin_groups.php">{translate key="ManageGroups"}</a>
                                            {/if}
                                            {if (isset($CanViewResourceAdmin) && $CanViewResourceAdmin) || (isset($CanViewScheduleAdmin) && $CanViewScheduleAdmin)}
                                                <a class="menu-item" id="navResponsibilitiesRAResources"
                                                    href="{$Path}admin/manage_admin_resources.php">{translate key="ManageResources"}</a>
                                                <a class="menu-item" id="navResponsibilitiesRABlackouts"
                                                    href="{$Path}admin/manage_blackouts.php">{translate key="ManageBlackouts"}</a>
                                            {/if}
                                            {if isset($CanViewResourceAdmin) && $CanViewResourceAdmin}
                                                <a class="menu-item" id="navResponsibilitiesRAReservations"
                                                    href="{$Path}admin/manage_resource_reservations.php">{translate key="ResourceReservations"}</a>
                                            {/if}
                                            {if isset($CanViewScheduleAdmin) && $CanViewScheduleAdmin}
                                                <a class="menu-item" id="navResponsibilitiesSASchedules"
                                                    href="{$Path}admin/manage_admin_schedules.php">{translate key="ManageSchedules"}</a>
                                                <a class="menu-item" id="navResponsibilitiesSAReservations"
                                                    href="{$Path}admin/manage_schedule_reservations.php">{translate key="ScheduleReservations"}</a>
                                            {/if}
                                            <a class="menu-item" id="navResponsibilitiesAnnouncements"
                                                href="{$Path}admin/manage_announcements.php">{translate key="ManageAnnouncements"}</a>
                                        </div>
                                    </li>
                                {/if}

                                {if isset($CanViewReports) && $CanViewReports}
                                    <li class="nav-item" id="navReportsDropdown">
                                        <button class="nav-link" type="button" data-bs-toggle="menu"
                                            aria-expanded="false">{translate key="Reports"}</button>
                                        <div class="menu">
                                            <a class="menu-item" id="navGenerateReport"
                                                href="{$Path}reports/{Pages::REPORTS_GENERATE}">{translate key=GenerateReport}</a>
                                            <a class="menu-item" id="navSavedReports"
                                                href="{$Path}reports/{Pages::REPORTS_SAVED}">{translate key=MySavedReports}</a>
                                            <a class="menu-item" id="navCommonReports"
                                                href="{$Path}reports/{Pages::REPORTS_COMMON}">{translate key=CommonReports}</a>
                                        </div>
                                    </li>
                                {/if}
                            {/if}
                        </ul>

                        <ul class="navbar-nav">
                            {if isset($ShowScheduleLink) && $ShowScheduleLink}
                                <li class="nav-item" id="navPublicScheduleDropdown">
                                    <button class="nav-link" type="button" data-bs-toggle="menu"
                                        aria-expanded="false">{translate key="Schedule"}</button>
                                    <div class="menu">
                                        <a class="menu-item" id="navViewSchedule"
                                            href="view-schedule.php">{translate key='ViewSchedule'}</a>
                                        <a class="menu-item" id="navViewCalendar"
                                            href="view-calendar.php">{translate key='ViewCalendar'}</a>
                                    </div>
                                </li>
                            {/if}

                            {if isset($CanViewAdmin) && $CanViewAdmin}
                                <li class="nav-item" id="navConfigDropdown">
                                    <button class="nav-link" type="button" data-bs-toggle="menu" data-bs-placement="bottom-end"
                                        aria-expanded="false">
                                        <span class="visually-hidden">Configuration</span>
                                        <i class="bi bi-gear-fill"></i>
                                        {if isset($ShowNewVersion) && $ShowNewVersion}<span
                                                class="badge badge-new-version new-version"
                                            id="newVersionBadge">{translate key=NewVersion}</span>{/if}
                                    </button>
                                    <div class="menu">
                                        {if isset($EnableConfigurationPage) && $EnableConfigurationPage}
                                            <a class="menu-item" id="navManageConfiguration"
                                                href="{$Path}admin/manage_configuration.php">{translate key="ManageConfiguration"}</a>
                                        {/if}
                                        <a class="menu-item" id="navEmailTemplates"
                                            href="{$Path}admin/manage_email_templates.php">{translate key="ManageEmailTemplates"}</a>
                                        <a class="menu-item" id="navLookAndFeel"
                                            href="{$Path}admin/manage_theme.php">{translate key="LookAndFeel"}</a>
                                        <a class="menu-item" id="navImport"
                                            href="{$Path}admin/ics_import.php">{translate key="Import"}</a>
                                        <a class="menu-item" id="navServerSettings"
                                            href="{$Path}admin/server_settings.php">{translate key="ServerSettings"}</a>
                                        <a class="menu-item" id="navDataCleanup"
                                            href="{$Path}admin/data_cleanup.php">{translate key="DataCleanup"}</a>
                                        {if isset($ShowNewVersion) && $ShowNewVersion}
                                            <hr class="menu-divider">
                                            <a class="menu-item new-version" id="navNewVersion"
                                                href="https://github.com/LibreBooking/librebooking/releases">{translate key=WhatsNew}</a>
                                        {/if}
                                    </div>
                                </li>
                            {/if}

                            {if isset($LoggedIn) && $LoggedIn && count($AvailableLanguages) > 1}
                                <li class="nav-item" id="navLanguageDropdown">
                                    <button class="nav-link" type="button" data-bs-toggle="menu" data-bs-placement="bottom-end"
                                        aria-expanded="false" aria-label="{translate key=ChangeLanguage}"
                                        title="{translate key=ChangeLanguage}">
                                        <span class="visually-hidden">{translate key=ChangeLanguage}</span>
                                        <i class="bi bi-globe-americas" aria-hidden="true"></i>
                                    </button>
                                    <div class="menu" id="languageDropdownMenu"
                                        style="max-height: 70vh; overflow-y: auto; min-width: 14rem;">
                                        {foreach from=$AvailableLanguages item=lang}
                                            <a class="menu-item {if $CurrentLanguage == $lang->GetLanguageCode()}active{/if}"
                                                href="#" data-lang-code="{$lang->GetLanguageCode()}">
                                                {$lang->GetDisplayName()}
                                            </a>
                                        {/foreach}
                                    </div>
                                </li>
                            {/if}

                            <li class="nav-item" id="navHelpDropdown">
                                <button class="nav-link" type="button" data-bs-toggle="menu" data-bs-placement="bottom-end"
                                    aria-expanded="false">{translate key="Help"}</button>
                                <div class="menu">
                                    <a class="menu-item" id="navHelp"
                                        href="https://librebooking.readthedocs.io/en/latest/">{translate key=Help}</a>
                                    {if isset($CanViewAdmin) && $CanViewAdmin}
                                        <a class="menu-item" id="navHelpAdmin"
                                            href="https://librebooking.readthedocs.io/en/latest/ADMINISTRATION.html">{translate key=Administration}</a>
                                    {/if}
                                    <a class="menu-item" id="navAbout"
                                        href="{$Path}help.php?ht=about">{translate key=About}</a>
                                </div>
                            </li>

                            {if isset($LoggedIn) && $LoggedIn}
                                <li class="nav-item" id="navSignOut"><a class="nav-link"
                                        href="{$Path}logout.php">{translate key="SignOut"}</a></li>
                            {else}
                                <li class="nav-item" id="navLogIn"><a class="nav-link"
                                        href="{$Path}index.php">{translate key="LogIn"}</a></li>
                            {/if}
                        </ul>
                    </div>
                </dialog>
            </div>
        </nav>
    {/if}

<div id="main" class="container-fluid my-5" role="main">
