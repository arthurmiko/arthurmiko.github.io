var towerAuditRec = custom.getModelByAlias('tower_audit').execQuery({where:{id: ctx.instance.getValueByField('tower_audit')}})[0],
    statusCl = ctx.instance.getValueByField('status'),
    statusRoute = ctx.instance.getValueByField('status_of_route');
ctx.instance.save();

if ( statusCl == 2 && statusRoute == 1 ) {
    updateTowerAudit(3, false); // Completed
    var cond = {tower_audit_id: towerAuditRec.getValueByField('id')};
    custom.getModelByAlias('flight_path').massUpdate({status: 2}, cond);
    actions.redirectToMsg(towerAuditRec, 'Route complete!', 0);
} else if ( statusCl == 2 && statusRoute != 1 ) {
    updateTowerAudit(1, true); // Planned
    actions.redirectToMsg(ctx.instance, 'Tower Audit was stopped. \nCL submitted successfully', 1);
} else {
    updateTowerAudit(2, false); // Postponed
    var message = gsTowerAudit.submitMsg(ctx.instance);
    actions.redirectToMsg(ctx.instance, 'Tower audit is not possible because of ' + message.join(', '), 1);
}

function updateTowerAudit(status, ready) {
    towerAuditRec.setValueToField('status_of_route', status);
    towerAuditRec.setValueToField('ready_to_start', ready);
    towerAuditRec.save();
}