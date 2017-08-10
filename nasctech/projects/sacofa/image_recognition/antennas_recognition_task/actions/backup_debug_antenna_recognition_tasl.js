var debugTimeStart = dt.now().getTime(),
    debugCountAntenna = 0;
var CMD_TIMEOUT = 600,
    PRECISE = 10000000000; // 10 digits after comma

logger( 'AM start recognition: ' + dt.now() );
var towerEqptModel = custom.getModelByAlias('tower_eqpt'),
    tasksModel = custom.getModelByAlias('antennas_recognition_task'),
    antennasModel = custom.getModelByAlias('recognised_antennas'),
    attachModel = custom.getModelByAlias('attachment'),
    existingAntennasServiceModel = custom.getModelByAlias('existing_antennas_service'),
    versionModel = custom.getModelByAlias('versions_control'),

    regPath = /(path":")(.+?)(\.JPG)/gi,
    clearSlash = /\\/g,
    host = '46.101.97.94:8080',
    skipProperties = ['towerGPS', 'towerId', 'towerAuditId'],
    versionControl = {
        flight: getVersion(1),
        server: getVersion(2),
        task: getVersion(3)
    };

var mainHash = prepareMainHash();
if ( !utils.isEmpty(mainHash) ) {
    prepareAndExecuteRequests_GetUniqueAntenna();
    createRecordsInSL();
}

tasksModel.massUpdate({status: 2}, {status: 1});

logger( JSON.stringify(mainHash).replace( clearSlash, '' ) );

var debugTimeTotal = Math.round( ( dt.now().getTime() - debugTimeStart ) / 1000 );
logger( 'AM end of recognition: ' + dt.now()
    + ' \nExecution time (seconds): ' + debugTimeTotal
    + ' \nAntennas recognized: ' + debugCountAntenna );

actions.redirectToUrl('http://srv-005.nasctech.com/co/antennas_recognition_task/grid/view_all');

// =============================== FUNCTIONS

// =======================================
// START prepareMainHash with dependencies
// =======================================

/** 
 *  @result {object} 
 *  tower audit data id:
 *      towerGPS:
 *      altitude of task:
 *          request:
 *          task id:
 *              photoGPS:
 *              names of image files on recognition server:
 *                  centerX:
 *                  contours:
 *          task id:
 *          ...
 *          task id:
 *      altitude of task:
 *      ...
 *      altitude of task:
 *  tower audit data id:
 *  ...
 *  tower audit data id:
 */
function prepareMainHash() {
    var result = null;
    var records = tasksModel.execQuery( {where: {status: 1}} ); // 1 - New

    if ( !utils.isEmpty(records) ) {
        var taskAttachments, parentId, taskAlt, taskId, commonAlt, keyAlt, recAndAttachments;

        result = {};
        for ( var task in records ) {
            logger( 'AM start handle task num: ' + ( Number(task) + 1 ) );
            taskAttachments = records[task].getAttachments();
            if ( utils.isEmpty(taskAttachments) ) continue;
            parentId = records[task].getValueByField('tower_audit_data');
            taskAlt = records[task].getValueByField('altitude');
            taskId = records[task].getValueByField('id');

            commonAlt = null;
            // AM FIXME лучше использовать Object.keys
            for ( keyAlt in result[parentId] ) {
                if ( skipProperties.indexOf(keyAlt) > -1 ) continue;
                if ( Math.abs( taskAlt - Number(keyAlt) ) < 0.5 ) {
                    commonAlt = keyAlt;
                    break;
                }
            }
            if ( !commonAlt ) commonAlt = taskAlt;
            recAndAttachments = {
                record: records[task],
                attachments: taskAttachments
            };

            if ( result[ parentId ] ) {
                if ( result[ parentId ][ commonAlt ] ) {
                    result[ parentId ][ commonAlt ][ taskId ] = getPrimaryRecognition( recAndAttachments );
                } else {
                    result[ parentId ][ commonAlt ] = {};
                    result[ parentId ][ commonAlt ][ taskId ] = getPrimaryRecognition( recAndAttachments );
                }
            } else {
                result[ parentId ] = getTowerInfo( records[task] );
                result[ parentId ][ commonAlt ] = {};
                result[ parentId ][ commonAlt ][ taskId ] = getPrimaryRecognition( recAndAttachments );
            }
        }

    } else {
        logger( 'Recognition task: no records with status "new".' );
    }
    return result;
}

