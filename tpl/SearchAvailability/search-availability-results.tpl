{if $Openings|default:array()|count == 0}
    <div class="alert theme-warning d-flex justify-content-center align-items-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill fs-xl"></i>
        {translate key=NoAvailableMatchingTimes}
    </div>
{else}
    <div class="card shadow">
        <div class="card-body py-4">
            {assign var=groupedOpenings value=[]}
            {foreach from=$Openings item=opening}
                {$name = $opening->Resource()->Name}
                {if !isset($groupedOpenings[$name])}
                    {$groupedOpenings[$name] = []}
                {/if}
                {$groupedOpenings[$name][] = $opening}
            {/foreach}

            <ul class="list-group list-group-flush">
                {foreach from=$groupedOpenings key=resourceName item=group}
                    {$resource = $group[0]->Resource()}
                    <li class="list-group-item py-3">
                        <div class="mb-2">
                            <span class="resourceName chip theme-success" {if $resource->HasColor()}
                                style="background-color: {$resource->Color};color:{$resource->TextColor};" {/if}>
                                <i class="bi bi-info-circle-fill pe-1"></i>{$resourceName}
                            </span>
                        </div>

                        <div class="d-flex flex-wrap gap-2">
                            {foreach from=$group item=opening}
                                {assign var=key value=short_reservation_date}
                                {if $opening->SameDate()}
                                    {assign var=key value=period_time}
                                {/if}

                                <span class="chip theme-info opening" data-resourceid="{$resource->Id}"
                                    data-startdate="{format_date date=$opening->Start() key=system_datetime}"
                                    data-enddate="{format_date date=$opening->End() key=system_datetime}">
                                    {format_date date=$opening->Start() key=schedule_daily} -
                                    {format_date date=$opening->End() key=$key}
                                </span>
                            {/foreach}
                        </div>
                    </li>
                {/foreach}
            </ul>
        </div>
    </div>
{/if}
