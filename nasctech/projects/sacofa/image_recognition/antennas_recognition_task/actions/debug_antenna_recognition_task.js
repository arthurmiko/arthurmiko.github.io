var debugTimeStart = dt.now().getTime(),
    debugCountAntenna = 0;
var CMD_TIMEOUT = 600,
    PRECISE_10 = 10000000000, // 10 digits after comma
    PRECISE_2 = 100; // 2 digits after comma

logger( 'Image Rec. | START of recognition: ' + dt.now() );
var towerEqptModel = custom.getModelByAlias('tower_eqpt'),
    tasksModel = custom.getModelByAlias('antennas_recognition_task'),
    attachModel = custom.getModelByAlias('attachment'),
    versionModel = custom.getModelByAlias('versions_control'),
    towerAuditDataModel = custom.getModelByAlias('tower_audit_data'),
    towerAuditDataModelId = custom.getId('tower_audit_data'),

    taskMinAlt, tasksSameAlt, completedIds, completedId, completedRec,
    query, queryResult, resAlt, reqAlt,
    regPath = /(path":")(.+?)(\.JPG)/gi,
    clearSlash = /\\/g,
    host = '46.101.97.94:8080',
    versionControl = {
        flight: getVersion(1),
        server: getVersion(2),
        task: getVersion(3)
    },
    reqContoursParams = {
        halfTowerWidth: 1000,
        deadZonePercent: 20,
        pixelNoise: 8,
        pixelSize: 10,
        minimumWidth: 50,
        maximumWidth: 150,
        minimumHeight: 500,
        maximumHeight: 1100,
        stepRotateDegree: 0.2,
        maxRotateDegree: 4,
        ellipseScaleFactor: 3,
        ellipseMinimumWidth: 80,
        ellipseMaximumWidth: 800,
        ellipseMinimumHeight: 80,
        ellipseMaximumHeight: 800,
        debugMode: true
    },
    reqAltParams = {
        photoDataList: [],
        errorsRF: {
            altitude: 0.5,
            distance: 1,
            height: 0.8,
            width: 0.2
        },
        errorsMW: {
            altitude: 0.5,
            distance: 1,
            radius: 0.8
        },
        horizontalCameraAngle: 90,
        maxPhotoSequence: 5,
        towerAntennaOffset: 2.75,
        verticalCameraAngle: 57,
        showFullPhoto: true,
        pixelCut: 50
    };

var taskMinId = getTaskMinId(),
    mainHash;

var safer = 0;
if (taskMinId) {
    while ( taskMinId && safer < 2 ) {
        safer += 1; // AM prevent infinity loop. Remove with caution
        logger( 'Image Rec. | START while at: ' + dt.now() );
        mainHash = {};
        taskMinAlt = getTaskMinAlt( taskMinId );
        tasksSameAlt = getTasksSameAlt( taskMinId, taskMinAlt );

        mainHash = prepareMainHash( tasksSameAlt, taskMinId );
        if ( !utils.isEmpty(mainHash) ) {
            prepareAndExecuteRequests_GetUniqueAntenna();
            createRecordsInSL();
        }

        completedIds = utils.getResultValues( tasksSameAlt, 'id' );
// Should be like this, but because of bug in SL make "for cycle"
//  massUpdateResult = tasksModel.massUpdate(
//      {status: 2}, // Processed
//      {id: completedIds}
//  );
        for ( completedId in completedIds ) {
            completedRec = tasksModel.find( {id: completedIds[completedId]} )[0];
            completedRec.setValueToField( 'status', 2 ); // Processed
            completedRec.exSave({doNotCheckMandatoryFields: true});
        }

        taskMinId = getTaskMinId();
        logger( 'Image Rec. | END while at: ' + dt.now() );
    }
} else {
    logger( 'Image Rec. | There is no records for recognition' );
}

var debugTimeTotal = Math.round( ( dt.now().getTime() - debugTimeStart ) / 1000 );
logger( 'Image Rec. | END of recognition: ' + dt.now()
    + ' \nExecution time (seconds): ' + debugTimeTotal
    + ' \nAntennas recognized: ' + debugCountAntenna );

actions.redirectToUrl('http://srv-005.nasctech.com/co/antennas_recognition_task/grid/view_all');

// =============================== FUNCTIONS

