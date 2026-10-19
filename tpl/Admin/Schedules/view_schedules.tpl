{include file='globalheader.tpl' DataTable=true}

<div id="page-manage-schedules">

	<div class="border-bottom mb-3">
		<h1>{translate key=ManageSchedules}</h1>
	</div>

	<div class="card shadow" id="list-schedules-panel">
		<div class="card-body" id="scheduleList">
			<div class="accordion" id="scheduleAccordion">
				{assign var=tableIdFilter value=schedulesViewTable}
				<table class="table table-borderless w-100" id="{$tableIdFilter}">
					<thead class="d-none">
						<tr>
							<th>{translate key="AllSchedules"}</th>
						</tr>
					</thead>
					<tbody>
						{foreach from=$Schedules item=schedule}
							<tr>
								<td>
									{assign var=id value=$schedule->GetId()}
									{capture name=daysVisible}
										<span class='fw-bold'>{$schedule->GetDaysVisible()}</span>
									{/capture}
									{assign var=dayOfWeek value=$schedule->GetWeekdayStart()}
									{capture name=dayName}
										<span
											class='fw-bold'>{if $dayOfWeek == Schedule::Today}{$Today}{else}{$DayNames[$dayOfWeek]}{/if}</span>
									{/capture}
									<details  class="accordion-item">
										<summary  class="accordion-header">
											{$schedule->GetName()}
											<svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m2 5 6 6 6-6"/></svg>
										</summary >
											<div class="accordion-body">
												<div class="scheduleDetails">
													<div>
														<div>
															{translate key="LayoutDescription" args="{$smarty.capture.dayName},
															{$smarty.capture.daysVisible}"}
														</div>

														<div>{translate key='ScheduleAdministrator'}
															<span
																class="fw-bold">
																{assign var=adminGroupId value=$schedule->GetAdminGroupId()}
																{if $adminGroupId !== null && isset($GroupLookup[$adminGroupId])}
																	{$GroupLookup[$adminGroupId]->Name|escape:'html'}
																{else}
																	{translate key='None'}
																{/if}
															</span>
														</div>

														<div>
															{translate key=Available}
															<span class="propertyValue fw-bold">
																{if $schedule->HasAvailability()}
																	{formatdate date=$schedule->GetAvailabilityBegin() timezone=$timezone key=schedule_daily} -
																	{formatdate date=$schedule->GetAvailabilityEnd() timezone=$timezone key=schedule_daily}
																{else}
																	{translate key=AvailableAllYear}
																{/if}
															</span>
														</div>

														<div class="maximumConcurrentContainer">
															{if $schedule->EnforceConcurrentReservationMaximum()}
																{translate key=ScheduleConcurrentMaximum args=$schedule->GetTotalConcurrentReservations()}
															{else}
																{translate key=ScheduleConcurrentMaximumNone}
															{/if}
														</div>

														<div class="resourcesPerReservationContainer">
															{if $schedule->EnforceMaxResourcesPerReservation()}
																{translate key=ScheduleResourcesPerReservationMaximum args=$schedule->GetMaxResourcesPerReservation()}
															{else}
																{translate key=ScheduleResourcesPerReservationNone}
															{/if}
														</div>

														<div>
															{translate key=DefaultStyle}
															<span
																class="fw-bold">{$StyleNames[$schedule->GetDefaultStyle()->value]}</span>
														</div>

														{if $CreditsEnabled}
															<span>{translate key=PeakTimes}</span>
															<div class="fw-bold">
																{include file="Admin/Schedules/manage_peak_times.tpl" Layout=$Layouts[$id] Months=$Months DayNames=$DayNames}
															</div>
														{/if}

														<div>{translate key=Resources}
															<span class="fw-bold">
																{if array_key_exists($id, $Resources)}
																	{foreach from=$Resources[$id] item=r name=resources_loop}
																		{$r->GetName()|escape}{if !$smarty.foreach.resources_loop.last},
																		{/if}
																	{/foreach}
																{else}
																	{translate key=None}
																{/if}
															</span>
														</div>

														{if $schedule->GetIsCalendarSubscriptionAllowed()}
															<div>
																<span>{translate key=PublicId}</span>
																<span class="fw-bold">{$schedule->GetPublicId()}</span>
															</div>
														{/if}

													</div>

													<div class="layout mt-3">
														{function name="display_periods"}
															{foreach from=$Layouts[$id]->GetSlots($day) item=period name=layouts}
																{if $period->IsReservable() == $showReservable}
																	<span class="badge me-1 mb-1 {if $showReservable}bg-subtle-success fg-success{else}bg-subtle-danger fg-danger{/if}">
																		{$period->Start->Format("H:i")} - {$period->End->Format("H:i")}
																		{if $period->IsLabelled()}{$period->Label}{/if}
																	</span>
																{/if}
															{foreachelse}
																{translate key=None}
															{/foreach}
														{/function}

														<div>
															{translate key=Timezone} <span class="fw-bold">{$schedule->GetTimezone()}</span>
															<a class="theme-primary" data-bs-toggle="collapse" href="#collapseExample{$id}" role="button" aria-expanded="false" aria-controls="collapseExample">
																{translate key=ShowHide}
															</a>
														</div>

														<div class="allDailyLayouts d-flex flex-column gap-3 mt-2 collapse" id="collapseExample{$id}">
														{if $Layouts[$id]->UsesDailyLayouts()}
															{translate key=LayoutVariesByDay}
																{foreach from=DayOfWeek::Days() item=day}
																	<div class="d-flex flex-column sm:flex-row gap-1 sm:gap-3 pb-3 border-bottom">
																		<div class="fw-bold" style="min-width: 8rem;">{$DayNames[$day]}</div>

																		<div>
																			<div class="reservableSlots mb-2" id="reservableSlots_{$day}" ref="reservableEdit_{$day}">
																				<span class="fg-2 me-1">{translate key=ReservableTimeSlots}</span>
																				{display_periods showReservable=true day=$day}
																			</div>
																			<div class="blockedSlots" id="blockedSlots_{$day}" ref="blockedEdit_{$day}">
																				<span class="fg-2 me-1">{translate key=BlockedTimeSlots}</span>
																				{display_periods showReservable=false day=$day}
																			</div>
																		</div>
																	</div>
																{/foreach}
															<div class="mt-4 fw-bold">
																{translate key=ThisScheduleUsesAStandardLayout}
															</div>
														{elseif $Layouts[$id]->UsesCustomLayout()}
															<div class="mt-4 fw-bold">
																{translate key=ThisScheduleUsesACustomLayout}
															</div>
														{else}
															<div class="mb-2">
																<span class="fg-2">{translate key=ReservableTimeSlots}</span>
																<span class="reservableSlots" id="reservableSlots" ref="reservableEdit">
																	{display_periods showReservable=true day=null}
																</span>
															</div>
															<div class="mb-2">
																<span class="fg-2">{translate key=BlockedTimeSlots}</span>
																<span class="blockedSlots" id="blockedSlots" ref="blockedEdit">
																	{display_periods showReservable=false day=null}
																</span>
															</div>
															<div class="mt-4 fw-bold">
																{translate key=ThisScheduleUsesAStandardLayout}
															</div>
														{/if}
														</div>
													</div>
													<div class="actions">
														{if $schedule->GetIsDefault()}
															<span
																class="fst-italic fw-bold">{translate key=ThisIsTheDefaultSchedule}</span>
														{/if}
													</div>
												</div>
											</div>
									</details >
								</td>
							</tr>
						{/foreach}
					</tbody>
				</table>
			</div>
		</div>
	</div>


	{include file="javascript-includes.tpl" DataTable=true}
	{datatablefilter tableId=$tableIdFilter}
</div>

{include file='globalfooter.tpl'}
