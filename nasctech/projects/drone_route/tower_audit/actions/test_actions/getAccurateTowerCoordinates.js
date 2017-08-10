var debug = true;
var alignment = getAlignment();
ctx.instance.setValueToField('test_actions', (alignment) ? true : false);
return true;

function getAlignment() {
    if (debug) utils.addLogRecord('START getAlignment', 1);
    alignParams = {
        latitude : ctx.instance.getValueByField('sys_position_lat'),
        longitude: ctx.instance.getValueByField('sys_position_long'),
        altitude : ctx.instance.getValueByField('tower_height') + 5.001
    };
    var response = tryParse(drone.getAccurateTowerCoordinates(alignParams), 'getAlignment', 'drone.getAccurateTowerCoordinates');
    return verifyResult(response, 3, 'getAlignment', 'drone.getAccurateTowerCoordinates');
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