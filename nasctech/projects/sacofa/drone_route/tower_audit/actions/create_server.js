var debug = true;

ctx.instance.save();
var recId = ctx.instance.getValueByField('id'),
    towerRecord = custom.getModelByAlias('tower_eqpt').execQuery({
        where: {id: ctx.instance.getValueByField('tower_id')}
    })[0],
    flPathModel = custom.getModelByAlias('flight_path'),
    flPathParamsRec = custom.getModelByAlias('flight_path_params').execQuery({
        where: {id: towerRecord.getValueByField('flight_path_params')}
    })[0],
    newRec;

var defRouteId = towerRecord.getValueByField('default_route'),
    tower = {
        type: towerRecord.getVisibleValueByField('flight_path_params'),
        legs: towerRecord.getValueByField('legs_distance'),
        height: towerRecord.getValueByField('height'),
        heightBuilding: towerRecord.getValueByField('height_of_the_building')
    };

if (!utils.isEmpty(defRouteId)) {
    var defRouteRecord = custom.getModelByAlias('tower_audit').execQuery({where: {id: defRouteId}})[0];
    if (tower.type == 'Rooftop') {
        var defStartPos = defRouteRecord.getValueByField('start_position');
    }
}

// Create new flight path records or copy records from default flight path
if (utils.isEmpty(defRouteRecord)) {
    var flPathParams = {
            heightFirst: flPathParamsRec.getValueByField('first_circle_height'),
            steps:       flPathParamsRec.getValueByField('steps_between_circles'),
            radius:      flPathParamsRec.getValueByField('circle_radius'),
            angle:       flPathParamsRec.getValueByField('angle_of_displacment'),
            count:       flPathParamsRec.getValueByField('circles_count'),
            offsets:     flPathParamsRec.getValueByField('number_of_offsets'),
            photos:      flPathParamsRec.getValueByField('number_of_photos')
        };

    var flPathCount = calcCount();
    for (var i = 0; i <= flPathCount; i++) {
        var params = createParams(i);
        newRec = flPathModel.create(params);
        if (!utils.isEmpty(newRec.getErrors()) && debug) {
            utils.addLogRecord("Error from create flight path: " + newRec.getErrors(), 1);
        }
    }
} else {
    var defFlPath = flPathModel.execQuery({where: {tower_audit_id: defRouteId}});
    for (var i in defFlPath) {
        newRec = defFlPath[i].copy();
        newRec.setValueToField('tower_audit_id', recId);
        newRec.save();
    }
}

// Generate string for points_for_drone field and redirect with apropriate message
var data = gsTowerAudit.calcPoints(ctx.instance);
var msg = data.length + ' points was created.';
ctx.instance.setValueToField('points_for_drone', JSON.stringify(data));

if (utils.isEmpty(defRouteId)) {
    ctx.instance.save();
    actions.redirectToMsg(ctx.instance, msg, 0);
} else {
    msg += '\nDefault route ID ' + defRouteId + ' was used.';
    if (tower.type == 'Rooftop') {
        ctx.instance.setValueToField('start_position', defStartPos);
        var defStartPosStr = (defStartPos == 1) ? 'from the ground' : 'from the roof';
        msg += '\nPlease note that Start position for this Tower Audit is ' + defStartPosStr;
    }
    ctx.instance.save();
    actions.redirectToMsg(ctx.instance, msg, 1);
}

// Service functions for calculate flight path records according to flight path parameters
function calcCount() {
    if (flPathParams.count > 0) {
        return flPathParams.count - 1;
    } else {
        return (tower.height - calcFirstHeight()) / flPathParams.steps;
    }
}

function calcFirstHeight() {
    return tower.height * flPathParams.heightFirst;
}

function calcRadius(C) {
    var H = tower.height;
    var d = tower.legs;
    var h = H - C;
    var Sb = (tower.type == '3 legged') ? (1.73 * (d * d)) / 4 : d * d;
    var Ss = (Sb * (h * h)) / (H * H);
    var dc = (tower.type == '3 legged') ? Math.sqrt(((4 * Ss) / 1.73)) : Math.sqrt(Ss);
    var Rc = (tower.type == '3 legged') ? (dc / 1.73) + 7 : (dc / 1.41) + 7;
    return Rc;
}

// Function for creating new records in CO Flight Path
function createParams(i) {
    var height = (i === 0) ? calcFirstHeight() : calcFirstHeight() + (flPathParams.steps * i),
        startPos = ctx.instance.getValueByField('start_position'),
        radius;

    if (tower.type == 'Rooftop' && startPos == 1) height += tower.heightBuilding;
    if (tower.type == 'Rapole' || tower.type == 'Monopole' || tower.type == 'Rooftop') {
        radius = flPathParams.radius;
    } else if (tower.type == '3 legged' || tower.type == '4 legged') {
        radius = calcRadius(height);
    }

    return {
        tower_audit_id: recId,
        action : "2",
        longitude: ctx.instance.getValueByField('sys_position_long'),
        latitude: ctx.instance.getValueByField('sys_position_lat'),
        altitude: Number((height + 0.001).toFixed(3)),
        radius_of_circle: Number((radius + 0.001).toFixed(3)),
        angle_of_displacement: flPathParams.angle,
        amount_of_displacements: flPathParams.offsets,
        amount_of_photos: flPathParams.photos,
        execution_order: i + 1
    };
}