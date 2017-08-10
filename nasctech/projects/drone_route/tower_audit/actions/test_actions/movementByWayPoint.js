var debug = true;
var param = {
    speed : 6.01,
    wplist: [{
        longitude: 100.5,
        latitude: 100.5,
        altitude: 10.5
    }, {
        longitude: 100.5,
        latitude: 100.5,
        altitude: 0.5
    }]
};

var response = tryParse(drone.movementByWayPoint(param), 'without_func', 'drone.movementByWayPoint');
ctx.instance.setValueToField('test_actions', (response) ? true : false);

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

return true;