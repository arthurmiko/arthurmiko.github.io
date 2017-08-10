var fields = [ 'antenna_type', 'customer', 'agl', 'azimuth',
        'diameter', 'height', 'width', 'latitude', 'longitude' ];
var needUpdate = false;
for ( var alias in fields ) {
    if ( ctx.instance.isChanged(fields[alias] ) ) {
        needUpdate = true;
        break;
    }
}

if (needUpdate) {
    var existAntennasModel = custom.getModelByAlias('existing_antennas_service'),
        currRecId = ctx.instance.getValueByField('id');
    var existAntennasRecs = existAntennasModel.find( {recognized_antenna: currRecId} );
    if ( !utils.isEmpty(existAntennasRecs) ) {
        updateRelatedList(existAntennasRecs);
    }
}

function updateRelatedList(recs) {
    var currRecValues = {
        antenna_type: ctx.instance.getValueByField('antenna_type'),
        owner: ctx.instance.getValueByField('customer'),
        height_from_ground: ctx.instance.getValueByField('agl'),
        azimuth: ctx.instance.getValueByField('azimuth'),
        diameter: ctx.instance.getValueByField('diameter'),
        antena_height: ctx.instance.getValueByField('height'),
        antena_width: ctx.instance.getValueByField('width')
    };

    var prop, relatedRecValues, boolResult,
        coords = {
            recognized: {
                lat: ctx.instance.getValueByField('latitude'),
                long: ctx.instance.getValueByField('longitude')
            }
        };

    for ( var record in recs ) {
        relatedRecValues = {
            antenna_type: recs[record].getValueByField('antenna_type'),
            owner: recs[record].getValueByField('owner'),
            height_from_ground: recs[record].getValueByField('height_from_ground'),
            azimuth: recs[record].getValueByField('azimuth'),
            diameter: recs[record].getValueByField('diameter'),
            antena_height: recs[record].getValueByField('antena_height'),
            antena_width: recs[record].getValueByField('antena_width')
        };

        for ( prop in currRecValues ) {
            boolResult = checkMatchForDuplicate( prop, currRecValues[prop], relatedRecValues[prop] );
            recs[record].setValueToField( prop + '_bool', boolResult );
        }

        coords.exist = {
            lat: recs[record].getValueByField('sys_position_lat'),
            long: recs[record].getValueByField('sys_position_long')
        };
        coords.radius = getRadiusByCoords( coords.recognized, coords.exist );
        coords.distance = getDistanceByLength( coords.radius,
            currRecValues.height_from_ground, relatedRecValues.height_from_ground );
        recs[record].setValueToField( 'distance', coords.distance );

        nascUtils.quickSave( recs[record] );
    }
}

// Calculation functions

function checkMatchForDuplicate(alias, existValue, recognizedValue) {
    if ( alias == 'antenna_type' || alias == 'owner' ) {
        return ( existValue == recognizedValue );
    } else if ( alias == 'height_from_ground' ) {
        return ( Math.abs( existValue - recognizedValue ) < 0.25 );
    } else if ( alias == 'azimuth' ) {
        return azimuthCheck( existValue, recognizedValue );
    } else if ( alias == 'antena_height' || alias == 'antena_width') {
        return ( Math.abs( existValue - recognizedValue ) < 0.05 );
    } else if ( alias == 'diameter' ) {
        return ( Math.abs( existValue - recognizedValue ) < 0.02 );
    }
}

function azimuthCheck(a, b) {
    a = ( a >= 0 ) ? a : 360 + a;
    b = ( b >= 0 ) ? b : 360 + b;
    var max = Math.max(a, b),
        min = Math.min(a, b),
        dif = max - min,
        result;

    if ( dif <= 180 || dif == 0 ) {
        result = max - min;
    } else if (dif > 180) {
        result = (360 - max) + min;
    }
    return result < (3.6 * 5);
}

function getRadiusByCoords( p1, p2 ) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad( p2.lat - p1.lat );
    var dLong = rad( p2.long - p1.long );
    var a = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
        Math.cos( rad( p1.lat ) ) * Math.cos( rad( p2.lat ) ) *
        Math.sin( dLong / 2 ) * Math.sin( dLong / 2 );
    var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt( 1 - a ) );
    var d = R * c;
    return d; // returns the distance in meter
}

function getDistanceByLength( cathetusA, altA, altB) {
    var cathetusB = altA - altB;
    var hypotenuse = Math.sqrt( Math.pow( cathetusA, 2 ) + Math.pow( cathetusB, 2 ) );
    return Math.round( hypotenuse * 100 ) / 100;
}

function rad(x) {
    return x * Math.PI / 180;
}