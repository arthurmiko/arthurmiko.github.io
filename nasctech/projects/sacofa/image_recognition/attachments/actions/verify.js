var listSelected = actions.getSelectedRecords();

for (var i in listSelected) {
    listSelected[i].setValueToField('photo_status', 'Verified');
    nascUtils.quickSave(listSelected[i]);
}