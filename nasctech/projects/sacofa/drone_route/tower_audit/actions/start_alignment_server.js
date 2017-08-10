var logMsg = 'Latitude: ' + ctx.instance.getValueByField('sys_position_lat') + '\n' +
             'Longitude: ' + ctx.instance.getValueByField('sys_position_long') + '\n';
logger( 'Drone. START "Start alignment" \n' + logMsg );

var alignType = ctx.instance.getValueByField('alignment_type');
logger( 'Drone. | alignType: ' + alignType );
if (alignType == 'Save and Home') {
    saveAlign();
    ctx.instance.save();
    actions.redirectToMsg(ctx.instance, 'Alignment complete!', 0);
} else if (alignType == 'Save and Audit') {
    saveAlign();
    ctx.instance.setValueToField('status_of_route', 3);
    ctx.instance.setValueToField('ready_to_start', false);
    var cond = {tower_audit_id: ctx.instance.getValueByField('id')};
    custom.getModelByAlias('flight_path').massUpdate({status: 2}, cond);
    ctx.instance.save();
    actions.redirectToMsg(ctx.instance, 'Audit and alignment complete!', 0);
} else {
    ctx.instance.save();
    actions.redirectToMsg(ctx.instance, 'Alignment wasn`t done!', 1);
}

function saveAlign() {
    logger( 'Drone. Start saveAlign' );
    var currLat = ctx.instance.getValueByField('sys_position_lat'),
        currLong = ctx.instance.getValueByField('sys_position_long');

    // update flight path
    var cond = {'tower_audit_id': ctx.instance.getValueByField('id')},
        params = {
            'latitude': currLat,
            'longitude': currLong
        };
    var updateResults = custom.getModelByAlias('flight_path').massUpdate(params, cond);
    if ( !updateResults.getResult() ) {
        logger( 'Drone. Errors while update center of flight path: ' + updateResults.getErrors() );
    }

    // update tower equipment
    params = {
        'sys_position_lat': currLat,
        'sys_position_long': currLong,
        'aligned': true
    };
    cond = {'id': ctx.instance.getValueByField('tower_id')};
    updateResults = custom.getModelByAlias('tower_eqpt').massUpdate(params, cond);
    if ( !updateResults.getResult() ) {
        logger( 'Drone. Errors while update aligned in tower: ' + updateResults.getErrors() );
    }

    // update tower audit
    ctx.instance.setValueToField('sys_position_lat', currLat);
    ctx.instance.setValueToField('sys_position_long', currLong);
    var data = gsTowerAudit.calcPoints(ctx.instance);
    ctx.instance.setValueToField('points_for_drone', JSON.stringify(data));
    logger( 'Drone. End saveAlign' );
}

function logger(msg) {
    if (true) utils.addLogRecord(msg, 1);
}