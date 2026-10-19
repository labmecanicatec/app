{include file='globalheader.tpl' DataTable=true}

<div id="page-manage-reservation-colors" class="admin-page">

    <h1 class="border-bottom mb-3">{translate key=ReservationColors}</h1>
    <div class="card shadow mb-2">
        <div class="card-body">
            <form class="form-inline" role="form">
                <div class="d-flex align-items-center">
                    <label class="fw-bold" for="attributeOption">{translate key=Attribute}</label>
                    <select class="form-control form-control-sm w-auto mx-2" id="attributeOption">
                        {foreach from=$Attributes item=attribute}
                            <option value="{$attribute->Id()}">{$attribute->Label()}</option>
                        {/foreach}
                    </select>

                    <button type="button" class="btn-solid btn-sm theme-primary" id="addRuleButton">
                        <i class="bi bi-plus-lg"></i> {translate key='AddRule'}
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div class="card shadow">
        <div class="card-body">
            {assign var=tableId value=reservationColorTable}
            <table class="table table-striped table-hover border-top" id="{$tableId}">
                <thead>
                    <tr>
                        <th>{translate key=Attribute}</th>
                        <th>{translate key=RequiredValue}</th>
                        <th>{translate key=Color}</th>
                        <th class="action">{translate key='Delete'}</th>
                    </tr>
                </thead>
                <tbody>
                    {foreach from=$Rules item=rule}
                        <tr>
                            <td>{$rule->AttributeName}</td>
                            <td>{$rule->RequiredValue}</td>
                            <td style="background-color:{$rule->Color}">&nbsp;</td>
                            <td class="action">
                                <a href="#" class="update delete" ruleId="{$rule->Id}" aria-label="{translate key=Delete}">
                                    <span class="bi bi-trash3-fill icon fg-danger fs-md remove"></span>
                                </a>
                            </td>
                        </tr>
                    {/foreach}
                </tbody>
            </table>
        </div>
    </div>
</div>

<dialog class="dialog" id="addDialog" aria-labelledby="addDialogLabel">
        <form id="addForm" method="post" action="{$smarty.server.SCRIPT_NAME}?action=add" method="post">
                <div class="dialog-header">
                    <h2 class="dialog-title" id="addDialogLabel">{translate key=AddReservationColorRule}</h2>
                    <button type="button" class="btn-close" commandfor="addDialog" command="close" aria-label="{translate key=Close}"></button>
                </div>
                <div class="dialog-body">
    <p class="mb-5">{translate key=ReservationCustomRuleAdd}</p>

    <div class="d-flex flex-wrap align-items-end gap-5">
        <div id="attributeFillIn" class="flex-grow-1"></div>

        <div id="color" class="form-field">
            <input type="color" {formname key="RESERVATION_COLOR"}
                class="form-control form-control-color required" id="reservationColor" />
        </div>
    </div>
</div>
                <div class="dialog-footer">
                    {cancel_button}
                    {add_button}
                    {indicator}
                </div>
        </form>
</dialog>

<dialog class="dialog" id="deleteDialog" aria-labelledby="deleteDialogLabel">
        <form id="deleteForm" action="{$smarty.server.SCRIPT_NAME}?action=delete" method="post">
                <div class="dialog-header">
                    <h5 class="modal-title" id="deleteDialogLabel">{translate key=Delete}</h5>
                    <button type="button" class="btn-close" commandfor="deleteDialog" command="close" aria-label="{translate key=Close}"></button>
                </div>
                <div class="dialog-body">
                    <div class="alert theme-warning">
                        {translate key=DeleteWarning}
                    </div>
                    <input type="hidden" id="deleteRuleId" {formname key=RESERVATION_COLOR_RULE_ID} />
                </div>
                <div class="dialog-footer">
                    {cancel_button}
                    {delete_button}
                    {indicator}
                </div>
        </form>
</dialog>

{foreach from=$Attributes item=attribute}
    <div id="attribute{$attribute->Id()}" class="d-none">
        {control type="AttributeControl" attribute=$attribute searchmode=true}</div>
{/foreach}

{csrf_token}

</div>

{include file="javascript-includes.tpl" DataTable=true}
{datatable tableId=$tableId}
{jsfile src="ajax-helpers.js"}
{jsfile src="ajax-form-submit.js"}
{jsfile src="admin/reservation-colors.js"}

<script type="text/javascript">
    $('document').ready(function() {
        var mgmt = new ReservationColorManagement();
        mgmt.init();
    });
</script>

{include file='globalfooter.tpl'}
