var clDrBat   = ctx.instance.getValueByField("checklist_position_battery"),
    clCtBat   = ctx.instance.getValueByField("remote_control_battery_level"),
    clWind    = ctx.instance.getValueByField("checklist_position_wind"),
    clWeath   = ctx.instance.getValueByField("checklist_position_weather"),
    clObst    = ctx.instance.getValueByField("checklist_position_obstacles_route"),
    clCtAnt   = ctx.instance.getValueByField("remote_control_antennas_position"),
    clDrMod   = ctx.instance.getValueByField("drones_mode"),
    clDrStat  = ctx.instance.getValueByField("drones_status_lights"),
    clSdCard  = ctx.instance.getValueByField("sd_memory_card"),
    clGps     = ctx.instance.getValueByField("gps_signal"),
    clProppel = ctx.instance.getValueByField("propellers"),
    clRfScan  = ctx.instance.getValueByField("rf_scanner"),
    clGimbal  = ctx.instance.getValueByField("gimbal");

var result = ((clDrBat   == "3"  || clDrBat == "4")  &&
              (clCtBat   == "3"  || clCtBat == "4")  &&
              (clWind    == "1"  || clWind  == "2")  &&
              (clWeath   == "1")                     &&
              (clObst    == "1")                     &&
              (clCtAnt   == "1")                     &&
              (clDrMod   == "2"  || clDrMod == "3")  &&
              (clDrStat  == "1")                     &&
              (clSdCard  == "1")                     &&
              (clGps     == "3")                     &&
              (clProppel == "1")                     &&
              (clRfScan  == "1")                     &&
              (clGimbal  == "1")) ? 2 : 1;

ctx.instance.setValueToField('status', result);
return true;