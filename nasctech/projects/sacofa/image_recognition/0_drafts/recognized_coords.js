// tower 2054



var arr = [
  ['sys_position_lat', 1.5431728933],
  ['sys_position_long', 110.3159273700],
  ['height_from_ground', 53.7516737458],
  ['azimuth', -21.2810996412],
  ['antena_width', 0.28865126758],
  ['antena_height', 2.5160146298]
]
var arr = [
  ['sys_position_lat', 1.5431392379],
  ['sys_position_long', 110.3159491774],
  ['height_from_ground', 53.6021195503],
  ['azimuth', -92.8745350509],
  ['antena_width', 0.35459546668],
  ['antena_height', 2.6075926800]
]



var arr = [
  ['sys_position_lat', 1.5431816214],
  ['sys_position_long', 110.3159676771],
  ['height_from_ground', 53.309],
  ['azimuth', 45.7281278889],
  ['antena_width', 0.2797369518],
  ['antena_height', 2.7189130087]
]

for (var elem in arr) {
  setVal(arr[elem]);
}

function setVal(elem) {
  ctx.instance.setValueToField(elem[0], elem[1]);
}