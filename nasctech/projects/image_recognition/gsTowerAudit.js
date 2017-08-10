var gsTowerAudit = {
    calcPoints: function(rec) {
        var data = [], angle, stepCount;

        var query = custom.getModelByAlias('flight_path').createQuery();
        query.getFields(['latitude', 'longitude', 'altitude',
                         'amount_of_photos','speed_m_s',
                         'radius_of_circle', 'angle_of_displacement',
                         'amount_of_displacements', 'action'
                        ]);
        var qCond = query.addCondition('tower_audit_id', rec.getValueByField("id"));
        query.orderBy('execution_order','asc');
        query.setLimit(0);

        var flPathRecs = query.exec();

        if (flPathRecs.length > 0) {
            for (var i in flPathRecs) {
                if (flPathRecs[i].getValueByField("action") == 1) {
                    angle = 1;
                    stepCount = 1;
                } else {
                    angle = flPathRecs[i].getValueByField("angle_of_displacement");
                    stepCount = flPathRecs[i].getValueByField("amount_of_displacements");
                }

                dataHash = {
                    action          : flPathRecs[i].getValueByField("action"),
                    latitude        : flPathRecs[i].getValueByField("latitude"),
                    longitude       : flPathRecs[i].getValueByField("longitude"),
                    altitude        : flPathRecs[i].getValueByField("altitude"),

                    numPhoto        : flPathRecs[i].getValueByField('amount_of_photos'),
                    speed           : flPathRecs[i].getValueByField("speed_m_s"),
                    radius          : flPathRecs[i].getValueByField('radius_of_circle'),
                    deg             : angle,
                    stepCount       : stepCount
                };
                data.push(dataHash);
            }
        }
        return data;
    },

// checks correctness of filled checklist
    submitMsg: function(rec) {
        var message = [],
            msg1    = "Low Drone battery level",
            msg2    = "Low Remote control battery level",
            msg3    = "Wind Level",
            msg4    = "Weather conditions",
            msg5    = "Visible obstacles",
            msg6    = "Antennas position",
            msg7    = "Drone`s mode",
            msg8    = "Drone`s status lights",
            msg9    = "SD memory card",
            msg10   = "GPS signal",
            msg11   = "Propellers",
            msg12   = "RF scanner",
            msg13   = "Gimbal";

        var droneBatLevel   = rec.getValueByField('checklist_position_battery'),
            controlBatLevel = rec.getValueByField('remote_control_battery_level'),
            windLevel       = rec.getValueByField('checklist_position_wind'),
            weatherCond     = rec.getValueByField('checklist_position_weather'),
            visObstacles    = rec.getValueByField('checklist_position_obstacles_route'),
            antPosition     = rec.getValueByField('remote_control_antennas_position'),
            droneMod        = rec.getValueByField('drones_mode'),
            droneStatus     = rec.getValueByField('drones_status_lights'),
            sdCard          = rec.getValueByField('sd_memory_card'),
            gpsSignal       = rec.getValueByField('gps_signal'),
            propellers      = rec.getValueByField('propellers'),
            rfScanner       = rec.getValueByField('rf_scanner'),
            gimbal          = rec.getValueByField('gimbal');

        if (droneBatLevel   != '3' && droneBatLevel != '4')   message.push(msg1);
        if (controlBatLevel != '3' && controlBatLevel != '4') message.push(msg2);
        if (windLevel       != '1')                           message.push(msg3);
        if (weatherCond     != '1')                           message.push(msg4);
        if (visObstacles    != '1')                           message.push(msg5);
        if (antPosition     != '1')                           message.push(msg6);
        if (droneMod        != '2' && droneMod != '3')        message.push(msg7);
        if (droneStatus     != '1')                           message.push(msg8);
        if (sdCard          != '1')                           message.push(msg9);
        if (gpsSignal       != '3')                           message.push(msg10);
        if (propellers      != '1')                           message.push(msg11);
        if (rfScanner       != '1')                           message.push(msg12);
        if (gimbal          != '1')                           message.push(msg13);

        return message;
    },

    matchingAntennas: function(parentId, alias) {
        utils.addLogRecord('AM DEBUG: ' + dt.now());
        var model = custom.getModelByAlias('recognised_antennas');
        var parent = model.find( {id: parentId} )[0];
        var result = parent.getValueByField(alias);
        utils.addLogRecord('AM DEBUG result: ' + result);
        return result;
    }
};