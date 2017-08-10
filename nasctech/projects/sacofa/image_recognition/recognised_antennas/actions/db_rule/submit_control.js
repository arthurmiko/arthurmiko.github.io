var recognizedAntennasModel = custom.getModelByAlias('recognised_antennas'),
  towerAuditDataModel = custom.getModelByAlias('tower_audit_data'),
  towerAuditDataId = ctx.instance.getValueByField('tower_audit_data');
var recognizedAntennasRecs = recognizedAntennasModel.execQuery ({where: {
    tower_audit_data: towerAuditDataId,
    status: 1 // New
  } } );
  

if ( utils.isEmpty(recognizedAntennasRecs) ) {
  var towerAuditDataRec = towerAuditDataModel.find( {id: towerAuditDataId} )[0];
  towerAuditDataRec.setValueToField('status', 4); // Ready for submit
  nascUtils.quickSave(towerAuditDataRec);

  if ( towerAuditDataRec.getErrors() ) {
    utils.addLogRecord( 'Erros while update Tower Audit Data: ' 
      + towerAuditDataRec.getErrors() );
  }
}