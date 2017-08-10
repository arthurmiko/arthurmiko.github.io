var debug = true;
var landingResult;
var startLocation = getStartLocation();
if (startLocation) landingResult = landing(10.5);
ctx.instance.setValueToField('test_actions', (landingResult) ? true : false);
return true;

function landing(alt) {
    if (debug) utils.addLogRecord('START landing from alt: ' + alt, 1);
    var param = {
        speed : 6.01,
        wplist: [{
            longitude: startLocation.location.longitude,
            latitude: startLocation.location.latitude,
            altitude: alt
        }, {
            longitude: startLocation.location.longitude,
            latitude: startLocation.location.latitude,
            altitude: 0.5
        }]
    };

    if (debug) utils.addLogRecord('INSIDE landing | param for movementByWayPoint(): ' + JSON.stringify(param), 1);
    var response = tryParse(drone.movementByWayPoint(param), 'landing', 'drone.movementByWayPoint');
    if (verifyResult(response, 1, 'landing', 'drone.movementByWayPoint')) {
        response = tryParse(drone.autoLanding(), 'landing', 'drone.autoLanding');
        return verifyResult(response, 1, 'landing', 'drone.autoLanding');
    } else {
        return false;
    }
}

function getStartLocation() {
    if (debug) utils.addLogRecord('START getStartLocation', 1);
    var response = tryParse(drone.getCurrentLocation(), 'getStartLocation', 'drone.getCurrentLocation');
    return verifyResult(response, 4, 'getStartLocation', 'drone.getCurrentLocation');
}

function tryParse(res, func, api) {
    var result = false;
    if (debug) utils.addLogRecord('tryParse | input data: ' + func + ' | ' + api + ': ' + res, 1);
    try {
      result = JSON.parse(res);
    } catch (e) {
      if (debug) utils.addLogRecord('tryParse | error in: ' + func + ' | ' + api + ' | Error: ' + e + ' | Response: ' + res, 1);
    }
    return result;
}

function verifyResult(result, type, func, api) {
    var ok = false;
    if (debug) utils.addLogRecord('verifyResult | input data: ' + func + ' | ' + api + ': ' + JSON.stringify(result), 1);
    if (type == 1) ok = result.message == 'No Errors';
    if (type == 2) ok = typeof(result) == 'object';
    if (type == 3) ok = result.droneError.message == 'No Errors';
    if (type == 4) ok = (result.location.latitude != 181 && result.location.longitude != 181);
    if (ok) {
        return result;
    } else if (debug && !ok) {
        utils.addLogRecord('verifyResult | error in: ' + func + ' | ' + api + ': ' + JSON.stringify(result), 1);
        return false;
    }
}