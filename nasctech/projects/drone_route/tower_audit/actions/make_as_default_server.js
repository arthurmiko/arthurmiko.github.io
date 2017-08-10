var towerEqptModel = custom.getModelByAlias('tower_eqpt');
var params = {
    default_route: ctx.instance.getValueByField('id')
};
towerEqptModel.massUpdate(params, {id: ctx.instance.getValueByField('tower_id')});

ctx.instance.setValueToField('default_tower_audit', true);
ctx.instance.exSave({doNotExecuteActions: true});