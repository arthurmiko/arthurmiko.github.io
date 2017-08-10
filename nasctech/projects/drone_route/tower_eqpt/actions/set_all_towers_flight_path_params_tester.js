var eqptModel = custom.getModelByAlias('tower_eqpt'),
    towersRecs = eqptModel.execQuery({where: {'equipment_type': 'Tower'}}),
    flParamsRecs = custom.getModelByAlias('flight_path_params').find(),
    towerId, towerType, flParams = {}, flType, flId;

for (var i in flParamsRecs) {
    flType = flParamsRecs[i].getValueByField('tower_type');
    flParams[flType] = flParamsRecs[i].getValueByField('id');
}

// var values = ['Monopole', 'Rapole', '3 legged', '4 legged', 'Rooftop', 'Lamp pole', 'Monopole tree', 'Guyed mast'];

// for (var i in towersRecs) {
//     towerId = towersRecs[i].getValueByField('id');
//     eqptModel.massUpdate({tower_type: values[genNum(0, values.length - 1, 'integer')]}, {id: towerId});
// }

var towersRecsTwo = eqptModel.execQuery({where: {'equipment_type': 'Tower'}});

for (var i in towersRecsTwo) {
    towerId = towersRecsTwo[i].getValueByField('id');
    towerType = towersRecsTwo[i].getValueByField('tower_type');
    towerType = (flParams[towerType] !== undefined) ? towerType : 'Monopole';
    eqptModel.massUpdate({flight_path_params: flParams[towerType]}, {id: towerId});
}

function genNum(min, max, type) {
  if (type == 'integer') {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } else if (type == 'float') {
    return Math.random() * (max - min) + min;
  }
}