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
    <link rel="shortcut icon" href="{$Path}{$FaviconUrl}" />
    <link rel="icon" href="{$Path}{$FaviconUrl}" />
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
        <script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-1a/pXj49ZQ1aHEmrJ+gMw1otqoVsYwlEnlD8mIfY2TV03r20Y0CN7uqx1tQogjPL" crossorigin="anonymous">
        </script>
        <script type="module">
            import *
            as bootstrap from 'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js';
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
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe" crossorigin="anonymous">
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

    {if isset($UseLocalJquery) && $UseLocalJquery}
        {cssfile src="assets/fonts/hind/v18/hind.css"}
    {else}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
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

<body data-bs-theme="{$cssTheme}">

    <noscript>
        <div class="alert alert-warning text-center m-2" role="alert">
            {translate key="JavascriptRequired"}
        </div>
    </noscript>

    {* Alert everyone if `script.url` is unset or missing the required `/Web` suffix, as either will cause issues. *}
    {if !isset($ScriptUrl) || $ScriptUrl eq ''}
        <div id="script-url-warning" class="alert alert-danger text-center m-2" role="alert">
            {translate key="ScriptUrlNotConfigured"}
        </div>
    {elseif !empty($ScriptUrlMissingWebSuffix)}
        <div id="script-url-web-suffix-warning" class="alert alert-danger text-center m-2" role="alert">
            {translate key="ScriptUrlMissingWebSuffix"}
        </div>
    {/if}

    {if !isset($HideNavBar) || $HideNavBar == false}
        <div class="d-flex align-items-center gap-2 m-2">
            <a class="navbar-brand" href="{$HomeUrl}">
                <img src="{$Path}{$LogoUrl}?{$Version}" alt="{$Title}" class="logo">
            </a>
            <div class="vr mx-2"></div>
            <div class="d-flex flex-column">
                {if $CompanyName neq ''}
                    <h5 class="mb-0"><a class="theme-primary" href="{$CompanyUrl}">{$CompanyName}</a></h5>
                {/if}
                <h5 class="mb-0"><a class="theme-primary" href="{$HomeUrl}">{$AppTitle}</a></h5>
            </div>
        </div>
        <nav class="navbar md:navbar-expand sticky-top">
            <div class="container-fluid">
                <button class="btn-icon navbar-toggler" type="button" data-bs-toggle="drawer"
                    data-bs-target="#librebooking-navigation" aria-controls="navbarDrawer" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon" aria-hidden="true"></span>
                </button>

                <dialog class="drawer drawer-end md:d-flex md:flex-grow-1" tabindex="-1" id="librebooking-navigation">
                    <div class="d-flex flex-column md:flex-row justify-content-between w-100">
                        <ul class="navbar-nav d-flex align-items-start mb-2 e:auto">
                            {if isset($LoggedIn) && $LoggedIn}
                                <li class="nav-item" id="navDashboard"><a class="nav-link link-primary"
                                        href="{$Path}{Pages::DASHBOARD}">{translate key="Dashboard"}</a></li>

                                <li class="nav-item" id="navMyAccountDropdown">
                                    <a href="#" class="nav-link link-primary" role="button"
                                        data-bs-toggle="menu">{translate key="MyAccount"}</a>
                                    <ul class="menu">
                                        <li id="navProfile"><a class="menu-item"
                                                href="{$Path}{Pages::PROFILE}">{translate key="Profile"}</a></li>
                                        <li id="navPassword"><a class="menu-item"
                                                href="{$Path}{Pages::PASSWORD}">{translate key="ChangePassword"}</a></li>
                                        <li id="navNotification"><a class="menu-item"
                                                href="{$Path}{Pages::NOTIFICATION_PREFERENCES}">{translate key="NotificationPreferences"}</a>
                                        </li>
                                        {if isset($ShowParticipation) && $ShowParticipation}
                                            <li id="navInvitations"><a class="menu-item"
                                                    href="{$Path}{Pages::PARTICIPATION}">{translate key="OpenInvitations"}</a></li>
                                        {/if}
                                        {if isset($CreditsEnabled) && $CreditsEnabled}
                                            <li id="navUserCredits"><a class="menu-item"
                                                    href="{$Path}{Pages::CREDITS}">{translate key="Credits"}</a></li>
                                        {/if}
                                    </ul>
                                </li>

                                <li class="nav-item" id="navScheduleDropdown">
                                    <a href="#" class="nav-link link-primary" role="button"
                                        data-bs-toggle="menu">{translate key="Schedule"}</a>
                                    <ul class="menu">
                                        <li id="navBookings"><a class="menu-item"
                                                href="{$Path}{Pages::SCHEDULE}">{translate key="Bookings"}</a></li>
                                        <li>
                                            <hr class="menu-divider">
                                        </li>
                                        <li id="navMyCalendar"><a class="menu-item"
                                                href="{$Path}{Pages::MY_CALENDAR}">{translate key="MyCalendar"}</a></li>
                                        <li id="navResourceCalendar"><a class="menu-item"
                                                href="{$Path}{Pages::CALENDAR}">{translate key="ResourceCalendar"}</a></li>
                                        <li>
                                            <hr class="menu-divider">
                                        </li>
                                        <li id="navFindATime"><a class="menu-item"
                                                href="{$Path}{Pages::OPENINGS}">{translate key="FindATime"}</a></li>
                                        <li id="navSearchReservations"><a class="menu-item"
                                                href="{$Path}{Pages::SEARCH_RESERVATIONS}">{translate key="SearchReservations"}</a>
                                        </li>
                                    </ul>
                                </li>

                                <li class="nav-item" id="navCheckDropdown">
                                    <a href="#" class="nav-link link-primary" role="button"
                                        data-bs-toggle="menu">{translate key="Check"}</a>
                                    <ul class="menu">
                                        <li id="CheckResources"><a class="menu-item"
                                                href="{$Path}view_resources.php">{translate key=Resources}</a></li>
                                        <li id="CheckSchedules"><a class="menu-item"
                                                href="{$Path}view_schedules.php">{translate key=Schedules}</a></li>
                                    </ul>
                                </li>

                                {if isset($CanViewAdmin) && $CanViewAdmin}
                                    <li class="nav-item" id="navApplicationManagementDropdown">
                                        <a href="#" class="nav-link link-primary" role="button"
                                            data-bs-toggle="menu">{translate key="ApplicationManagement"}</a>
                                        <ul class="menu">
                                            <li id="navManageReservations"><a class="menu-item"
                                                    href="{$Path}admin/manage_reservations.php">{translate key="ManageReservations"}</a>
                                            </li>
                                            <li id="navManageBlackouts"><a class="menu-item"
                                                    href="{$Path}admin/manage_blackouts.php">{translate key="ManageBlackouts"}</a>
                                            </li>
                                            <li id="navManageQuotas"><a class="menu-item"
                                                    href="{$Path}admin/manage_quotas.php">{translate key="ManageQuotas"}</a></li>
                                            <li>
                                                <hr class="menu-divider">
                                            </li>
                                            <li id="navManageSchedules"><a class="menu-item"
                                                    href="{$Path}admin/manage_schedules.php">{translate key="ManageSchedules"}</a>
                                            </li>
                                            <li id="navManageResources"><a class="menu-item"
                                                    href="{$Path}admin/manage_resources.php">{translate key="ManageResources"}</a>
                                            </li>
                                            <li id="navManageAccessories"><a class="menu-item"
                                                    href="{$Path}admin/manage_accessories.php">{translate key="ManageAccessories"}</a>
                                            </li>
                                            <li>
                                                <hr class="menu-divider">
                                            </li>
                                            <li id="navManageUsers"><a class="menu-item"
                                                    href="{$Path}admin/manage_users.php">{translate key="ManageUsers"}</a></li>
                                            <li id="navManageGroups"><a class="menu-item"
                                                    href="{$Path}admin/manage_groups.php">{translate key="ManageGroups"}</a></li>
                                            <li id="navManageAnnouncements"><a class="menu-item"
                                                    href="{$Path}admin/manage_announcements.php">{translate key="ManageAnnouncements"}</a>
                                            </li>
                                            <li>
                                                <hr class="menu-divider">
                                            </li>
                                            {if isset($PaymentsEnabled) && $PaymentsEnabled}
                                                <li id="navManagePayments"><a class="menu-item"
                                                        href="{$Path}admin/manage_payments.php">{translate key="ManagePayments"}</a>
                                                </li>
                                            {/if}
                                            <li id="navManageAttributes"><a class="menu-item"
                                                    href="{$Path}admin/manage_attributes.php">{translate key="CustomAttributes"}</a>
                                            </li>
                                        </ul>
                                    </li>
                                {/if}

                                {if isset($CanViewResponsibilities) && $CanViewResponsibilities}
                                    <li class="nav-item" id="navResponsibilitiesDropdown">
                                        <a href="#" class="nav-link link-primary" role="button"
                                            data-bs-toggle="menu">{translate key="Responsibilities"}</a>
                                        <ul class="menu">
                                            {if isset($CanViewGroupAdmin) && $CanViewGroupAdmin}
                                                <li id="navResponsibilitiesGAUsers"><a class="menu-item"
                                                        href="{$Path}admin/manage_group_users.php">{translate key="ManageUsers"}</a>
                                                </li>
                                                <li id="navResponsibilitiesGAReservations"><a class="menu-item"
                                                        href="{$Path}admin/manage_group_reservations.php">{translate key="GroupReservations"}</a>
                                                </li>
                                                <li id="navResponsibilitiesGAGroups"><a class="menu-item"
                                                        href="{$Path}admin/manage_admin_groups.php">{translate key="ManageGroups"}</a>
                                                </li>
                                            {/if}
                                            {if (isset($CanViewResourceAdmin) && $CanViewResourceAdmin) || (isset($CanViewScheduleAdmin) && $CanViewScheduleAdmin)}
                                                <li id="navResponsibilitiesRAResources"><a class="menu-item"
                                                        href="{$Path}admin/manage_admin_resources.php">{translate key="ManageResources"}</a>
                                                </li>
                                                <li id="navResponsibilitiesRABlackouts"><a class="menu-item"
                                                        href="{$Path}admin/manage_blackouts.php">{translate key="ManageBlackouts"}</a>
                                                </li>
                                            {/if}
                                            {if isset($CanViewResourceAdmin) && $CanViewResourceAdmin}
                                                <li id="navResponsibilitiesRAReservations"><a class="menu-item"
                                                        href="{$Path}admin/manage_resource_reservations.php">{translate key="ResourceReservations"}</a>
                                                </li>
                                            {/if}
                                            {if isset($CanViewScheduleAdmin) && $CanViewScheduleAdmin}
                                                <li id="navResponsibilitiesSASchedules"><a class="menu-item"
                                                        href="{$Path}admin/manage_admin_schedules.php">{translate key="ManageSchedules"}</a>
                                                </li>
                                                <li id="navResponsibilitiesSAReservations"><a class="menu-item"
                                                        href="{$Path}admin/manage_schedule_reservations.php">{translate key="ScheduleReservations"}</a>
                                                </li>
                                            {/if}
                                            <li id="navResponsibilitiesAnnouncements"><a class="menu-item"
                                                    href="{$Path}admin/manage_announcements.php">{translate key="ManageAnnouncements"}</a>
                                            </li>
                                        </ul>
                                    </li>
                                {/if}

                                {if isset($CanViewReports) && $CanViewReports}
                                    <li class="nav-item" id="navReportsDropdown">
                                        <a href="#" class="nav-link link-primary" role="button"
                                            data-bs-toggle="menu">{translate key="Reports"}</a>
                                        <ul class="menu">
                                            <li id="navGenerateReport"><a class="menu-item"
                                                    href="{$Path}reports/{Pages::REPORTS_GENERATE}">{translate key=GenerateReport}</a>
                                            </li>
                                            <li id="navSavedReports"><a class="menu-item"
                                                    href="{$Path}reports/{Pages::REPORTS_SAVED}">{translate key=MySavedReports}</a>
                                            </li>
                                            <li id="navCommonReports"><a class="menu-item"
                                                    href="{$Path}reports/{Pages::REPORTS_COMMON}">{translate key=CommonReports}</a>
                                            </li>
                                        </ul>
                                    </li>
                                {/if}
                            {/if}
                        </ul>

                        <ul class="navbar-nav d-flex align-items-end">
                            {if isset($ShowScheduleLink) && $ShowScheduleLink}
                                <li class="nav-item" id="navPublicScheduleDropdown">
                                    <a href="#" class="nav-link link-primary" role="button"
                                        data-bs-toggle="menu">{translate key="Schedule"}</a>
                                    <ul class="menu">
                                        <li id="navViewSchedule"><a class="menu-item"
                                                href="view-schedule.php">{translate key='ViewSchedule'}</a></li>
                                        <li id="navViewCalendar"><a class="menu-item"
                                                href="view-calendar.php">{translate key='ViewCalendar'}</a></li>
                                    </ul>
                                </li>
                            {/if}

                            {if isset($CanViewAdmin) && $CanViewAdmin}
                                <li class="nav-item" id="navConfigDropdown">
                                    <a href="#" class="nav-link link-primary" role="button" data-bs-toggle="menu"
                                        data-bs-placement="bottom-end">
                                        <span class="visually-hidden">Configuration</span>
                                        <i class="bi bi-gear-fill"></i>
                                        {if isset($ShowNewVersion) && $ShowNewVersion}<span
                                                class="badge badge-new-version new-version"
                                            id="newVersionBadge">{translate key=NewVersion}</span>{/if}
                                    </a>
                                    <ul class="menu">
                                        {if isset($EnableConfigurationPage) && $EnableConfigurationPage}
                                            <li id="navManageConfiguration"><a class="menu-item"
                                                    href="{$Path}admin/manage_configuration.php">{translate key="ManageConfiguration"}</a>
                                            </li>
                                        {/if}
                                        <li id="navEmailTemplates"><a class="menu-item"
                                                href="{$Path}admin/manage_email_templates.php">{translate key="ManageEmailTemplates"}</a>
                                        </li>
                                        <li id="navLookAndFeel"><a class="menu-item"
                                                href="{$Path}admin/manage_theme.php">{translate key="LookAndFeel"}</a></li>
                                        <li id="navImport"><a class="menu-item"
                                                href="{$Path}admin/ics_import.php">{translate key="Import"}</a></li>
                                        <li id="navServerSettings"><a class="menu-item"
                                                href="{$Path}admin/server_settings.php">{translate key="ServerSettings"}</a>
                                        </li>
                                        <li id="navDataCleanup"><a class="menu-item"
                                                href="{$Path}admin/data_cleanup.php">{translate key="DataCleanup"}</a></li>
                                        {if isset($ShowNewVersion) && $ShowNewVersion}
                                            <li>
                                                <hr class="menu-divider">
                                            </li>
                                            <li id="navNewVersion" class="new-version"><a class="menu-item"
                                                    href="https://github.com/LibreBooking/librebooking/releases">{translate key=WhatsNew}</a>
                                            </li>
                                        {/if}
                                    </ul>
                                </li>
                            {/if}

                            {if isset($LoggedIn) && $LoggedIn && count($AvailableLanguages) > 1}
                                <li class="nav-item" id="navLanguageDropdown">
                                    <a href="#" class="nav-link link-primary" role="button" data-bs-toggle="menu"
                                        data-bs-placement="bottom-end" aria-label="{translate key=ChangeLanguage}"
                                        title="{translate key=ChangeLanguage}">
                                        <span class="visually-hidden">{translate key=ChangeLanguage}</span>
                                        <i class="bi bi-globe-americas" aria-hidden="true"></i>
                                    </a>
                                    <ul class="menu" id="languageDropdownMenu"
                                        style="max-height: 70vh; overflow-y: auto; min-width: 14rem;">
                                        {foreach from=$AvailableLanguages item=lang}
                                            <li>
                                                <a class="menu-item {if $CurrentLanguage == $lang->GetLanguageCode()}active{/if}"
                                                    href="#" data-lang-code="{$lang->GetLanguageCode()}">
                                                    {$lang->GetDisplayName()}
                                                </a>
                                            </li>
                                        {/foreach}
                                    </ul>
                                </li>
                            {/if}

                            <li class="nav-item" id="navHelpDropdown">
                                <a href="#" class="nav-link link-primary" role="button" data-bs-toggle="menu"
                                    data-bs-placement="bottom-end">{translate key="Help"}</a>
                                <ul class="menu">
                                    <li id="navHelp"><a class="menu-item"
                                            href="https://librebooking.readthedocs.io/en/latest/">{translate key=Help}</a>
                                    </li>
                                    {if isset($CanViewAdmin) && $CanViewAdmin}
                                        <li id="navHelpAdmin"><a class="menu-item"
                                                href="https://librebooking.readthedocs.io/en/latest/ADMINISTRATION.html">{translate key=Administration}</a>
                                        </li>
                                    {/if}
                                    <li id="navAbout"><a class="menu-item"
                                            href="{$Path}help.php?ht=about">{translate key=About}</a></li>
                                </ul>
                            </li>

                            {if isset($LoggedIn) && $LoggedIn}
                                <li class="nav-item" id="navSignOut"><a class="nav-link link-primary"
                                        href="{$Path}logout.php">{translate key="SignOut"}</a></li>
                            {else}
                                <li class="nav-item" id="navLogIn"><a class="nav-link link-primary"
                                        href="{$Path}index.php">{translate key="LogIn"}</a></li>
                            {/if}
                        </ul>
                    </div>
                </dialog>
            </div>
        </nav>
    {/if}

<div id="main" class="container-fluid my-3" role="main">
