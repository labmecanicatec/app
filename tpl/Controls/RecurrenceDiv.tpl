<div id="{if isset($prefix)}{$prefix}{/if}repeatDiv" class="repeat-div">
	<div class="form-group">
		<div class="d-flex align-items-center mb-2">
			<label class="fw-bold"
				for="{if isset($prefix)}{$prefix}{/if}repeatOptions">{translate key="RepeatPrompt"}</label>
			<select id="{if isset($prefix)}{$prefix}{/if}repeatOptions" {formname key=repeat_options}
				class="form-control form-control-sm repeat-drop w-12">
				{foreach from=$RepeatOptions key=k item=v}
					<option value="{$k}">{translate key=$v['key']}</option>
				{/foreach}
			</select>
		</div>

		<div class="d-flex align-items-center flex-wrap mb-2">
			<div id="{if isset($prefix)}{$prefix}{/if}repeatEveryDiv"
				class="recur-toggle d-none days weeks months years d-flex align-items-center flex-wrap">
				<label class="fw-bold"
					for="{if isset($prefix)}{$prefix}{/if}repeatInterval">{translate key="RepeatEveryPrompt"}</label>
				<div class="input-group-sm d-flex align-items-center flex-wrap gap-1">
					<select id="{if isset($prefix)}{$prefix}{/if}repeatInterval" {formname key=repeat_every}
						class="form-control form-control-sm w-12">
						{html_options values=$RepeatEveryOptions output=$RepeatEveryOptions}
					</select>
					<span class="days">{translate key=$RepeatOptions['daily']['everyKey']}</span>
					<span class="weeks">{translate key=$RepeatOptions['weekly']['everyKey']}</span>
					<span class="months">{translate key=$RepeatOptions['monthly']['everyKey']}</span>
					<span class="years">{translate key=$RepeatOptions['yearly']['everyKey']}</span>
				</div>
			</div>

			<div id="{if isset($prefix)}{$prefix}{/if}repeatOnWeeklyDiv" class="recur-toggle weeks d-none ms-2">
				<div class="btn-group btn-group-sm" role="group">
					<label class="btn-check btn-outline theme-primary" for="{if isset($prefix)}{$prefix}{/if}repeatDay0">
						<input type="checkbox" id="{if isset($prefix)}{$prefix}{/if}repeatDay0" {formname key=repeat_sunday} />
						{translate key="DaySundayAbbr"}
					</label>

					<label class="btn-check btn-outline theme-primary" for="{if isset($prefix)}{$prefix}{/if}repeatDay1">
						<input type="checkbox" id="{if isset($prefix)}{$prefix}{/if}repeatDay1" {formname key=repeat_monday} />
						{translate key="DayMondayAbbr"}
					</label>

					<label class="btn-check btn-outline theme-primary" for="{if isset($prefix)}{$prefix}{/if}repeatDay2">
						<input type="checkbox" id="{if isset($prefix)}{$prefix}{/if}repeatDay2" {formname key=repeat_tuesday} />
						{translate key="DayTuesdayAbbr"}
					</label>

					<label class="btn-check btn-outline theme-primary" for="{if isset($prefix)}{$prefix}{/if}repeatDay3">
						<input type="checkbox" id="{if isset($prefix)}{$prefix}{/if}repeatDay3" {formname key=repeat_wednesday} />
						{translate key="DayWednesdayAbbr"}
					</label>

					<label class="btn-check btn-outline theme-primary" for="{if isset($prefix)}{$prefix}{/if}repeatDay4">
						<input type="checkbox" id="{if isset($prefix)}{$prefix}{/if}repeatDay4" {formname key=repeat_thursday} />
						{translate key="DayThursdayAbbr"}
					</label>

					<label class="btn-check btn-outline theme-primary" for="{if isset($prefix)}{$prefix}{/if}repeatDay5">
						<input type="checkbox" id="{if isset($prefix)}{$prefix}{/if}repeatDay5" {formname key=repeat_friday} />
						{translate key="DayFridayAbbr"}
					</label>

					<label class="btn-check btn-outline theme-primary" for="{if isset($prefix)}{$prefix}{/if}repeatDay6">
						<input type="checkbox" id="{if isset($prefix)}{$prefix}{/if}repeatDay6" {formname key=repeat_saturday} />
						{translate key="DaySaturdayAbbr"}
					</label>
				</div>
			</div>

			<div id="{if isset($prefix)}{$prefix}{/if}repeatOnMonthlyDiv" class="recur-toggle months d-none ms-2">
				<div class="btn-group btn-group-sm" role="group">
					<label class="btn-check btn-outline theme-primary" for="{if isset($prefix)}{$prefix}{/if}repeatMonthDay">
						<input type="radio" {formname key=REPEAT_MONTHLY_TYPE} value="{RepeatMonthlyType::DayOfMonth}" id="{if isset($prefix)}{$prefix}{/if}repeatMonthDay" checked />
						{translate key="repeatDayOfMonth"}
					</label>

					<label class="btn-check btn-outline theme-primary" for="{if isset($prefix)}{$prefix}{/if}repeatMonthWeek">
						<input type="radio" {formname key=REPEAT_MONTHLY_TYPE} value="{RepeatMonthlyType::DayOfWeek}" id="{if isset($prefix)}{$prefix}{/if}repeatMonthWeek" />
						{translate key="repeatDayOfWeek"}
					</label>
				</div>
			</div>
		</div>

		<div id="{if isset($prefix)}{$prefix}{/if}repeatUntilDiv" class="d-none recur-toggle d-flex align-items-center">
			<label class="fw-bold"
				for="{if isset($prefix)}{$prefix}{/if}EndRepeat">{translate key="RepeatUntilPrompt"} <i
					class="bi bi-asterisk fg-danger align-top text-small required-asterisk d-none"></i></label>
			<input type="text" id="{if isset($prefix)}{$prefix}{/if}EndRepeat" {formname key=end_repeat_date}
				class="form-control form-control-sm repeat-termination w-12" />
		</div>

		{assign var=idPrefix value=$prefix|default:''}
<div id="{$idPrefix}customDatesDiv" class="d-none specific-dates">
	<div class="d-flex align-items-center flex-wrap gap-2 mb-2">
		<label class="fw-bold mb-0" for="{$idPrefix}RepeatDate">{translate key=RepeatOn}</label>

		<div class="input-group w-auto">
			<input type="text" id="{$idPrefix}RepeatDate" class="form-control form-control-sm" />
			<button type="button" id="{$idPrefix}AddDate" class="btn-solid theme-primary btn-sm">
				{translate key=AddDate}
				<i class="bi bi-plus-square-fill ms-1" aria-hidden="true"></i>
			</button>
		</div>
	</div>

	<div class="repeat-date-list rounded border bg-body my-2 p-2"></div>
</div>

	</div>
</div>
