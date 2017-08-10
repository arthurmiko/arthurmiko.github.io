var ALT_EXTRA = 20.1;
var debug = true,
    altList = [], alignResponse, afterAlign, paramPolygon,
    execResult, landResult, alignParams, route;

logger( "Start Drone alignment!" );

ctx.instance.setValueToField('alignment_type', null);
var startLocation = getLocation();
if (startLocation) alignResponse = getAlignment();
if (alignResponse) {
    alignAction(alignResponse);
} else {
    landing();
}

logger( "End Drone alignment!" );

return true;

function getLocation() {
    logger( 'START getLocation' );
    var response = tryParse(drone.getCurrentLocation(), 'getLocation', 'drone.getCurrentLocation');
    return verifyResult(response, 4, 'getLocation', 'drone.getCurrentLocation');
}

function getAlignment() {
    logger( 'START getAlignment' );
    alignParams = {
        latitude : ctx.instance.getValueByField('sys_position_lat'),
        longitude: ctx.instance.getValueByField('sys_position_long'),
        altitude : ctx.instance.getValueByField('tower_height') + ALT_EXTRA
    };
    var response = tryParse(drone.getAccurateTowerCoordinates(alignParams), 'getAlignment', 'drone.getAccurateTowerCoordinates');
    var verified = verifyResult(response, 3, 'getAlignment', 'drone.getAccurateTowerCoordinates');

    if (verified) {
        var lat = verified.droneError.location.latitude,
            lng = verified.droneError.location.longitude,
            precise = 10000000000; // 10 digits after comma
        verified.droneError.location.latitude = ( Math.round( lat * precise ) / precise );
        verified.droneError.location.longitude = ( Math.round( lng * precise ) / precise );
        return verified;
    } else {
        return false;
    }
}

function alignAction(alignResponse) {
    logger( 'START alignAction' );
    route = prepareRoute(alignResponse);
    if (alignResponse.key.id == 2) {
        logger( 'INSIDE alignAction: key.id == 2' );
        if ( goToStartLatLng(alignParams.altitude) ) {
            execResult = (route) ? executeRoute(route) : false;
            if (execResult) fillAlign('Save and Audit');
            landing();
        }
    } else if (alignResponse.key.id == 3) {
        logger( 'INSIDE alignAction: key.id == 3' );
        fillAlign('Save and Home');
        landing();
    } else {
        logger( 'INSIDE alignAction: last else' );
        landing();
    }
}

function fillAlign(type) {
    logger( 'START fillAlign | alignResponse: ' + JSON.stringify(alignResponse) );
    ctx.instance.setValueToField('sys_position_lat', alignResponse.droneError.location.latitude);
    ctx.instance.setValueToField('sys_position_long', alignResponse.droneError.location.longitude);
    ctx.instance.setValueToField('alignment_type', type);
    ctx.instance.setValueToField('aligned', true);
    logger( 'END fillAlign' );
}

function prepareRoute(alignResponse) {
    logger( 'START prepareRoute' );
    var data = tryParse(ctx.instance.getValueByField("points_for_drone"), 'prepareRoute', '');
    for (var i = data.length - 1; i > -1; i--) {
        altList.push(data[i].altitude);
        if (i === 0) {
            paramPolygon = {
                photoNum     : data[i].numPhoto,
                speed        : data[i].speed,
                radius       : data[i].radius,
                deg          : data[i].deg,
                stepCount    : data[i].stepCount,
                center       : { latitude:  alignResponse.droneError.location.latitude,
                                 longitude: alignResponse.droneError.location.longitude,
                                 altitude:  data[i].altitude },
                listAltitude : altList
            };
        }
    }
    return verifyResult(paramPolygon, 2, 'prepareRoute', '');
}

function goToStartLatLng(alt) {
    var param = {
        speed: route.speed,
        wplist: [{
            longitude: startLocation.location.longitude,
            latitude: startLocation.location.latitude,
            altitude: alt + 1
        }, {
            longitude: startLocation.location.longitude,
            latitude: startLocation.location.latitude,
            altitude: alt
        }]
    };
    var response = tryParse(drone.movementByWayPoint(param), 'goToStartLatLng', 'drone.movementByWayPoint');
    return ( verifyResult( response, 1, 'goToStartLatLng', 'drone.movementByWayPoint' ) );
}

function executeRoute(route) {
    logger( 'START executeRoute route: ' + JSON.stringify(route) );
    var response = tryParse(drone.movementByNPolygonWithPhoto(route), 'executeRoute', 'drone.movementByNPolygonWithPhoto');
    return verifyResult(response, 1, 'executeRoute', 'drone.movementByNPolygonWithPhoto');
}

function landing() {
    logger( 'START landing' );
    var currentLocation = getLocation();
    if (!currentLocation) return false;

    var param = {
        speed: 10.001,
        wplist: [{
            longitude: currentLocation.location.longitude,
            latitude: currentLocation.location.latitude,
            altitude: ctx.instance.getValueByField('tower_height') + ALT_EXTRA
        }, {
            longitude: startLocation.location.longitude,
            latitude: startLocation.location.latitude,
            altitude: ctx.instance.getValueByField('tower_height') + ALT_EXTRA
        }, {
            longitude: startLocation.location.longitude,
            latitude: startLocation.location.latitude,
            altitude: 3.1
        }]
    };

    var response = tryParse(drone.movementByWayPoint(param), 'landing_1', 'drone.movementByWayPoint');
    if (verifyResult(response, 1, 'landing_1', 'drone.movementByWayPoint')) {
        param = {
            speed: 2.001,
            wplist: [{
                longitude: startLocation.location.longitude,
                latitude: startLocation.location.latitude,
                altitude: 1.5
            }, {
                longitude: startLocation.location.longitude,
                latitude: startLocation.location.latitude,
                altitude: 0.3
            }]
        };
        response = tryParse(drone.movementByWayPoint(param), 'landing_2', 'drone.movementByWayPoint');
        if ( verifyResult(response, 1, 'landing_2', 'drone.movementByWayPoint') ) {
            response = tryParse(drone.autoLanding(), 'landing_3', 'drone.autoLanding');
            return verifyResult(response, 1, 'landing_3', 'drone.autoLanding');
        }
    }
    return false;
}

function tryParse(res, func, api) {
    var result = false;
    logger( 'tryParse | input data: ' + func + ' | ' + api + ': ' + res );
    try {
      result = JSON.parse(res);
    } catch (e) {
      logger( 'tryParse | error in: ' + func + ' | ' + api + ' | Error: ' + e + ' | Response: ' + res );
    }
    return result;
}

function verifyResult(result, type, func, api) {
    var ok = false;
    logger( 'verifyResult | input data: ' + func + ' | ' + api + ': ' + JSON.stringify(result) );
    if (type == 1) ok = result.message == 'No Errors';
    if (type == 2) ok = typeof(result) == 'object';
    if (type == 3) ok = result.droneError.message == 'No Errors';
    if (type == 4) ok = (result.location.latitude != 181 && result.location.longitude != 181);
    if (ok) {
        return result;
    } else if ( !ok ) {
        logger( 'verifyResult | error in: ' + func + ' | ' + api + ': ' + JSON.stringify(result) );
        return false;
    }
}

function logger(msg) {
    if (true) utils.addLogRecord( msg, 1 );
}