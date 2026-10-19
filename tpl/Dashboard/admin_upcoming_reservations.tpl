<details class="upcomingReservationsDashboard accordion-item shadow mb-2" name="adminUpcomingReservationsDashboard">
    <summary class="accordion-header dashboardHeader">
        {translate key="AllUpcomingReservations"}<span class="badge bg-primary fg-contrast-primary ms-1">{$Total}</span>
        <svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="m2 5 6 6 6-6" />
        </svg>
    </summary>
    <div id="adminUpcomingReservationsDashboardContents">
        <div class="accordion-body">
            {if $Total > 0}
                <div>
                    <div class="timespan bg-warning border-bottom p-1 fw-medium fst-italic">
                        {translate key="Today"} ({$TodaysReservations|default:array()|count})
                    </div>
                    {foreach from=$TodaysReservations item=reservation}
                        {include file='Dashboard/dashboard_reservation.tpl' reservation=$reservation allowCheckin=$allowCheckin allowCheckout=$allowCheckout}
                    {/foreach}

                    <div class="timespan bg-warning border-bottom p-1 fw-medium fst-italic">
                        {translate key="Tomorrow"} ({$TomorrowsReservations|default:array()|count})
                    </div>
                    {foreach from=$TomorrowsReservations item=reservation}
                        {include file='Dashboard/dashboard_reservation.tpl' reservation=$reservation allowCheckin=$allowCheckin allowCheckout=$allowCheckout}
                    {/foreach}

                    <div class="timespan bg-warning border-bottom p-1 fw-medium fst-italic">
                        {translate key="LaterThisWeek"} ({$ThisWeeksReservations|default:array()|count})
                    </div>
                    {foreach from=$ThisWeeksReservations item=reservation}
                        {include file='Dashboard/dashboard_reservation.tpl' reservation=$reservation allowCheckin=$allowCheckin allowCheckout=$allowCheckout}
                    {/foreach}

                    <div class="timespan bg-warning border-bottom p-1 fw-medium fst-italic">
                        {translate key="NextWeek"} ({$NextWeeksReservations|default:array()|count})
                    </div>
                    {foreach from=$NextWeeksReservations item=reservation}
                        {include file='Dashboard/dashboard_reservation.tpl' reservation=$reservation allowCheckin=$allowCheckin allowCheckout=$allowCheckout}
                    {/foreach}
                </div>
            {else}
                <p class="noresults text-center fst-italic fs-5">{translate key="NoUpcomingReservations"}</p>
            {/if}
        </div>
    </div>
</details>
