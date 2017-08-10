if (ctx.instance.isChanged('speed_m_s')) {
    var params = {'speed_m_s': ctx.instance.getValueByField('speed_m_s')};
    var cond = {'tower_audit_id': ctx.instance.getValueByField('id')};
    var result = custom.getModelByAlias('flight_path').massUpdate(params, cond);
    if (result.getErrors()) {
        utils.addLogRecord('Errors while update tower audit: ' + result.getErrors());
    }
    var dataPoints = JSON.stringify(gsTowerAudit.calcPoints(ctx.instance));
    ctx.instance.setValueToField('points_for_drone', dataPoints);
}

ctx.instance.save();