// ==============================================
// START getTasks
// 
// Перебор записей происходит от ранее загруженных Tower Audit Data к поздним
// Выборка высот - снизу вверх, от минимальной + 1 метр
// ==============================================

function getTasksSameAlt(minId, minAlt) {
    query = tasksModel.createQuery();
    query.getAllFields();
    query.setLimit(0);
    query.addCondition( {status: 1} ) // New
        .addAndCondition( 'tower_audit_data', minId )
        .addAndCondition( 'altitude', '<', minAlt + 1 );
    return query.exec();
}

function getTaskMinAlt(minId) {
    query = tasksModel.createQuery();
    query.getFields( ['altitude'] );
    query.setLimit(1);
    query.addCondition( {status: 1} ) // New
        .addAndCondition( {tower_audit_data: minId} );
    query.orderBy('altitude', 'asc');
    queryResult = query.exec();
    return queryResult[0].getValueByField('altitude');
}

function getTaskMinId() {
    query = tasksModel.createQuery();
    query.getFields( ['id', 'tower_audit_data', 'status'] );
    query.setLimit(1);
    query.addCondition( {status: 1} ); // New
    query.orderBy('tower_audit_data', 'asc');
    queryResult = query.exec();
    if ( queryResult.length > 0 ) {
        return queryResult[0].getValueByField('tower_audit_data');
    } else {
        return null;
    }
}

// ==============================================
// END getTasks
// ==============================================

// ==============================================
// START prepareMainHash with dependencies
// ==============================================

function prepareMainHash( records, parentId ) {
    logger( 'Image Rec. | START prepareMainHash\n records: ' + JSON.stringify(records)
        + '\n parentId: ' + parentId );
    var result = getTowerInfo( records[0] );
    result.parentId = parentId;
    result.tasks = {};

    var taskAttachments, taskId, recAndAttachments;
    for ( var task in records ) {
        taskAttachments = records[task].getAttachments();
        if ( utils.isEmpty(taskAttachments) ) continue;
        taskId = records[task].getValueByField('id');

        recAndAttachments = {
            record: records[task],
            attachments: taskAttachments
        };

        result.tasks[ taskId ] = getPrimaryRecognition( recAndAttachments );
    }

    logger( 'Image Rec. | END prepareMainHash\n result: ' + JSON.stringify(result) );
    return result;
}

function getTowerInfo(task) {
    var result = {};
    var towerId = task.getValueByField('tower_id');
    var towerRec = towerEqptModel.find( {id: towerId} )[0];
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
    logger( 'Image Rec. | reqUpload: ' + reqUpload );

    var resUpload = utils.cmd.run(reqUpload, CMD_TIMEOUT);
    if ( resUpload ) logger( 'Image Rec. | resUpload: ' + resUpload );
    resUpload = regPath.exec(resUpload)[2];
    regPath.lastIndex = 0;
    return resUpload;
}

