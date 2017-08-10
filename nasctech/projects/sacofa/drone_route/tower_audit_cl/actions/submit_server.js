var towerAuditRec = custom.getModelByAlias('tower_audit').execQuery({where:{id: ctx.instance.getValueByField('tower_audit')}})[0],
    status = ctx.instance.getValueByField('status');
ctx.instance.save();

if (status == 2) {
    towerAuditRec.setValueToField('status_of_route', 1);
    towerAuditRec.setValueToField('ready_to_start', true);
    towerAuditRec.save();
    actions.redirectToMsg(towerAuditRec, 'Drone ready to start!', 0);
} else {
    towerAuditRec.setValueToField('status_of_route', 2);
    towerAuditRec.setValueToField('ready_to_start', false);
    towerAuditRec.save();
    var message = gsTowerAudit.submitMsg(ctx.instance);
    actions.redirectToMsg(ctx.instance, "Submit is not possible because of " + message.join(', '), 1);
}