function getTowerInfo(task) {
    var result = {};
    var towerId = task.getValueByField('tower_id');
    var towerRec = towerEqptModel.find({id: towerId})[0];
    if ( !utils.isEmpty(towerRec) ) {
        result.towerGPS = {
            latitude: towerRec.getValueByField('sys_position_lat'),
            longitude: towerRec.getValueByField('sys_position_long'),
            altitude: 0
        };
        result.towerId = towerId;
        result.towerAuditId = task.getValueByField('tower_audit_id');
    }
    return result;
}

function getPrimaryRecognition(input) {
    var result = {}, imgName, attach, centerAndContours;

    for ( attach in input.attachments ) {
        result[ uploadImg( input.record, input.attachments[attach] ) ] = true;
    }

    for ( imgName in result ) {
        centerAndContours = {};
        centerAndContours.mathTowerCenter = getCenter(imgName);
        centerAndContours.contours = getContours( imgName, centerAndContours.mathTowerCenter );
        result[imgName] = centerAndContours;
    }

    result['photoGPS'] = JSON.parse( input.record.getValueByField('drone_coords') );
    return result;
}

function uploadImg(rec, attach) {
    var fileName = attach.getValueByField('file_file_name');
    var path = rec.getAttachmentPath(fileName);
    var reqUpload = 'curl -i -X POST -H "Content-Type: multipart/form-data" -F file=@'
        + path + ' http://' + host + '/upload/';
    logger( 'AM reqUpload: ' + reqUpload );

    var resUpload = utils.cmd.run(reqUpload, CMD_TIMEOUT);
    if ( resUpload ) logger( 'AM resUpload: ' + resUpload );
    resUpload = regPath.exec(resUpload)[2];
    regPath.lastIndex = 0;
    return resUpload;
}

