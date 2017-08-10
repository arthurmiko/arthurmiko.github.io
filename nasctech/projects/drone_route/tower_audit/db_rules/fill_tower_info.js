if (ctx.instance.isChanged('tower_id')) {
    var towerRecord = custom.getModelByAlias('tower_eqpt').execQuery({where: {id: ctx.instance.getValueByField('tower_id')}})[0];
    
    ctx.instance.setValueToField('sys_position_lat', towerRecord.getValueByField('sys_position_lat'));
    ctx.instance.setValueToField('sys_position_long', towerRecord.getValueByField('sys_position_long'));
    ctx.instance.setValueToField('tower_type', towerRecord.getValueByField('tower_type'));
    ctx.instance.setValueToField('tower_name', towerRecord.getValueByField('name'));
    ctx.instance.setValueToField('aligned', towerRecord.getValueByField('aligned'));
    ctx.instance.setValueToField('default_tower_audit', towerRecord.getValueByField('default_route'));
    ctx.instance.setValueToField('tower_height', towerRecord.getValueByField('height'));
}