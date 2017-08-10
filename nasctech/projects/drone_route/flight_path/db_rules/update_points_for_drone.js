var towerAuditModel = custom.getModelByAlias('tower_audit'),
    towerAuditId = ctx.instance.getValueByField("tower_audit_id"),
    flightPathModel = custom.getModelByAlias('flight_path');

var flightPathQuery = flightPathModel.createQuery();
flightPathQuery.getFields(['id']);
flightPathQuery.addCondition('tower_audit_id', towerAuditId);
flightPathQuery.orderBy('altitude', 'asc');
flightPathQuery.setLimit(0);

var flightPathRecs = flightPathQuery.exec(),
    flightPathId;
for (var i in flightPathRecs) {
    flightPathId = flightPathRecs[i].getValueByField('id');
    flightPathModel.massUpdate({execution_order: Number(i) + 1}, {id: flightPathId});
}

var towerAuditRec = towerAuditModel.execQuery({where: {id: towerAuditId}})[0];
var data = gsTowerAudit.calcPoints(towerAuditRec);
towerAuditModel.massUpdate(
    {points_for_drone: JSON.stringify(data)},
    {id: towerAuditId});