var clModel = custom.getModelByAlias('tower_audit_cl'),
    newClRecord,
    oldClRecord = clModel.execQuery({where:{tower_audit: ctx.instance.getValueByField('id')}})[0],
    points = ctx.instance.getValueByField('points_for_drone'),
    aligned = ctx.instance.getValueByField('aligned'),
    latitude = ctx.instance.getValueByField('sys_position_lat'),
    longitude = ctx.instance.getValueByField('sys_position_long'),
    towerHeight = ctx.instance.getValueByField('tower_height');

if (!utils.isEmpty(oldClRecord)) {
    oldClRecord.setValueToField('points_for_drone', points);
    oldClRecord.setValueToField('aligned', aligned);
    oldClRecord.setValueToField('latitude', latitude);
    oldClRecord.setValueToField('longitude', longitude);
    oldClRecord.setValueToField('tower_height', towerHeight);
    oldClRecord.exSave({doNotCheckMandatoryFields: true});
    actions.redirectToMsg(oldClRecord, 'Please fill checklist', 0);
} else {
    newClRecord = clModel.build({
        tower_audit: ctx.instance.getValueByField('id'),
        points_for_drone: points,
        aligned: aligned,
        latitude: latitude,
        longitude: longitude,
        tower_height: towerHeight
    });
    newClRecord.exSave({doNotCheckMandatoryFields: true});
    actions.redirectToMsg(newClRecord, 'Please fill checklist', 0);
}