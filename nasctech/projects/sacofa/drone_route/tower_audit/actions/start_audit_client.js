var ALT_EXTRA = 20.1;
var debug = true,
    altList = [],
    execResult, landResult, paramPolygon, route;
ctx.instance.setValueToField('user_aborted', false);
logger( "Start Drone audit!" );

var startLocation = getLocation();
if (startLocation) route = prepareRoute();
if (route) execResult = executeRoute(route);
if (execResult.message == 'No Errors') {
    ctx.instance.setValueToField('status_of_route', 3); // Completed
    ctx.instance.setValueToField('ready_to_start', false);
} else if (execResult.message == 'User aborted') {
    ctx.instance.setValueToField('user_aborted', true);
}
landResult = landing();

logger( "End Drone audit!" );

return true;

function getLocation() {
    logger( 'START getLocation' );
    var response = tryParse(drone.getCurrentLocation(), 'getLocation', 'drone.getCurrentLocation');
    return verifyResult(response, 4, 'getLocation', 'drone.getCurrentLocation');
}

function prepareRoute() {
    logger( 'START prepareRoute' );
    var data = tryParse(ctx.instance.getValueByField("points_for_drone"), 'prepareRoute', '');
    for (var i = 0; i < data.length; i++) {
        altList.push(data[i].altitude);
        if (i == data.length - 1) {
            paramPolygon = {
                photoNum     : data[i].numPhoto,
                speed        : data[i].speed,
                radius       : data[i].radius,
                deg          : data[i].deg,
                stepCount    : data[i].stepCount,
                center       : { latitude:  data[i].latitude,
                                 longitude: data[i].longitude,
                                 altitude:  data[i].altitude },
                listAltitude : altList
            };
        }
    }
    return verifyResult(paramPolygon, 2, 'prepareRoute', '');
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
    if (type == 1) ok = result.message == 'No Errors' || result.message == 'User aborted';
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