<details class="dashboard accordion-item shadow mb-2 availabilityDashboard" name="availabilityDashboard">
    <summary class="accordion-header dashboardHeader">
        {translate key="ResourceAvailability"}
        <svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="m2 5 6 6 6-6" />
        </svg>
    </summary>

    <div id="ResourceAvailabilityContents" class="dashboardContents">
        <div class="accordion-body">

            {* Section settings *}
            {assign var=sections value=[
                [
                    'title' => 'Available',
                    'data' => $Available,
                    'dateField' => 'NextTime',
                    'label' => 'AvailableUntil',
                ],
                [
                    'title' => 'Unavailable',
                    'data' => $Unavailable,
                    'dateField' => 'ReservationEnds',
                    'label' => 'AvailableBeginningAt',
                ],
                [
                    'title' => 'UnavailableAllDay',
                    'data' => $UnavailableAllDay,
                    'dateField' => 'ReservationEnds',
                    'label' => 'AvailableAt',
                ]
            ]}

            {* Main loop *}
            {foreach from=$sections item=section}

                <div class="header fw-bold fs-lg mt-3">
                    {translate key=$section.title}
                </div>

                {assign var=hasData value=false}

                {foreach from=$Schedules item=s}
                    {assign var=availability value=$section.data[$s->GetId()]}

                    {if is_array($availability) && $availability|count > 0}
                        {assign var=hasData value=true}
                        <div class="accordion accordion-gap mb-3">
                            <details class="accordion-item" name="schedule_{$s->GetId()}_Dashboard_{$section.title}">
                                <summary class="accordion-header">
                                    {$s->GetName()}
                                    <svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m2 5 6 6 6-6" />
                                    </svg>
                                </summary>
                                <div class="accordion-body">

                                    {foreach from=$availability item=i}
                                        {if $section.dateField == 'NextTime'}
                                            {assign var=date value=$i->NextTime()}
                                        {else}
                                            {assign var=date value=$i->ReservationEnds()}
                                        {/if}

                                        {* Determine date format for future schedule availability *}
                                        {assign var=dateFormat value='dashboard'}
                                        {if $section.dateField == 'ReservationEnds' && $i->IsFutureScheduleAvailability()}
                                            {assign var=dateFormat value='schedule_daily'}
                                        {/if}

                                        <div
                                            class="availabilityItem d-flex flex-wrap md:flex-nowrap align-items-center gap-2 p-2 m-2 border-bottom">

                                            {* Resource name *}
                                            <div class="resourceName-wrapper w-100 md:w-50">
                                                <span class="resourceName px-2 py-1 rounded-5"
                                                    {if $i->GetColor()}style="background-color:{$i->GetColor()};color:{$i->GetTextColor()};"
                                                    {/if}>

                                                    <i resource-id="{$i->ResourceId()}"
                                                        class="resourceNameSelector bi bi-info-circle-fill"></i>
                                                    <a resource-id="{$i->ResourceId()}" class="resourceNameSelector"
                                                        {if $i->GetColor()}style="color:{$i->GetTextColor()};" {/if}
                                                        href="{$Path}{Pages::SCHEDULE}?{QueryStringKeys::SCHEDULE_ID}={$s->GetId()}&{QueryStringKeys::RESOURCE_ID}={$i->ResourceId()}{if ($section.dateField == 'ReservationEnds') && $date}&{QueryStringKeys::START_DATE}={format_date date=$date timezone=$Timezone key=url}{/if}">
                                                        {$i->ResourceName()}
                                                    </a>
                                                </span>
                                            </div>

                                            {* Availability *}
                                            <div class="availability w-100 md:w-25 text-muted">
                                                {if $date != null}
                                                    {translate key=$section.label}
                                                    {format_date date=$date timezone=$Timezone key=$dateFormat}
                                                {else}
                                                    <span class="no-data fst-italic">
                                                        {translate key=AllNoUpcomingReservations args=30}
                                                    </span>
                                                {/if}
                                            </div>

                                            {* Button *}
                                            <div class="reserveButton w-100 md:w-25 d-grid">
                                                <button class="btn-solid theme-primary btn-sm"
                                                    onclick="window.location.href='{$Path}{Pages::RESERVATION}?{QueryStringKeys::RESOURCE_ID}={$i->ResourceId()}{if ($section.dateField == 'ReservationEnds') && $date}&{QueryStringKeys::START_DATE}={format_date date=$date timezone=$Timezone key=url_full}{/if}'">
                                                    {translate key=Reserve}
                                                </button>
                                            </div>

                                        </div>
                                    {/foreach}
                                </div>
                            </details>
                        </div>
                    {/if}
                {/foreach}

                {* No data *}
                {if !$hasData}
                    <div class="no-data text-center fst-italic fs-5">
                        {translate key=None}
                    </div>
                {/if}

            {/foreach}

        </div>
    </div>
</details>
