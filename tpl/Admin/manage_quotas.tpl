{include file='globalheader.tpl' DataTable=true}
<div id="page-manage-quotas" class="admin-page">
	<h1 class="border-bottom mb-3">{translate key=ManageQuotas}</h1>

	<div class="accordion">
		<form id="addQuotaForm" method="post" role="form" class="form-inline">

			<details class="accordion-item shadow mb-2" id="add-quota-panel">
				<summary class="accordion-header">
				<i class="bi bi-plus-circle-fill theme-primary me-1"></i>{translate key="AddQuota"}
					<svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m2 5 6 6 6-6"/></svg>
				</summary>
					<div class="accordion-body" id="addQuota">
						{capture name="schedules" assign="schedules"}
							<select class='form-control form-control-sm w-auto' {formname key=SCHEDULE_ID}
								title='Select Schedule'>
								<option selected='selected' value=''>{translate key=AllSchedules}</option>
								{foreach from=$Schedules item=schedule}
									<option value='{$schedule->GetId()}'>{$schedule->GetName()|replace:',':' '}</option>
								{/foreach}
							</select>
						{/capture}

						{capture name="resources" assign="resources"}
							<select class='form-control form-control-sm w-auto' {formname key=RESOURCE_ID}
								title='Select Resource'>
								<option selected='selected' value=''>{translate key=AllResources}</option>
								{foreach from=$Resources item=resource}
									<option value='{$resource->GetResourceId()}'>{$resource->GetName()|replace:',':' '}</option>
								{/foreach}
							</select>
						{/capture}

						{capture name="groups" assign="groups"}
							<select class='form-control form-control-sm w-auto' {formname key=GROUP} title='Select Group'>
								<option selected='selected' value=''>{translate key=AllGroups}</option>
								{foreach from=$Groups item=group}
									<option value='{$group->Id}'>{$group->Name|replace:',':' '}</option>
								{/foreach}
							</select>
						{/capture}

						{capture name="amount" assign="amount"}
							<input type='number' step='any' class='form-control form-control-sm mid-number' min='0'
								max='10000' value='0' {formname key=LIMIT} title='Quota number' />
						{/capture}

						{capture name="unit" assign="unit"}
							<select class='form-control form-control-sm w-auto' {formname key=UNIT} title='Quota unit'>
								<option value='{QuotaUnit::Hours}'>{translate key=hours}</option>
								<option value='{QuotaUnit::Reservations}'>{translate key=reservations}</option>
							</select>
						{/capture}

						{capture name="duration" assign="duration"}
							<select class='form-control form-control-sm w-auto' {formname key=DURATION}
								title='Quota frequency'>
								<option value='{QuotaDuration::Day}'>{translate key=day}</option>
								<option value='{QuotaDuration::Week}'>{translate key=week}</option>
								<option value='{QuotaDuration::Month}'>{translate key=month}</option>
								<option value='{QuotaDuration::Year}'>{translate key=year}</option>
							</select>
						{/capture}

						{capture name="enforceHours" assign="enforceHours"}
							<div class='form-field form-field-inline ms-2'>
								<input class='check theme-primary' type='checkbox' id='enforce-all-day' checked
									value='1' {formname key=ENFORCE_ALL_DAY} />
								<label for='enforce-all-day'>{translate key=AllDay}</label>
							</div>
							<div id='enforce-hours-times' class='collapse collapse-horizontal'>
								<div class='form-group form-group-sm d-flex align-items-center'>
									<span class='me-1'>{translate key=Between}</span>
									<label for='enforce-time-start'
										class='visually-hidden'>{translate key=StartTime}</label>
									<label for='enforce-time-end' class='visually-hidden'>{translate key=EndTime}</label>
									<select {formname key=BEGIN_TIME} id='enforce-time-start'
										class='form-control form-control-sm w-auto timepicker' data-format='{$TimeFormat}'
										data-step='30' data-default='{Date::Now()->format('H:00')}'>
									</select>
									<div class='mx-1'>-</div>
									<select {formname key=END_TIME} id='enforce-time-end'
										class='form-control form-control-sm w-auto timepicker' data-format='{$TimeFormat}'
										data-step='30' data-default='{Date::Now()->AddHours(1)->format('H:00')}'>
									</select>
								</div>
							</div>
						{/capture}

						{capture name="enforceDays" assign="enforceDays"}
							<div class='form-field form-field-inline ms-2'>
								<input class='check theme-primary' type='checkbox' id='enforce-every-day' checked
									value='1' {formname key=ENFORCE_EVERY_DAY} />
								<label for='enforce-every-day'>{translate key=Everyday}</label>
							</div>
							<div class='enforce-days-inner'>
    <div id='enforce-days' class='collapse collapse-horizontal'>
            <label class='btn-check btn-outline theme-primary btn-sm'>
                <input type='checkbox' id='enforce-sun' value='0' {formname key=DAY multi=true} />
                {translate key="DaySundayAbbr"}
            </label>
            <label class='btn-check btn-outline theme-primary btn-sm'>
                <input type='checkbox' id='enforce-mon' value='1' {formname key=DAY multi=true} />
                {translate key="DayMondayAbbr"}
            </label>
            <label class='btn-check btn-outline theme-primary btn-sm'>
                <input type='checkbox' id='enforce-tue' value='2' {formname key=DAY multi=true} />
                {translate key="DayTuesdayAbbr"}
            </label>
            <label class='btn-check btn-outline theme-primary btn-sm'>
                <input type='checkbox' id='enforce-wed' value='3' {formname key=DAY multi=true} />
                {translate key="DayWednesdayAbbr"}
            </label>
            <label class='btn-check btn-outline theme-primary btn-sm'>
                <input type='checkbox' id='enforce-thu' value='4' {formname key=DAY multi=true} />
                {translate key="DayThursdayAbbr"}
            </label>
            <label class='btn-check btn-outline theme-primary btn-sm'>
                <input type='checkbox' id='enforce-fri' value='5' {formname key=DAY multi=true} />
                {translate key="DayFridayAbbr"}
            </label>
            <label class='btn-check btn-outline theme-primary btn-sm'>
                <input type='checkbox' id='enforce-sat' value='6' {formname key=DAY multi=true} />
                {translate key="DaySaturdayAbbr"}
            </label>
    </div>
