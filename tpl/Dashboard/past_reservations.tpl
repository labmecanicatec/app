<details class="dashboard upcomingReservationsDashboard accordion-item shadow mb-2" name="PastReservationsDashboard">
	<summary class="accordion-header dashboardHeader">
		{translate key="PastReservations"}<span class="badge bg-primary fg-contrast-primary ms-1">{$Total}</span>
		<svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"
			stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
			<path d="m2 5 6 6 6-6" />
		</svg>
	</summary>
	<div id="dashboardContents">
		<div class="accordion-body">
			{if $Total > 0}
				<div>
					<div class="timespan bg-warning border-bottom p-1 fw-medium fst-italic">
						{translate key="Today"} ({$TodaysReservations|default:array()|count})
					</div>
					{foreach from=$TodaysReservations item=reservation}
						{include file='Dashboard/dashboard_reservation.tpl' reservation=$reservation allowCheckin=$allowCheckin allowCheckout=$allowCheckout}
					{/foreach}

					<div class=" timespan bg-warning border-bottom p-1 fw-medium fst-italic">
						{translate key="Yesterday"} ({$YesterdayReservations|default:array()|count})
					</div>
					{foreach from=$YesterdayReservations item=reservation}
						{include file='Dashboard/dashboard_reservation.tpl' reservation=$reservation allowCheckin=$allowCheckin allowCheckout=$allowCheckout}
					{/foreach}

					<div class="timespan  bg-warning border-bottom p-1 fw-medium fst-italic">
						{translate key="EarlierThisWeek"} ({$ThisWeeksReservations|default:array()|count})
					</div>
					{foreach from=$ThisWeeksReservations item=reservation}
						{include file='Dashboard/dashboard_reservation.tpl' reservation=$reservation allowCheckin=$allowCheckin allowCheckout=$allowCheckout}
					{/foreach}

					<div class="timespan bg-warning border-bottom p-1 fw-medium fst-italic">
						{translate key="PreviousWeek"} ({$PreviousWeekReservations|default:array()|count})
					</div>
					{foreach from=$PreviousWeekReservations item=reservation}
						{include file='Dashboard/dashboard_reservation.tpl' reservation=$reservation allowCheckin=$allowCheckin allowCheckout=$allowCheckout}
					{/foreach}
				</div>
			{else}
				<p class="noresults text-center fst-italic fs-5">{translate key="NoPastReservations"}</p>
			{/if}
		</div>

		<form id="form-checkin" method="post">
			<input type="hidden" id="referenceNumber" {formname key=REFERENCE_NUMBER} />
			{csrf_token}
		</form>

		{*<form id="form-checkout" method="post" action="ajax/reservation_checkin.php?action={ReservationAction::Checkout}">*}
		{*<input type="hidden" id="referenceNumber" {formname key=REFERENCE_NUMBER} />*}
		{*{csrf_token}*}
		{*</form>*}
	</div>
</details>
