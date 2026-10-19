<details class="accordion-item shadow mb-2" name="announcementsDashboard">
	<summary class="accordion-header dashboardHeader">
		{translate key="Announcements"}
		<span class="badge theme-primary ms-1">{$Announcements|default:array()|count}</span>
		<svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"
			stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
			<path d="m2 5 6 6 6-6" />
		</svg>
	</summary>
	<div id="announcementsContents">
		<div class="accordion-body">
			<div class="announcementContent">
				{foreach from=$Announcements item=each}
					<div class="border-bottom py-2">{$each->Text()|sanitize_rich_text|url2link|nl2br}</div>
				{foreachelse}
					<p class="noresults text-center fst-italic fs-5">{translate key="NoAnnouncements"}</p>
				{/foreach}
				</ul>
			</div>
		</div>
	</div>
</details>
