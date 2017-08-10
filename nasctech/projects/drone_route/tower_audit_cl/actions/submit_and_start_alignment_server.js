var logMsg = 'Latitude: ' + ctx.instance.getValueByField('latitude') + '\n' +
             'Longitude: ' + ctx.instance.getValueByField('longitude') + '\n';
logger( 'Drone. START "Submit and start alignment" \n' + logMsg );

var towerAuditModel = custom.getModelByAlias('tower_audit'),
    towerAuditId = ctx.instance.getValueByField('tower_audit'),
    status = ctx.instance.getValueByField('status'),
    alignType = ctx.instance.getValueByField('alignment_type');
var towerAuditRec = towerAuditModel.execQuery({where:{id: towerAuditId}})[0];
ctx.instance.save();

logger( 'Drone. | alignType: ' + alignType );
if (status == 2) {
    if (alignType == 'Save and Home') {
        saveAlign();
        updateTowerAudit(1, true);
        actions.redirectToMsg(towerAuditRec, "Alignment complete and drone ready to start!", 0);
    } else if (alignType == 'Save and Audit') {
        saveAlign();
        updateTowerAudit(3, false);
        var cond = {tower_audit_id: towerAuditId};
        custom.getModelByAlias('flight_path').massUpdate({status: 2}, cond);
        actions.redirectToMsg(towerAuditRec, 'Route and alignment complete!', 0);
    } else {
        updateTowerAudit(1, true);
        actions.redirectToMsg(towerAuditRec, 'Checklist filled correct! Alignment wasn`t done!', 1);
    }
} else {
    updateTowerAudit(2, false);
    var message = gsTowerAudit.submitMsg(ctx.instance);
    actions.redirectToMsg(ctx.instance, "Tower alignment is not possible because of " + message.join(', '), 1);
}

function updateTowerAudit(status, ready) {
    logger( 'Drone. START updateTowerAudit | status: ' + status + ' ready: ' + ready );
    towerAuditRec.setValueToField('status_of_route', status);
    towerAuditRec.setValueToField('ready_to_start', ready);
    var result = towerAuditRec.save();
    logger( 'Drone. END updateTowerAudit | result: ' + result.getErrors() );
}

function saveAlign() {
    logger( 'Start saveAlign' );
    var currLat = ctx.instance.getValueByField('latitude'),
        currLong = ctx.instance.getValueByField('longitude');

    // update CL
    ctx.instance.setValueToField('aligned', true);

    // update flight path
    var cond = {'tower_audit_id': towerAuditId},
        params = {
            'latitude': currLat,
            'longitude': currLong
        };
    var updateResults = custom.getModelByAlias('flight_path').massUpdate(params, cond);
    if ( !updateResults.getResult() ) {
        logger( 'Errors while update center of flight path: ' + updateResults.getErrors() );
    }

    // update Tower Equipment
    params = {
        'sys_position_lat': currLat,
        'sys_position_long': currLong,
        'aligned': true
    };
    cond = {'id': towerAuditRec.getValueByField('tower_id')};
    updateResults = custom.getModelByAlias('tower_eqpt').massUpdate(params, cond);
    if ( !updateResults.getResult() ) {
        logger( 'Errors while update aligned in tower: ' + updateResults.getErrors() );
    }

    // update Tower audit
    towerAuditRec.setValueToField('sys_position_lat', currLat);
    towerAuditRec.setValueToField('sys_position_long', currLong);
    var dataPoints = JSON.stringify(gsTowerAudit.calcPoints(towerAuditRec));
    ctx.instance.setValueToField('points_for_drone', dataPoints);
    params.points_for_drone = dataPoints;
    cond = {'id': towerAuditId};
    updateResults = towerAuditModel.massUpdate(params, cond);
    if ( !updateResults.getResult() ) {
        logger( 'Errors while update aligned in tower audit: ' + updateResults.getErrors() );
    }
    logger( 'End saveAlign' );
}

function logger(msg) {
    if (true) utils.addLogRecord(msg, 1);
}