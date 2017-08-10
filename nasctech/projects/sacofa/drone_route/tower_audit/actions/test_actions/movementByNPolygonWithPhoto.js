var debug = true;
var altList = [];
var route = prepareRoute();
var result = executeRoute(route);
ctx.instance.setValueToField('test_actions', (result) ? true : false);
return true;

function executeRoute(route) {
    if (debug) utils.addLogRecord('START executeRoute route: ' + JSON.stringify(route), 1);
    var response = tryParse(drone.movementByNPolygonWithPhoto(route), 'executeRoute', 'drone.movementByNPolygonWithPhoto');
    return verifyResult(response, 1, 'executeRoute', 'drone.movementByNPolygonWithPhoto');
}

function prepareRoute() {
    if (debug) utils.addLogRecord('START prepareRoute', 1);
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