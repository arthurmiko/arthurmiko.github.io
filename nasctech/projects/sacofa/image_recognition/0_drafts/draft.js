var arr = [], a, b;
a = 0, b = 90;
arr.push( [ 'a: ' + a, 'b: ' + b, azimuthCheck(a, b), 'Expected result: 90' ] );
a = -90, b = 90;
arr.push( [ 'a: ' + a, 'b: ' + b, azimuthCheck(a, b), 'Expected result: 180' ] );
a = -10, b = 10;
arr.push( [ 'a: ' + a, 'b: ' + b, azimuthCheck(a, b), 'Expected result: 20' ] );
a = 0, b = 0;
arr.push( [ 'a: ' + a, 'b: ' + b, azimuthCheck(a, b), 'Expected result: 0' ] );
a = 90, b = 90;
arr.push( [ 'a: ' + a, 'b: ' + b, azimuthCheck(a, b), 'Expected result: 0' ] );
a = -180, b = 180;
arr.push( [ 'a: ' + a, 'b: ' + b, azimuthCheck(a, b), 'Expected result: 0' ] );
a = -170, b = 170;
arr.push( [ 'a: ' + a, 'b: ' + b, azimuthCheck(a, b), 'Expected result: 20' ] );
console.log(arr);

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