function getCenter(imgName) {
    var reqCenter = 'curl -X POST -H "Content-Type: application/json" -d \''
        + '{"file":"' + imgName + '","step":50,"useHalfImage":true,"value":1300,"debugMode":true}\' '
        + 'http://' + host + '/centerdetect';
    logger( 'Image Rec. | reqCenter: ' + reqCenter );
    var resCenter = utils.cmd.run(reqCenter, CMD_TIMEOUT);

    logger( 'Image Rec. | resCenter:' + resCenter );
    if (resCenter) {
        resCenter = JSON.parse( resCenter.match( /\{".+?\]\}/ ) );
        if (resCenter) return resCenter.centerX;
    }
    return null;
}

function getContours(imgName, center) {
    reqContoursParams.hash = imgName;
    reqContoursParams.centerX = center;
    var reqContours = 'curl -X POST -H "Content-Type: application/json" -d \''
            + JSON.stringify(reqContoursParams) + '\' '
            + 'http://' + host + '/getContours';
    logger( 'Image Rec. | reqContours: ' + reqContours );

    var resContours = utils.cmd.run(reqContours, CMD_TIMEOUT);
    logger( 'Image Rec. | resContours:' + resContours );
    if (resContours) {
        resContours = JSON.parse( resContours.match( /\{".+?\]\}/ ) );
        if (resContours) return clearContours(resContours);
    }
    return null;
}

function clearContours(contours) {
    var result = { RF: [], MW: [] }, tmp, i;
    for (var type in contours) {
        if ( type == 'contoursRF' ) {
            for ( i in contours[type] ) {
                tmp = {
                    mathCenter: contours[type][i].mathCenter,
                    mathPoints: contours[type][i].mathPoints
                };
                result.RF.push(tmp);
            }
        } else if ( type == 'contoursMW' ) {
            for ( i in contours[type] ) {
                tmp = {
                    mathCenter: contours[type][i].mathCenter,
                    angle: contours[type][i].angle,
                    minorRadius: contours[type][i].minorRadius,
                    majorRadius: contours[type][i].majorRadius
                };
                result.MW.push(tmp);
            }
        }
    }
    return result;
}

// ==============================================
// END prepareMainHash with dependencies
// ==============================================

// ==============================================
// START prepareAndExecuteRequests_GetUniqueAntenna with dependencies
// ==============================================

function prepareAndExecuteRequests_GetUniqueAntenna() {
    logger( 'Image Rec. | START prepareAndExecuteRequests_GetUniqueAntenna' );
    mainHash.request = prepareRequestForOneAlt( mainHash.tasks, mainHash.towerGPS );
    mainHash.response = executeRequestForOneAlt( mainHash.request );
    logger( 'Image Rec. | END prepareAndExecuteRequests_GetUniqueAntenna' );
}

function prepareRequestForOneAlt( oneAltTasks, towerGPS ) {
    logger( 'Image Rec. | START prepareRequestForOneAlt\n' + 'oneAltTasks: '
        + JSON.stringify(oneAltTasks) + '\ntowerGPS: ' + JSON.stringify(towerGPS) );
    reqAltParams.photoDataList = [];
    reqAltParams.towerGPS = towerGPS;

    var photoHash, photoData;
    for ( var task in oneAltTasks ) {
        for ( photoHash in oneAltTasks[task] ) {
            if ( photoHash == 'photoGPS' ) continue;
            if ( !oneAltTasks[task][photoHash].contours ) continue;
            photoData = {
                hash: photoHash,
                photoGPS: oneAltTasks[task].photoGPS,
                mathTowerCenter: oneAltTasks[task][photoHash].mathTowerCenter,
                contoursRF: oneAltTasks[task][photoHash].contours.RF,
                contoursMW: oneAltTasks[task][photoHash].contours.MW
            };
            reqAltParams.photoDataList.push( photoData );
        }
    }

    reqAlt = 'curl -X POST -H "Content-Type: application/json" -d \''
        + JSON.stringify(reqAltParams) + '\' '
        + 'http://' + host + '/getUniqueAntenna';
    if ( reqAltParams.photoDataList.length > 0 ) {
        logger( 'Image Rec. | END prepareRequestForOneAlt\n reqAlt: ' + reqAlt );
        return reqAlt;
    } else {
        logger( 'Image Rec. | prepareRequestForOneAlt: photoDataList is empty' );
        return null;
    }
}

function executeRequestForOneAlt( request ) {
    logger( 'Image Rec. | START executeRequestForOneAlt' );
    if ( request ) {
        resAlt = utils.cmd.run(request, CMD_TIMEOUT);
        logger( 'Image Rec. | resAlt: ' + resAlt );
        if (resAlt) {
            resAlt = JSON.parse( resAlt.match( /\{".+?towerAntennaOffset.+?\}/ ) );
            logger( 'Image Rec. | END executeRequestForOneAlt: parsed ok' );
            return resAlt;
        }
    }
    logger( 'Image Rec. | END executeRequestForOneAlt: returned null' );
    return null;
}

// ==============================================
// END prepareAndExecuteRequests_GetUniqueAntenna with dependencies
// ==============================================

// =======================================
// START createRecordsInSL with dependencies
// =======================================

function createRecordsInSL() {
    logger( 'START createRecordsInSL: ' + dt.now() );
    logger( JSON.stringify(mainHash).replace( clearSlash, '' ) );
    if ( mainHash.response.uniqueAntennas.length > 0 ) {
        var towerInfo = {
            towerAuditDataId: mainHash.parentId,
            towerGPS: mainHash.towerGPS,
            towerId: mainHash.towerId
        };
        setPhotoTypeInAttachs( mainHash.parentId, 'Source' );
        handleUniqueAntennas( mainHash.response.uniqueAntennas, towerInfo );
    }
    logger( 'END createRecordsInSL: ' + dt.now() );
}

function handleUniqueAntennas( uniqueAntennas, towerInfo ) {
    logger( 'START handleUniqueAntennas: ' + dt.now() );
    var singleAntenna, status, specs, pathToFile,
        parentRec = towerAuditDataModel.find({id: towerInfo.towerAuditDataId})[0];

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
            azimuth: singleAntenna.azimuth,
        };
        if ( Object.keys(singleAntenna).indexOf('radius') < 0 ) {
            specs.width = singleAntenna.width;
            specs.height = singleAntenna.height;
            specs.type = 'RF antenna';
        } else {
            specs.diameter = singleAntenna.radius * 2;
            specs.type = 'Microwave antenna';
        }

        createNewRecognisedAntennaRec( parentRec, specs, towerInfo, singleAntenna.hash, status );
    }
    logger( 'END handleUniqueAntennas: ' + dt.now() );
}

function createNewRecognisedAntennaRec( parentRec, specs, towerInfo, hash ) {
    logger( 'START createNewRecognisedAntennaRec: ' + dt.now() );
    
    parentRec.addAttachments( utils.fileToAttachment( '/tmp/' + hash +  '.JPG' ) );
    var attachRec = getRecsWithNullPhotoType( towerInfo.towerAuditDataId )[0];

    attachRec.setValueToField('photo_type', 'Recognized' );
    attachRec.setValueToField('tower_audit_data', towerInfo.towerAuditDataId );
    attachRec.setValueToField('sys_position_lat', round( specs.lat, PRECISE_10 ) );
    attachRec.setValueToField('sys_position_long', round( specs.lng, PRECISE_10 ) );
    attachRec.setValueToField('sys_position_alt', round( specs.alt, PRECISE_10 ) );
    // attachRec.setValueToField('altitude', null ); // above sea level
    attachRec.setValueToField('tower_id', towerInfo.towerId );
    attachRec.setValueToField('tower_audit', towerInfo.towerAuditId );
    attachRec.setValueToField('antenna_type', specs.type );
    attachRec.setValueToField('antenna_status', 'Recognized' );
    attachRec.setValueToField('azimuth', round( specs.azimuth, PRECISE_2 ) );
    attachRec.setValueToField('recognition_server_config_version', versionControl.server );
    attachRec.setValueToField('recognition_task_config_version', versionControl.task );
    attachRec.setValueToField('flight_config_version', versionControl.flight );

    if ( specs.type == 'RF antenna' ) {
        attachRec.setValueToField('width', round( specs.width, PRECISE_2 ) );
        attachRec.setValueToField('height', round( specs.height, PRECISE_2 ) );
    } else {
        attachRec.setValueToField('diameter', round( specs.diameter, PRECISE_2 ) );
    }

    nascUtils.quickSave( attachRec );
    logger( 'END createNewRecognisedAntennaRec: ' + dt.now() );
    if ( !attachRec.isValid() ) {
        logger( 'Image Rec. | newRec errors: ' + attachRec.getErrors() );
    } else {
        return attachRec;
    }
}

function getRecsWithNullPhotoType( parentId ) {
    var query = attachModel.createQuery();
    query.getAllFields();
    query.addCondition( 'parent_record_id', parentId )
         .addAndCondition( 'parent_object_id', towerAuditDataModelId )
         .addAndCondition( 'photo_type', 'ISNULL' );
    query.setLimit(0);
    return query.exec();
}

function setPhotoTypeInAttachs( parentId, type ) {
    var result = getRecsWithNullPhotoType( parentId );
    for (var i in result) {
        result[i].setValueToField( 'photo_type', type );
        nascUtils.quickSave(result[i]);
        if (!result[i].isValid()) {
            utils.addLogRecord(result[i].getErrors());
        }
    }
}

// =======================================
// END createRecordsInSL with dependencies
// =======================================

// ==============================================
// Common functions
// ==============================================

function logger(msg) {
    if ( true ) utils.addLogRecord(msg, 1);
}

function round(num, precise) {
    if ( num !== null ) {
        return Math.round( num * precise ) / precise;
    }
}

function getVersion(type) {
    query = versionModel.createQuery();
    query.getFields(['id', 'config_no', 'config_version']);
    query.addCondition('config_type', type);
    query.setLimit(1);
    query.orderBy('id', 'desc');
    return query.exec()[0].getValueByField('config_version');
}