</div>
						{/capture}

						{capture name="scope" assign="scope"}
							<div class='form-group'>
								<label for="quoteScope"
									class='visually-hidden'>{translate key=IncludingCompletedReservations}</label>
								<select class='form-control form-control-sm' {formname key=QUOTA_SCOPE} id="quoteScope">
									<option value='{QuotaScope::IncludeCompleted}'>
										{translate key=IncludingCompletedReservations}
									</option>
									<option value='{QuotaScope::ExcludeCompleted}'>
										{translate key=NotCountingCompletedReservations}
									</option>
								</select>
							</div>
						{/capture}

						<div class="add-quota-line d-flex align-items-center flex-wrap gap-1 mb-2">
							{translate key=QuotaConfiguration args="$schedules,$resources,$groups,$amount,$unit,$duration"}
							{$scope}</div>
						<div class="add-quota-line d-flex align-items-center flex-wrap gap-1 mb-2"   style="min-height: 45px;">
							{translate key=QuotaEnforcement args="$enforceHours,$enforceDays"}</div>

						<div class="fw-semibold fst-italic">{translate key=QuotaReminder}</div>

						<div class="accordion-footer border-top pt-3">
							{add_button}
							{reset_button}
							{indicator}
						</div>
					</div>
			</details>
		</form>

		<details class="accordion-item shadow" id="list-quotas-panel">
			<summary class="accordion-header">
			{translate key="AllQuotas"}
				<svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m2 5 6 6 6-6"/></svg>
			</summary>
				<div class="accordion-body no-padding" id="quotaList">
					{assign var=tableId value=blackoutTable}
					<table class="table table-striped table-hover border-top w-100" id="{$tableId}">
						<thead>
							<tr>
								<th>{translate key=ManageQuotas}</th>
							</tr>
						</thead>
						{foreach from=$Quotas item=quota}
							{capture name="scheduleName" assign="scheduleName"}
								<span class='fw-bold'>{if $quota->ScheduleName ne ""}
										{$quota->ScheduleName|replace:',':' '}
									{else}
										{translate key="AllSchedules"}
									{/if}
								</span>
							{/capture}
							{capture name="resourceName" assign="resourceName"}
								<span class='fw-bold'>{if $quota->ResourceName ne ""}
										{$quota->ResourceName|replace:',':' '}
									{else}
										{translate key="AllResources"}
									{/if}
								</span>
							{/capture}
							{capture name="groupName" assign="groupName"}
								<span class='fw-bold'>
									{if $quota->GroupName ne ""}
										{$quota->GroupName|replace:',':' '}
									{else}
										{translate key="AllGroups"}
									{/if}
								</span>
							{/capture}
							{capture name="amount" assign="amount"}
								<span class='fw-bold'>{$quota->Limit}</span>
							{/capture}
							{capture name="unit" assign="unit"}
								<span class='fw-bold'>{translate key=$quota->Unit}</span>
							{/capture}
							{capture name="duration" assign="duration"}
								<span class='fw-bold'>{translate key=$quota->Duration}</span>
							{/capture}
							{capture name="enforceHours" assign="enforceHours"}
								<span class='fw-bold'>
									{if $quota->AllDay}
										{translate key=AllDay}
									{else}
										{translate key=Between} {formatdate date=$quota->EnforcedStartTime key=period_time} -
										{formatdate date=$quota->EnforcedEndTime key=period_time}
									{/if}
								</span>
							{/capture}
							{capture name="enforceDays" assign="enforceDays"}
								<span class='fw-bold'>
									{if $quota->Everyday}
										{translate key=Everyday}
									{else}
										{foreach from=$quota->EnforcedDays item=day}
											{translate key=$DayNames[$day]}
										{/foreach}
									{/if}
								</span>
							{/capture}
							{capture name="scope" assign="scope"}
								{if $quota->Scope == QuotaScope::IncludeCompleted}
									{translate key=IncludingCompletedReservations}
								{else}
									{translate key=NotCountingCompletedReservations}
								{/if}
							{/capture}
							<tr>
								<td class="quotaItem clearfix">
									<div class="float-start">
										{translate key=QuotaConfiguration args="$scheduleName,$resourceName,$groupName,$amount,$unit,$duration"}
										<span class="fw-bold">{$scope}</span>.
										{translate key=QuotaEnforcement args="$enforceHours,$enforceDays"}
									</div>
									<a href="#" quotaId="{$quota->Id}" class="delete float-end"
										aria-label="{translate key=Delete}">
										<span class="bi bi-trash3-fill fg-danger icon remove"
											aria-hidden="true"></span></a>
								</td>
							</tr>
						{foreachelse}
							{translate key=None}
						{/foreach}
					</table>
			</div>
		</details>
	</div>


	<dialog  class="dialog" id="deleteDialog" aria-labelledby="deleteModalLabel">
				<div class="dialog-header">
					<h2 class="dialog-title" id="deleteModalLabel">{translate key=Delete}</h2>
					    <button type="button" class="btn-close" data-bs-dismiss="dialog" aria-label="{translate key=Close}"></button>
				</div>
				<div class="dialog-body">
					<div class="alert theme-warning">
						{translate key=DeleteWarning}
					</div>
				</div>
				<div class="dialog-footer">
					<form id="deleteQuotaForm" method="post">
						{cancel_button}
						{delete_button}
						{indicator}
					</form>
		</div>
	</dialog >

	{csrf_token}
	{include file="javascript-includes.tpl" DataTable=true}
	{datatable tableId=$tableId}
	{jsfile src="ajax-helpers.js"}
	{jsfile src="date-helper.js"}
	{jsfile src="admin/quota.js"}

	<script type="text/javascript">
		$(document).ready(function() {

			var actions = {
				addQuota: '{ManageQuotasActions::AddQuota}',
				deleteQuota: '{ManageQuotasActions::DeleteQuota}'
			};

			var quotaOptions = {
				submitUrl: '{$smarty.server.SCRIPT_NAME}',
				saveRedirect: '{$smarty.server.SCRIPT_NAME}',
				actions: actions
			};

			document.querySelectorAll('.timepicker').forEach(el => {
				dateHelper.initTimePicker(el);
			});

			var quotaManagement = new QuotaManagement(quotaOptions);
			quotaManagement.init();

		});
	</script>
</div>
{include file='globalfooter.tpl'}
