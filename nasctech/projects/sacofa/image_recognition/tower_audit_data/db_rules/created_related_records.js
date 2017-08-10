var towerEqptModel = custom.getModelByAlias('tower_eqpt');
var antennasFromEqpt = towerEqptModel.execQuery( {where: {
  parent_tower: ctx.instance.getValueByField('tower_id'),
  equipment_type: 'Antenna'
} } );

if ( !utils.isEmpty(antennasFromEqpt) ) {
    logger( 'START duplicateExistingAntennas: ' + dt.now() );
    var fields = [ 'antenna_type', 'owner', 'height_from_ground', 
      'azimuth', 'diameter', 'antena_height', 'antena_width',
      'submitted', 'tower_audit_data', 'parent_type'],
        values = [], alias, singleRecValues;

    for ( var rec in antennasFromEqpt ) {
        singleRecValues = [];
        for ( alias = 0; alias < fields.length - 2; alias++ ) {
            singleRecValues.push( antennasFromEqpt[rec].getValueByField( fields[alias] ) );
        }
        singleRecValues.push( ctx.instance.getValueByField('id') );
        singleRecValues.push( 'Tower Audit Data' );
        values.push(singleRecValues);
    }

    var data = {'fields': fields, 'values': values};
    logger( JSON.stringify(data) );
    if ( values.length > 0 ) {
        var objResult = custom.getModelByAlias('existing_antennas_service').massCreate(data);
        if ( objResult.getResult() === false ) {
            logger( 'Error while create records in CO "Existing Antennas service" '
                + objResult.getErrors());
        }
    } else {
        logger( 'There is no existing antennas.');
    }
    logger( 'END duplicateExistingAntennas: ' + dt.now());
}

function logger(msg) {
    if ( true ) utils.addLogRecord(msg, 1);
}