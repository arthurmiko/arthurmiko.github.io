var eqptModel = custom.getModelByAlias('tower_eqpt'),
    towersRecs = eqptModel.execQuery({where: {'equipment_type': 'Tower'}}),
    flParamsRecs = custom.getModelByAlias('flight_path_params').find(),
    towerId, towerType, flParams = {}, flType, flId;

for (var i in flParamsRecs) {
    flType = flParamsRecs[i].getValueByField('tower_type');
    flParams[flType] = flParamsRecs[i].getValueByField('id');
}

for (var i in towersRecs) {
    towerId = towersRecs[i].getValueByField('id');
    towerType = towersRecs[i].getValueByField('tower_type');
    towerType = (flParams[towerType] !== undefined) ? towerType : 'Monopole';
    eqptModel.massUpdate({flight_path_params: flParams[towerType]}, {id: towerId});
}