{include file='globalheader.tpl'}

<div class="page-change-password">

	{if !$AllowPasswordChange}
		<div class="alert theme-danger shadow d-flex justify-content-center align-items-center col-12 sm:col-8 mx-auto">
			<i class="bi bi-exclamation-triangle-fill fs-xl"></i> {translate key=PasswordControlledExternallyError}
		</div>
	{else}
		<form id="password-reset-form" method="post" action="{$smarty.server.SCRIPT_NAME}">
			<div id="password-reset-box" class="card shadow col-12 sm:col-8 mx-auto">
				<div class="card-body">
					<h1 class="text-center border-bottom mb-2">{translate key="ChangePassword"}</h1>

					{if isset($ResetPasswordSuccess) && $ResetPasswordSuccess}
						<div class="success alert theme-success">
							<i class="bi bi-check-circle-fill"></i> {translate key=PasswordChangedSuccessfully}
							<button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
						</div>
					{/if}

					{validation_group class="alert theme-danger"}
					{validator id="currentpassword" key="InvalidPassword"}
					{validator id="passwordmatch" key="PwMustMatch"}
					{validator id="passwordcomplexity" key=""}
					{/validation_group}
					<div class="form-group mb-2">
						<label class="fw-bold" for="{FormKeys::CURRENT_PASSWORD}">{translate key="CurrentPassword"}</label>
						{textbox type="password" name="CURRENT_PASSWORD"}
					</div>

					<div class="form-group mb-2">
						<label class="fw-bold" for="{FormKeys::PASSWORD}">{translate key="NewPassword"}</label>
						{textbox type="password" name="PASSWORD"}
					</div>

					<div class="form-group mb-3">
						<label class="fw-bold"
							for="{FormKeys::PASSWORD_CONFIRM}">{translate key="PasswordConfirmation"}</label>
						{textbox type="password" name="PASSWORD_CONFIRM" value=""}

					</div>

					<div class="form-group d-grid">
						<button type="submit" name="{Actions::CHANGE_PASSWORD}" value="{translate key='ChangePassword'}"
							class="btn theme-primary btn-solid">{translate key='ChangePassword'}</button>
					</div>
				</div>
				{csrf_token}
			</div>
		</form>
		{setfocus key='CURRENT_PASSWORD'}
	{/if}

</div>
{include file="javascript-includes.tpl"}
{include file='globalfooter.tpl'}
