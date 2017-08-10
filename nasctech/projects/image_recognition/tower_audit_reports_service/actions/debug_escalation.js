var reportsService = custom.getModelByAlias('tower_audit_reports_service'),
    weekStart = dt.getWeekStart(-1),
    weekEnd = dt.getWeekEnd(-1),
    fields = ['tower_id', 'record_date', 'record_type'],
    values = [];

reportsService.massDelete({id: 'ISNOTNULL'});

var towerAuditQuery = custom.getModelByAlias('tower_audit').createQuery();
towerAuditQuery.getFields(['id', 'tower_id', 'updated_at']);
towerAuditQuery.setLimit(0);
var towerCondition = towerAuditQuery.addCondition({updated_at: {'>=': weekStart}});
towerCondition.addAndCondition({updated_at: {'<=': weekEnd}});
var towerAuditRecs = towerAuditQuery.exec();

var antennasQuery = custom.getModelByAlias('recognised_antennas').createQuery();
antennasQuery.getFields(['id', 'tower_id', 'updated_at']);
antennasQuery.setLimit(0);
var antennasCondition = antennasQuery.addCondition({status: 2, antenna_status: 1});
antennasCondition.addAndCondition({updated_at: {'>=': weekStart}});
antennasCondition.addAndCondition({updated_at: {'<=': weekEnd}});
var antennasRecs = antennasQuery.exec();

for (var i in towerAuditRecs) {
    values.push([
        towerAuditRecs[i].getValueByField('tower_id'),
        towerAuditRecs[i].getValueByField('updated_at'),
        'Audit'
    ]);
}
for (var i in antennasRecs) {
    values.push([
        antennasRecs[i].getValueByField('tower_id'),
        antennasRecs[i].getValueByField('updated_at'),
        'Antenna'
    ]);
}

initMassCreate(fields, values, reportsService, 'Error while creation of Tower Audit Reports Service: ');
ctx.instance.setValueToField( 'last_works', dt.now() );
ctx.instance.save();

function initMassCreate(fields, values, model, msg) {
    var data = {'fields': fields, 'values': values};
    var objResult = model.massCreate(data);
    if (objResult.getResult() === false) {
        utils.addLogRecord(msg + objResult.getErrors());
    }
}