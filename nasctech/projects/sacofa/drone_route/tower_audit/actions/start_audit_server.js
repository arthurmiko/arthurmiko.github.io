var status = ctx.instance.getValueByField('status_of_route');
ctx.instance.save();
if ( status == 3 ) {
    var cond = {tower_audit_id: ctx.instance.getValueByField('id')};
    custom.getModelByAlias('flight_path').massUpdate({status: 2}, cond);
    actions.redirectToMsg(ctx.instance, 'Tower audit was successfully finished.', 0);
} else if ( ctx.instance.getValueByField('user_aborted') ) {
    actions.redirectToMsg(ctx.instance, 'Tower audit is stopped.', 0);
} else {
    actions.redirectToMsg(ctx.instance, 'An error occurred during the tower audit. \n Please send SL log to admin.', 1);
}
