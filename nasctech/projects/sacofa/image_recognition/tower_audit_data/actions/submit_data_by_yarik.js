var recAntModel = custom.getModelByAlias('recognised_antennas').execQuery({where:{
    status: 4, // verified
    tower_audit_data: ctx.instance.getValueByField('id')
}});

for ( var i in recAntModel ) {
//==========================================================================
//Для антен со Статусом - Existing
//==========================================================================

//Start
  if(recAntModel[i].getValueByField('antenna_status') == 2 ){
    var antennaRecs = custom.getModelByAlias('tower_eqpt').execQuery( {where:{ 
      id:recAntModel[i].getValueByField('antenna_id') 
    }});
  
    for ( var j in antennaRecs ) {
      var degree = transformDegree(recAntModel[i].getValueByField('degree'));
      if ( degree != antennaRecs[j].getValueByField('degree') ) {
        antennaRecs[j].setValueToField('degree', degree);
      }
      if ( recAntModel[i].getValueByField('agl') != antennaRecs[j].getValueByField('height_from_ground') ) {
        antennaRecs[j].setValueToField('height_from_ground', recAntModel[i].getValueByField('agl'));
      }
      if ( recAntModel[i].getValueByField('antenna_type') == 2 || recAntModel[i].getValueByField('antenna_type') == 3 ) {
        if ( recAntModel[i].getValueByField('height') != antennaRecs[j].getValueByField('antena_height') ) {
          antennaRecs[j].setValueToField('antena_height', recAntModel[i].getValueByField('height'));
        }
      }
      if ( recAntModel[i].getValueByField('antenna_type') == 2 || recAntModel[i].getValueByField('antenna_type') == 3 ) {
        if ( recAntModel[i].getValueByField('width') != antennaRecs[j].getValueByField('antena_width') ) {
          antennaRecs[j].setValueToField('antena_width', recAntModel[i].getValueByField('width'));
        }
      } 
      if ( recAntModel[i].getValueByField('antenna_type') == 1 ) {
        if ( recAntModel[i].getValueByField('diameter') != antennaRecs[j].getValueByField('diameter') ) {
          antennaRecs[j].setValueToField('diameter', recAntModel[i].getValueByField('diameter'));
        }
      }
      if ( recAntModel[i].getValueByField('latitude') != antennaRecs[j].getValueByField('sys_position_lat') ) {
        antennaRecs[j].setValueToField('sys_position_lat', recAntModel[i].getValueByField('latitude'));
      }
      if ( recAntModel[i].getValueByField('longitude') != antennaRecs[j].getValueByField('sys_position_long') ) {
        antennaRecs[j].setValueToField('sys_position_long', recAntModel[i].getValueByField('longitude'));
      }  
      nascUtils.quickSave(antennaRecs[j]);
    }
  }
//End

//==========================================================================
//Для антен со Статусом - New
//==========================================================================

//Start
  if(recAntModel[i].getValueByField('antenna_status') == 1 ){
    var antennaRecs = custom.getModelByAlias('tower_eqpt').execQuery( {where:{ 
      id:recAntModel[i].getValueByField('antenna_id') 
    }});
  
    for ( var j in antennaRecs ) {
      var degree = transformDegree(recAntModel[i].getValueByField('degree'));
      if ( degree != antennaRecs[j].getValueByField('degree') ) {
        antennaRecs[j].setValueToField('degree', degree);
      }
      if ( recAntModel[i].getValueByField('agl') != antennaRecs[j].getValueByField('height_from_ground') ) {
        antennaRecs[j].setValueToField('height_from_ground', recAntModel[i].getValueByField('agl'));
      }
      if ( recAntModel[i].getValueByField('antenna_type') == 2 || recAntModel[i].getValueByField('antenna_type') == 3 ) {
        if ( recAntModel[i].getValueByField('height') != antennaRecs[j].getValueByField('antena_height') ) {
          antennaRecs[j].setValueToField('antena_height', recAntModel[i].getValueByField('height'));
        }
      }
      if ( recAntModel[i].getValueByField('antenna_type') == 2 || recAntModel[i].getValueByField('antenna_type') == 3 ) {
        if ( recAntModel[i].getValueByField('width') != antennaRecs[j].getValueByField('antena_width') ) {
          antennaRecs[j].setValueToField('antena_width', recAntModel[i].getValueByField('width'));
        }
      } 
      if ( recAntModel[i].getValueByField('antenna_type') == 1 ) {
        if ( recAntModel[i].getValueByField('diameter') != antennaRecs[j].getValueByField('diameter') ) {
          antennaRecs[j].setValueToField('diameter', recAntModel[i].getValueByField('diameter'));
        }
      }
      if ( recAntModel[i].getValueByField('latitude') != antennaRecs[j].getValueByField('sys_position_lat') ) {
        antennaRecs[j].setValueToField('sys_position_lat', recAntModel[i].getValueByField('latitude'));
      }
      if ( recAntModel[i].getValueByField('longitude') != antennaRecs[j].getValueByField('sys_position_long') ) {
        antennaRecs[j].setValueToField('sys_position_long', recAntModel[i].getValueByField('longitude'));
      } 
      var antennaType = transformAntenaType(recAntModel[i].getValueByField('antenna_type'));
      if ( antennaType != antennaRecs[j].getValueByField('antenna_type') ) {
        antennaRecs[j].setValueToField('antenna_type', antennaType);
      }
      if ( recAntModel[i].getValueByField('tower_id') != antennaRecs[j].getValueByField('parent_tower') ) {
        antennaRecs[j].setValueToField('parent_tower', recAntModel[i].getValueByField('tower_id'));
      }
      nascUtils.quickSave(antennaRecs[j]);
    }
  }
//End
}


//================================
//Функция преобразования градусов
//================================
function transformDegree(degree) {
    if (degree >= 0 && degree <= 60) {
        return '0-60';
    } else if (degree >= 61 && degree <= 120) {
        return '61-120';
    } else if (degree >= 121 && degree <= 180) {
        return '121-180';
    } else if (degree >= 181 && degree <= 240) {
        return '181-240';
    } else if (degree >= 241 && degree <= 300) {
        return '241-300';
    } else if (degree >= 301 && degree <= 360) {
        return '301-360';
    }
}

//====================================
//Функция преобразования типа антенны
//====================================
function transformAntenaType(type) {
  if(type == 1){
    return 'Microwave antenna';
  }
  if(type == 2){
    return 'RRU';
  }
  if(type == 3){
    return 'RF antenna';
  }
}