function getCenter(imgName) {
    var reqCenter = 'curl -X POST -H "Content-Type: application/json" -d \''
        + '{"file":"' + imgName + '","step":50,"useHalfImage":true,"value":1300,"debugMode":true}\' '
        + 'http://' + host + '/centerdetect';
    logger( 'AM reqCenter: ' + reqCenter );
    var resCenter = utils.cmd.run(reqCenter, CMD_TIMEOUT);

    logger( 'AM resCenter:' + resCenter );
    if (resCenter) {
        resCenter = JSON.parse( resCenter.match( /\{".+?\]\}/ ) );
        if (resCenter) return resCenter.centerX;
    }
    return null;
}

function getContours(imgName, center) {
    var reqContours = 'curl -X POST -H "Content-Type: application/json" -d \''
        + '{"hash" :"' + imgName + '", "halfTowerWidth" : 900, "deadZonePercent" : 15.0, '
        + '"centerX" : ' + center + ', "pixelNoise" : 8, "pixelSize" : 10, "minimumWidth" : 50, '
        + '"maximumWidth" : 200, "minimumHeight" : 500, "maximumHeight" : 2000, '
        + '"stepRotateDegree" : 0.2, "maxRotateDegree" : 4.0, "debugMode":true}\' '
        + 'http://' + host + '/getContours';
    logger( 'AM reqContours: ' + reqContours );

    var resContours = utils.cmd.run(reqContours, CMD_TIMEOUT);
    logger( 'AM resContours:' + resContours );
    if (resContours) {
        resContours = JSON.parse( resContours.match( /\[\{.+?\}\}\]/ ) );
        if (resContours) return clearContours(resContours);
    }
    return null;
}

function clearContours(contours) {
    var result = [], tmp;
    for (var cont in contours) {
        tmp = {
            mathCenter: contours[cont].mathCenter,
            mathPoints: contours[cont].mathPoints
        };
        result.push(tmp);
    }
    return result;
}

// =======================================
// END prepareMainHash with dependencies
// =======================================

// =======================================
// START prepareAndExecuteRequests_GetUniqueAntenna with dependencies
// =======================================

function prepareAndExecuteRequests_GetUniqueAntenna() {
    var alt, tower;
    for ( var towerId in mainHash ) {
        tower = mainHash[towerId];
        for ( alt in tower ) {
            if ( skipProperties.indexOf(alt) > -1 ) continue;
            tower[alt].request = prepareRequestForOneAlt( tower[alt], tower.towerGPS );
            tower[alt].response = executeRequestForOneAlt( tower[alt].request );
        }
    }
}

function prepareRequestForOneAlt( altObj, towerGPS ) {
    var reqParams = {
        photoDataList: [],
        towerGPS: towerGPS,
        errors: {
            altitude: 0.5,
            distance: 1,
            height: 0.8,
            width: 0.2
        },
        horizontalCameraAngle: 90,
        maxPhotoSequence: 5,
        towerAntennaOffset: 0.5,
        verticalCameraAngle: 57,
        showFullPhoto: false,
        pixelCut: 50
    };

    var photoHash, photoData;
    for ( var task in altObj ) {
        for ( photoHash in altObj[task] ) {
            if ( photoHash == 'photoGPS' ) continue;
            if ( !altObj[task][photoHash].contours ) continue;
            photoData = {
                hash: photoHash,
                photoGPS: altObj[task].photoGPS,
                mathTowerCenter: altObj[task][photoHash].mathTowerCenter,
                contours: altObj[task][photoHash].contours
            };
            reqParams.photoDataList.push( photoData );
        }
    }

    var request = 'curl -X POST -H "Content-Type: application/json" -d \''
        + JSON.stringify(reqParams) + '\' '
        + 'http://' + host + '/getUniqueAntenna';
    if ( reqParams.photoDataList.length > 0 ) {
        return request;
    } else {
        logger( 'prepareRequestForOneAlt: photoDataList is empty' );
        return null;
    }
}

function executeRequestForOneAlt( request ) {
    if ( request ) {
        logger( 'AM reqAlt: ' + request );
        var resAlt = utils.cmd.run(request, CMD_TIMEOUT); // AM FIXME сделать глобальным
        logger( 'AM resAlt: ' + resAlt );
        if (resAlt) {
            resAlt = JSON.parse( resAlt.match( /\{".+?towerAntennaOffset.+?\}/ ) );
            return resAlt;
        }
    }
    return null;
}

// =======================================
// END prepareAndExecuteRequests_GetUniqueAntenna with dependencies
// =======================================

// =======================================
// START createRecordsInSL with dependencies
// =======================================

function createRecordsInSL() {
    logger( 'START createRecordsInSL: ' + dt.now() );
    logger( JSON.stringify(mainHash).replace( clearSlash, '' ) );
    var alt, altObj, towerInfo;
    for ( var towerAuditDataId in mainHash ) {
        for ( alt in mainHash[towerAuditDataId] ) {
            if ( skipProperties.indexOf(alt) > -1 ) continue;
            altObj = mainHash[towerAuditDataId][alt];
            if ( utils.isEmpty( altObj.response ) ) continue;

            if ( altObj.response.uniqueAntennas.length > 0 ) {
                towerInfo = {
                    towerAuditDataId: towerAuditDataId,
                    towerGPS: mainHash[towerAuditDataId].towerGPS,
                    towerId: mainHash[towerAuditDataId].towerId,
                    lastId: getLastRecognisedAntennaId(towerAuditDataId)
                };
                handleUniqueAntennas( altObj.response.uniqueAntennas, towerInfo );
            }
        }
    }
    logger( 'END createRecordsInSL: ' + dt.now() );
}

function getLastRecognisedAntennaId(towerAuditDataId) {
    logger( 'START getLastRecognisedAntennaId: ' + dt.now() );

    /* поиск последней записи Recognised antenna для текущего Tower Audit Data
       нужно в последствии для работы actions "Prev", "Next" */
    var antennasModelQuery = antennasModel.createQuery();
    antennasModelQuery.getFields( ['id'] );
    antennasModelQuery.setLimit(1);
    antennasModelQuery.addCondition( {tower_audit_data: towerAuditDataId} );
    antennasModelQuery.orderBy('id', 'desc');
    var lastRecognisedAntennaRecId = antennasModelQuery.exec();
    // AM lastRecognisedAntennaRecId => [{id: 465}] ||| Разве здесь не должен быть объект записи?

    if ( !utils.isEmpty(lastRecognisedAntennaRecId) ) {
        // lastRecognisedAntennaRecId = lastRecognisedAntennaRecId.getValueByField('id');
        lastRecognisedAntennaRecId = lastRecognisedAntennaRecId.id;
    } else {
        lastRecognisedAntennaRecId = null;
    }
    logger( 'END getLastRecognisedAntennaId: ' + dt.now() );
    return lastRecognisedAntennaRecId;
}

function handleUniqueAntennas( uniqueAntennas, towerInfo ) {
    logger( 'START handleUniqueAntennas: ' + dt.now() );
    var singleAntenna, status, existingAntennas, newRec, specs, pathToFile;
    for (var antenna in uniqueAntennas ) {
        debugCountAntenna += 1;
        singleAntenna = uniqueAntennas[antenna];
        if ( singleAntenna.id < 0 ) continue;

        pathToFile = 'http://46.101.97.94:8080/files/' + singleAntenna.hash + '.JPG';
        utils.cmd.run( 'curl -o /tmp/' + singleAntenna.hash +  '.JPG ' + pathToFile, CMD_TIMEOUT );

        specs = {
            lat: singleAntenna.center.latitude,
            lng: singleAntenna.center.longitude,
            alt: singleAntenna.center.altitude,
            width: singleAntenna.width,
            height: singleAntenna.height,
            diameter: null, // temporary unavailable in API
            azimuth: singleAntenna.azimuth,
            type: 'RF antenna' // temporary unavailable in API
        };

        existingAntennas = getExistingAntennas( specs, towerInfo.towerId );

        status = ( existingAntennas.length > 0 ); // True: Existing, False: New
        newRec = createNewRecognisedAntennaRec( specs, towerInfo, singleAntenna.hash, status );

        if ( newRec.isValid() ) {
            recordPostProcessing(newRec, existingAntennas, towerInfo, specs);
        } else {
            logger( 'Error when create new recognised antenna record' );
            continue;
        }
    }
    logger( 'END handleUniqueAntennas: ' + dt.now() );
}

function getExistingAntennas(specs, towerId) { // AM FIXME
    logger( 'START getExistingAntennas: ' + dt.now() );
    var eqptQuery = towerEqptModel.createQuery();
    eqptQuery.getFields(['antenna_type', 'owner', 'height_from_ground', 'azimuth',
        'diameter', 'antena_height', 'antena_width', 'center_alt']);
    eqptQuery.setLimit(0);
    eqptQuery.addCondition('parent_tower', towerId)
             .addAndCondition('height_from_ground', '>', specs.alt - 0.5) // есть ещё center_alt
             .addAndCondition('height_from_ground', '<', specs.alt + 0.5) // вопрос к высоте над уровнем моря

             // margin of error for azimuth 5% | 3.6 deg = 1% from 360 deg
             .addAndCondition('azimuth', '>', specs.azimuth - (3.6 * 2.5) )
             .addAndCondition('azimuth', '<', specs.azimuth + (3.6 * 2.5) );

    var sqlReq = '6378000 *' +
        'acos(' +
            'cos( radians( ' + specs.lat + ' ) )' +
          '* cos( radians( sys_position_lat ) )' + // center_lat
          '* cos( radians( sys_position_long ) - radians( ' + specs.lng + ' ) )' + // center_lng
          '+ sin( radians( ' + specs.lat + ' ) )' +
          '* sin( radians( sys_position_lat ) )' + // center_lat
        ')';

    var strSql = sqlReq.toString(); // need to 'feature' java ConsString type
    eqptQuery.addFields({"radius": strSql});
    eqptQuery.having('radius', '<', '1 / 2');
    logger( 'END getExistingAntennas: ' + dt.now() );
    return eqptQuery.exec();
}

function createNewRecognisedAntennaRec( specs, towerInfo, hash, status ) {
    logger( 'START createNewRecognisedAntennaRec: ' + dt.now() );
    
    var newRec = antennasModel.build({
        // degree: data.heading, // not actual?
        // recognition_task: data.taskRecordId, // can't recieved now from API
        tower_audit_data: towerInfo.towerAuditDataId,
        latitude: towerInfo.towerGPS.latitude,
        longitude: towerInfo.towerGPS.longitude,
        altitude: ( Math.round( specs.alt * PRECISE ) / PRECISE ), // not sure
        agl: ( Math.round( specs.alt * PRECISE ) / PRECISE ), // not sure
        tower_id: towerInfo.towerId,
        tower_audit: towerInfo.towerAuditId,
        antenna_type: specs.type,
        antenna_status: status ? 2 : 1, // 1: New, 2: Existing
        width: ( Math.round( specs.width * PRECISE ) / PRECISE ),
        height: ( Math.round( specs.height * PRECISE ) / PRECISE ),
        diameter: specs.diameter,
        azimuth: ( Math.round( specs.azimuth * PRECISE ) / PRECISE ),
        center_lat: ( Math.round( specs.lat * PRECISE ) / PRECISE ),
        center_lng: ( Math.round( specs.lng * PRECISE ) / PRECISE ),
        center_alt: ( Math.round( specs.alt * PRECISE ) / PRECISE ),
        recognition_server_config_version: versionControl.server,
        recognition_task_config_version: versionControl.task,
        flight_config_version: versionControl.flight
    });

    logger( 'newRec:' + JSON.stringify(newRec) );
    if ( towerInfo.lastId ) newRec.setValueToField( 'prev_record', towerInfo.lastId );
    newRec.addAttachments( utils.fileToAttachment( '/tmp/' + hash +  '.JPG' ) );
    nascUtils.quickSave(newRec);
    logger( 'END createNewRecognisedAntennaRec: ' + dt.now() );
    if ( !newRec.isValid() ) {
        logger( 'newRec errors: ' + newRec.getErrors() );
    } else {
        return newRec;
    }
}

// создаёт вложения и дублирует записи антенн из Tower Equipments в Tower Audit Data
function recordPostProcessing(newRec, existingAntennas, towerInfo, specs) {
    logger( 'START recordPostProcessing: ' + dt.now() );
    var newRecId = newRec.getValueByField('id');

    /* AM dirty code for update status because of
    massUpdate isn't work with 'ISNULL' status in attachments model*/
    var recognizedAttachmentsId = utils.getResultValues( newRec.getAttachments(), 'id' );
    updateAttachments( recognizedAttachmentsId, 'Recognized', null );

    var existAttachments = [], existAntennaId, existAttachmentsId, recognizedIndex, newRecAttachments;
    for ( var record in existingAntennas ) {
        existAntennaId = existingAntennas[record].getValueByField('id');
        existAttachments = existingAntennas[record].getAttachments();
        newRec.linkAttachments(existAttachments);
        newRecAttachments = newRec.getAttachments();

        existAttachmentsId = utils.getResultValues( newRecAttachments, 'id' );
        if (recognizedAttachmentsId.length > 0) {
            recognizedIndex = existAttachmentsId.indexOf( recognizedAttachmentsId[0] );
            existAttachmentsId.splice( recognizedIndex, 1 );
        }
        updateAttachments( existAttachmentsId, 'Existing', existAntennaId );
    }

    duplicateExistingAntennas( existingAntennas, specs, newRecId );
    if ( towerInfo.lastId ) antennasModel.massUpdate( {next_record: newRecId}, {id: towerInfo.lastId} );
    towerInfo.lastId = newRecId;
    logger( 'END recordPostProcessing: ' + dt.now() );
}

function updateAttachments(ids, status, antennaId ) {
    logger( 'START updateAttachments: ' + dt.now() );
    var updateRes = attachModel.massUpdate(
        {'antenna_status': status,
         'antenna_id': antennaId},
        {'id': ids} );
    if ( !utils.isEmpty(updateRes.getErrors()) ) {
        logger( 'Cannot update Attachment record values. Errors: '
            + updateRes.getErrors() );
    }
    logger( 'END updateAttachments: ' + dt.now() );
}

function duplicateExistingAntennas( existing, specs, parentId ) {
    logger( 'START duplicateExistingAntennas: ' + dt.now() );
    var fields = [ 'antenna_type', 'antenna_type_bool', 'owner', 'owner_bool', 
        'height_from_ground', 'height_from_ground_bool', 'azimuth', 'azimuth_bool',
        'diameter', 'diameter_bool', 'antena_height', 'antena_height_bool',
        'antena_width', 'antena_width_bool', 'distance', 'recognized_antenna', 'parent_type' ],
        values = [], alias, singleRecValues, tmpValue, match,
        recognisedValue = {
            antenna_type: specs.type,
            owner: null,
            height_from_ground: specs.alt,
            azimuth: specs.azimuth,
            diameter: specs.diameter,
            antena_height: specs.height,
            antena_width: specs.width
        };

    for ( var i in existing ) {
        singleRecValues = [];
        for ( alias = 0; alias < fields.length - 2; alias++ ) {
            if ( fields[alias].slice(-5) != '_bool' ) {
                tmpValue = existing[i].getValueByField( fields[alias] );
                match = tmpValue == recognisedValue[ fields[alias] ];
                singleRecValues.push( tmpValue, match );
            }
        }
        singleRecValues.push( getDistanceByLength( existing[i], specs ), parentId, 'Recognized antennas' );
        values.push(singleRecValues);
    }

    var data = {'fields': fields, 'values': values};
    logger( JSON.stringify(data) );
    if ( values.length > 0 ) {
        var objResult = existingAntennasServiceModel.massCreate(data);
        if ( objResult.getResult() === false ) {
            logger( 'Error while create records in CO "Existing Antennas service" '
                + objResult.getErrors() );
        }
    } else {
        logger( 'There is no existing antennas.' );
    }
    logger( 'END duplicateExistingAntennas: ' + dt.now() );
}

function getDistanceByLength(existing, specs) {
    logger( 'START getDistanceByLength: ' + dt.now() );
    var cathetusA = existing.getValueByField('radius'),
        cathetusB = existing.getValueByField('center_alt') - specs.alt;
    var hypotenuse = Math.sqrt( Math.pow( cathetusA, 2 ) + Math.pow( cathetusB, 2 ) );
    logger( 'END getDistanceByLength: ' + dt.now() );
    return Math.round( hypotenuse * 100) / 100;
}

// =======================================
// END createRecordsInSL with dependencies
// =======================================

function getVersion(type) {
    var query = versionModel.createQuery();
    query.getFields(['id', 'config_no', 'config_version']);
    query.addCondition('config_type', type);
    query.setLimit(1);
    query.orderBy('id', 'desc');
    return query.exec()[0].getValueByField('config_version');
}

function logger(msg) {
    if ( true ) utils.addLogRecord(msg, 1);
}