logger( 'Image Rec. | START accept: ' + dt.now() );
var fields = [ 'owner', 'height', 'width', 'azimuth', 'agl', 'latitude', 'longitude' ],
    towerEqptModel = custom.getModelByAlias('tower_eqpt'),
    historyModel = custom.getModelByAlias('antennas_changes_history'),
    historyFields = [ 'owner', 'degree', 'height_from_ground', 'antena_height', 'antena_width',
        'diameter', 'sys_position_lat', 'sys_position_long' ],
    mapping = {
        'owner': 'owner',
        'height': 'antena_height',
        'width': 'antena_width',
        'diameter': 'diameter',
        'azimuth': 'azimuth',
        'latitude': 'sys_position_lat',
        'longitude': 'sys_position_long',
        'agl': 'height_from_ground'
    },
    needUpdate = [],
    state = 'default',
    params, updateResult;

var antennaId = ctx.instance.getValueByField('antenna_id');

if ( ctx.instance.isChanged( 'status' ) ) {
    var newStatus = ctx.instance.getValueByField('status'),
        antennaStatus = ctx.instance.getValueByField('antenna_status');

    if ( newStatus == 3 ) { // Rejected
        if ( antennaStatus == 1 ) { // New
            var antennaRec = towerEqptModel.find( {'id': antennaId} )[0];
            antennaRec.destroy(); // AM need API reference
            state = 'delete';
        } else if ( antennaStatus == 2 ) { // Existing
            params = getHistoryValues();
            updateResult = towerEqptModel.massUpdate( params, {id: antennaId} );
            validate(updateResult);
            state = 'restore';
        }
    }

} else if ( ctx.instance.isChanged( 'antenna_id' ) ) {
    params = {};
    params.accepted = true;
    for ( var alias in fields ) {
        params[ mapping[ fields[alias] ] ] = ctx.instance.getValueByField( fields[alias] );
    }
    updateResult = towerEqptModel.massUpdate( params, {id: antennaId} );
    validate(updateResult);

    params = getHistoryValues();
    antennaId = ctx.instance.getOldValueByField('antenna_id');
    updateResult = towerEqptModel.massUpdate( params, {id: antennaId} );
    validate(updateResult);
    state = 'restore and update';
}

if ( state == 'default' ) {
    for ( var alias in fields ) {
        if ( ctx.instance.isChanged( fields[alias] ) ) {
            needUpdate.push( fields[alias] );
        }
    }
    params = {};
    for ( var alias in needUpdate ) {
        params[ mapping[ needUpdate[alias] ] ] = ctx.instance.getValueByField( needUpdate[alias] );
    }
    params.accepted = true;
    updateResult = towerEqptModel.massUpdate( params, {id: antennaId} );
    validate(updateResult);
    state = 'update';
}

if ( state == 'default' ) {
    updateResult = towerEqptModel.massUpdate( {accepted: true}, {id: antennaId} );
    validate(updateResult);
}

ctx.instance.setValueToField( 'status', 2 ); // Closed
nascUtils.quickSave( ctx.instance );

logger( 'Image Rec. | END accept | state: ' + state + ' time: ' + dt.now() );

function getHistoryValues() {
    var result = {};
    var historyRec = historyModel.find( {
        'recognized_antenna_id': ctx.instance.getValueByField('id')
    } )[0];
    for ( var alias in historyFields ) {
        result[ historyFields[alias] ] = historyRec.getValueByField( historyFields[alias] );
    }
    result.accepted = true;
    return result;
}

function logger(msg) {
    if ( true ) utils.addLogRecord(msg, 1);
}

function validate(rec) {
    if ( !rec.getResult() ) {
        logger( 'Image Rec. | Accept | Error: ' + rec.getErrors() );
    }
}