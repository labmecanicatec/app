{include file='globalheader.tpl' }

<div class="page-notification-preferences">
	{if !$EmailEnabled}
		<div class="alert theme-danger text-center">
			<i class="bi bi-exclamation-triangle-fill fs-5"></i> {translate key=EmailDisabled}
		</div>
	{else}
		<div id="notification-preferences-box" class="default-box card shadow col-12 sm:col-8 mx-auto">

			<form id="notification-preferences-form" method="post" action="{$smarty.server.SCRIPT_NAME}">
				<div class="card-body mx-3">
					<h1 class="text-center border-bottom mb-3">{translate key=NotificationPreferences}</h1>
					{if $PreferencesUpdated}
						<div class="success alert theme-success">
							<i class="bi bi-check-circle-fill"></i> {translate key=YourSettingsWereUpdated}
						</div>
					{/if}
					<div class="row gy-3">
						<div class="col-12 sm:col-6">
							<div class="form-field">
								<div class="switch theme-primary">
									<input type="checkbox" role="switch" switch id="{ReservationEvent::Created}"
										name="{ReservationEvent::Created}" {if $Created}checked{/if}>
								</div>
								<label
									for="{ReservationEvent::Created}">{translate key=ReservationCreatedPreference}</label>
							</div>
						</div>

						<div class="col-12 sm:col-6">
							<div class="form-field">
								<div class="switch theme-primary">
									<input type="checkbox" role="switch" switch id="{ReservationEvent::Updated}"
										name="{ReservationEvent::Updated}" {if $Updated}checked{/if}>
								</div>
								<label
									for="{ReservationEvent::Updated}">{translate key=ReservationUpdatedPreference}</label>
							</div>
						</div>

						<div class="col-12 sm:col-6">
							<div class="form-field">
								<div class="switch theme-primary">
									<input type="checkbox" role="switch" switch id="{ReservationEvent::Deleted}"
										name="{ReservationEvent::Deleted}" {if $Deleted}checked{/if}>
								</div>
								<label
									for="{ReservationEvent::Deleted}">{translate key=ReservationDeletedPreference}</label>
							</div>

						</div>

						<div class="col-12 sm:col-6">
							<div class="form-field">
								<div class="switch theme-primary">
									<input type="checkbox" role="switch" switch id="{ReservationEvent::Approved}"
										name="{ReservationEvent::Approved}" {if $Approved}checked{/if}>
								</div>
								<label
									for="{ReservationEvent::Approved}">{translate key=ReservationApprovalPreference}</label>
							</div>
						</div>

						<div class="col-12 sm:col-6">
							<div class="form-field">
								<div class="switch theme-primary">
									<input type="checkbox" role="switch" switch
										id="{ReservationEvent::ParticipationChanged}"
										name="{ReservationEvent::ParticipationChanged}"
										{if $ParticipantChanged}checked{/if}>
								</div>
								<label
									for="{ReservationEvent::ParticipationChanged}">{translate key=ReservationParticipationActivityPreference}</label>
							</div>
						</div>

						<div class="col-12 sm:col-6">
							<div class="form-field">
								<div class="switch theme-primary">
									<input type="checkbox" role="switch" switch id="{ReservationEvent::SeriesEnding}"
										name="{ReservationEvent::SeriesEnding}" {if $SeriesEnding}checked{/if}>
								</div>
								<label
									for="{ReservationEvent::SeriesEnding}">{translate key=ReservationSeriesEndingPreference}</label>
							</div>
						</div>

					</div>
					<div class="form-group d-grid mt-3">
						<button type="submit" class="theme-primary btn-solid update prompt" name="{Actions::SAVE}">
							{translate key='Update'}
						</button>
					</div>
				</div>
			</form>

		</div>
	{/if}

</div>

{include file="javascript-includes.tpl"}
{include file='globalfooter.tpl'}
