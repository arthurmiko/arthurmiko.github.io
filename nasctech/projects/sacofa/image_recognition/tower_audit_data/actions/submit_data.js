var towerEqptModel = custom.getModelByAlias('tower_eqpt'),
    antennasHistory = custom.getModelByAlias('antennas_changes_history'),
    historyFields = [ 'recognized_antenna_id', 'antenna_id', 'owner', 'degree',
        'height_from_ground', 'antena_height', 'antena_width', 'diameter',
        'sys_position_lat', 'sys_position_long' ],
    historyValues, params, result, newHistoryRec, antennaId;

var recognisedAntennas = custom.getModelByAlias('recognised_antennas').execQuery( {where: {
    status: 4, // verified
    tower_audit_data: ctx.instance.getValueByField('id')
} } );

for ( var rec in recognisedAntennas ) {
    if ( recognisedAntennas[rec].getValueByField('antenna_status') == 1 ) { // new
        params = prepareCommonParams( recognisedAntennas[rec] );
        params.antenna_type = recognisedAntennas[rec].getValueByField('antenna_type');
        params.parent_tower = recognisedAntennas[rec].getValueByField('tower_id');
        params.equipment_type = 'Antenna';
        result = towerEqptModel.create(params);
        if ( result.isValid() ) {
            recognisedAntennas[rec].setValueToField( 'antenna_id', result.getValueByField('id') );
            recognisedAntennas[rec].setValueToField( 'submitted', true );
            nascUtils.quickSave( recognisedAntennas[rec] );
        } else {
            logger( 'Image Rec. | Cannot create antenna record. \n Errors: ' + result.getErrors() );
        }

    } else if ( recognisedAntennas[rec].getValueByField('antenna_status') == 2 ) { // existing
        antennaId = recognisedAntennas[rec].getValueByField('antenna_id');
        if ( createHistoryRec( recognisedAntennas[rec], antennaId ) ) {
            params = prepareCommonParams( recognisedAntennas[rec] );
            result = towerEqptModel.massUpdate( params, {id: antennaId} );
            if ( result.getResult() ) {
                recognisedAntennas[rec].setValueToField( 'submitted', true );
                nascUtils.quickSave( recognisedAntennas[rec] );
            } else {
                logger( 'Image Rec. | Cannot update antenna record. \n Errors: ' + result.getErrors() );
            }
        }
    }
}

ctx.instance.setValueToField( 'submit_status', 3 ); // Submitted
ctx.instance.save();

function createHistoryRec(rec, antennaId) {
    var query = towerEqptModel.createQuery();
    query.getFields( [ 'owner', 'degree', 'height_from_ground', 'antena_height', 'antena_width',
        'diameter', 'sys_position_lat', 'sys_position_long' ] );
    query.setLimit(1);
    query.addCondition( 'id', antennaId );
    var antennaRec = query.exec();

    historyValues = [ [ rec.getValueByField('id'), antennaId ] ];
    for ( var alias = 2; alias < historyFields.length; alias++ ) {
        historyValues[0].push( antennaRec[0].getValueByField( historyFields[alias] ) );
    }

    var data = {'fields': historyFields, 'values': historyValues};
    newHistoryRec = antennasHistory.massCreate( data );

    if ( newHistoryRec.getResult() ) {
        logger( 'Image Rec. | Antenna history record were created.' );
        return true;
    } else {
        logger( 'Image Rec. | Cannot create antenna history record. \n Errors: ' + newHistoryRec.getErrors() );
        return false;
    }
}

function prepareCommonParams(rec) {
    var params = {
        degree: transformDegree( rec.getValueByField('azimuth') ),
        azimuth: rec.getValueByField('azimuth'),
        height_from_ground: rec.getValueByField('agl'),
        sys_position_lat: rec.getValueByField('latitude'),
        sys_position_long: rec.getValueByField('longitude'),
        owner: rec.getValueByField('customer'),
        submitted: true,
        accepted: false
    };

    if ( rec.getValueByField('antenna_type') != 'Microwave antenna' ) {
        params.antena_height = rec.getValueByField('height');
        params.antena_width = rec.getValueByField('width');
    } else {
        params.diameter = rec.getValueByField('diameter');
    }
    return params;
}

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

function logger(msg) {
    if ( true ) utils.addLogRecord(msg, 1);
}