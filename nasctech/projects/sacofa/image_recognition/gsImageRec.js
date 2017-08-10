var gsImageRec = {
    submitControl: function(parentId) {
        var towerAuditDataModel = custom.getModelByAlias('tower_audit_data');
        var query = custom.getModelByAlias('attachment').createQuery();
        query.getFields( ['tower_audit_data', 'photo_status'] );
        query.setLimit(0);
        query.addCondition('tower_audit_data', parentId)
             .addAndCondition('photo_status', 'New');
        var recs = query.exec();
        if ( recs.length === 0 ) {
            towerAuditDataModel.massUpdate( {'submit_status': 2}, {'id': parentId} );
        }
    }
};