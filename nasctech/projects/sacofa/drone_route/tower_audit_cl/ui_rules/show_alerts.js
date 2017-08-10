if (ctx.getClientType() != 'portal') {
    var commonMsg = 'Submit isn`t possible with this value.\n',
        //fields = [alias, condition, message]
        fields = [
            ['checklist_position_battery',         [3, 4], 'The drone battery should be charged more than 50%'],
            ['remote_control_battery_level',       [3, 4], 'The remote control battery should be charged more than 50%'],
            ['checklist_position_wind',            [1],    'There must be no wind'],
            ['checklist_position_weather',         [1],    'There must be clear weather'],
            ['checklist_position_obstacles_route', [1],    'There must be no obstacles on the route'],
            ['remote_control_antennas_position',   [1],    'Antennas position must be vertical parallel'],
            ['drones_mode',                        [2, 3], 'Drone mode must be P (Phantom 4) or F'],
            ['drones_status_lights',               [1],    'Drone lights must slowly blinking Green'],
            ['sd_memory_card',                     [1],    'SD card must be empty'],
            ['gps_signal',                         [3],    'GPS singal must be 10-15'],
            ['propellers',                         [1],    'Propellers must be installed correctly'],
            ['rf_scanner',                         [1],    'RF scanner must be switched on'],
            ['gimbal',                             [1],    'Gimbal must be is free']
        ],
        val;
    for (var c in fields) {
        if (field.is(fields[c][0])) showMsg(fields[c][0], fields[c][1], fields[c][2]);
    }
}

function showMsg(alias, cond, msg) {
    val = ctx.instance.getValueByField(alias);
    if (val != cond[0] && val != cond[1]) alert(commonMsg + msg);
}