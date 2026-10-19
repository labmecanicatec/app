{include file='globalheader.tpl'}
<div id="forgotbox" class="mx-auto md:col-6 col-12 mt-4">
	{if $Enabled}

		<div class="card shadow">
			<div class="card-body text-center">
				<form class="forgot" method="post" action="{$smarty.server.SCRIPT_NAME}">
					<div class="forgot_pwdHeader mt-2">
						<h1 class="border-bottom mb-2">{translate key='ForgotPassword'}</h1>
					</div>
					<div class="d-flex flex-column gap-3">
						<p class="mb-0">{translate key='YouWillBeEmailedANewPassword'}</p>

						{if $ShowResetEmailSent}
							<div class="alert theme-success" role="alert">
								<div>
									{translate key=ForgotPasswordEmailSent}<br />
									<a class="alert-link" href="{$Path}{Pages::LOGIN}">{translate key="LogIn"}</a>
								</div>
								<button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"
									aria-label="{translate key="Close"}"></button>
							</div>
						{/if}

						<div class="form-field">
							<label class="form-label fw-bold" for="resetEmail">{translate key='EmailAddress'}</label>
							{textbox name="EMAIL" id="resetEmail" class="form-control" type="email" required="required" tabindex="10"}
						</div>

						<div class="resetpassword d-grid">
							<button type="submit" class="theme-primary btn-solid" name="{Actions::RESET}"
								value="{Actions::RESET}">{translate key='ChangePassword'}</button>
						</div>
					</div>
				</form>
			</div>
		</div>

		{setfocus key='EMAIL'}
	{else}
		<div class="alert theme-danger shadow d-flex justify-content-center">Disabled</div>
	{/if}
</div>
{include file="javascript-includes.tpl"}
{include file='globalfooter.tpl'}
