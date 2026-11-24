{if $CanViewUser}
	<div class="user-details-popup">
		<div class="user-details-popup-heading fw-bold border-bottom pb-2 mb-2">
			{fullname first=$User->FirstName()|default:''|unescape:'html' last=$User->LastName()|default:''|unescape:'html' ignorePrivacy=true}
		</div>
		<div class="user-details-popup-body d-grid gap-1">
			{if $User->EmailAddress()}
				<div class="user-details-field fw-bold">
					<span class="label">{translate key=Email}</span>
					<a href="mailto:{$User->EmailAddress()|escape:'html':'UTF-8':false}" class="link-primary">{$User->EmailAddress()|escape:'html':'UTF-8':false}</a>
				</div>
			{/if}
			{if $User->GetAttribute(UserAttribute::Phone)}
				<div class="user-details-field fw-bold">
					<span class="label">{translate key=Phone}</span>
					<a href="tel:{$User->GetAttribute(UserAttribute::Phone)|escape:'html':'UTF-8':false}"
						class="link-primary">{$User->GetAttribute(UserAttribute::Phone)|escape:'html':'UTF-8':false}</a>
				</div>
			{/if}
			{if $User->GetAttribute(UserAttribute::Organization)}
				<div class="user-details-field fw-bold">
					<span class="label">{translate key=Organization}</span>
					{$User->GetAttribute(UserAttribute::Organization)|escape:'html':'UTF-8':false}
				</div>
			{/if}
			{if $User->GetAttribute(UserAttribute::Position)}
				<div class="user-details-field fw-bold">
					<span class="label">{translate key=Position}</span>
					{$User->GetAttribute(UserAttribute::Position)|escape:'html':'UTF-8':false}
				</div>
			{/if}
			<div class="user-details-attributes fw-bold">
				{foreach from=$Attributes item=attribute}
					<div class="customAttribute">
						<span class="label">{$attribute->Label()}</span>
						{$User->GetAttributeValue($attribute->Id())|escape:'html':'UTF-8':false}
					</div>
				{/foreach}
			</div>
		</div>
	</div>
{/if}
