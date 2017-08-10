var records = [{
    parentId: 1,
    altitude: 55.209,
    taskId: 11
},{
    parentId: 1,
    altitude: 55.209,
    taskId: 22
},{
    parentId: 1,
    altitude: 55.809,
    taskId: 33
},{
    parentId: 1,
    altitude: 55.809,
    taskId: 44
},{
    parentId: 1,
    altitude: 55.309,
    taskId: 55
},{
    parentId: 1,
    altitude: 52.209,
    taskId: 66
}];

result = {};
for ( var task in records ) {
    parentId = records[task].parentId
    taskAlt = records[task].altitude
    taskId = records[task].taskId

    commonAlt = null;
    for ( keyAlt in result[parentId] ) {
        if ( Math.abs( taskAlt - Number(keyAlt) ) < 0.5 ) commonAlt = keyAlt;
        break;
    }
    console.log(commonAlt)
    if ( !commonAlt ) commonAlt = taskAlt;

    if ( result[ parentId ] ) {
        if ( result[ parentId ][ commonAlt ] ) {
            result[ parentId ][ commonAlt ][ taskId ] = getPrimaryRecognition( task );
        } else {
            result[ parentId ][ commonAlt ] = {};
            result[ parentId ][ commonAlt ][ taskId ] = getPrimaryRecognition( task );
        }
    } else {
        result[ parentId ] = {};
        result[ parentId ][ commonAlt ] = {};
        result[ parentId ][ commonAlt ][ taskId ] = getPrimaryRecognition( task );
    }
}

console.log(result);

function getPrimaryRecognition(task) {
    return 'from gpr: ' + task;
}