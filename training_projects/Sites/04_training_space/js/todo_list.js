'use strict'
console.log('Show time!')

function sendInput () {
  console.log('input check');
  var inputLine = document.querySelectorAll('.todo_input_line_class');
  var inputData = inputLine[0].value;

  checkListLength();

  var newThroughBox = document.createElement('input');
  newThroughBox.setAttribute('id', 'through_box_' + nextNum);
  newThroughBox.setAttribute('onclick', 'through(' + nextNum + ')');
  newThroughBox.setAttribute('hidden', 'true');
  newThroughBox.className = 'through_box';
  newThroughBox.type = 'checkbox';

  var newLabel = document.createElement('label');
  newLabel.setAttribute('id', 'label_through_num_' + nextNum);
  newLabel.setAttribute('for', 'through_box_' + nextNum);

  var newThroughForm = document.createElement('form');
  newThroughForm.setAttribute('id', 'through_form_' + nextNum)  
  newThroughForm.className = 'through_form';

  var newLi = document.createElement('li');
  newLi.setAttribute('id', 'list_element_' + nextNum);
  newLi.className = 'list_element';

  var newSpanNum = document.createElement('span');
  newSpanNum.setAttribute('id', 'span_num_' + nextNum);
  newSpanNum.innerHTML = nextNum + '. ';

  var newSpanData = document.createElement('span');
  newSpanData.setAttribute('id', 'span_data_num_' + nextNum);
  newSpanData.innerHTML = inputData;

  var newDeleteDiv = document.createElement('div');
  newDeleteDiv.setAttribute('id', 'delete_line_num_' + nextNum);
  newDeleteDiv.setAttribute('onclick', 'deleteLine(' + nextNum + ')');
  newDeleteDiv.className = 'delete_line';

  document.querySelectorAll('.todo_mainlist')[0].appendChild(newLi);
  document.querySelectorAll('#list_element_' + nextNum)[0].appendChild(newThroughForm);
  document.querySelectorAll('#through_form_' + nextNum)[0].appendChild(newThroughBox);
  document.querySelectorAll('#through_form_' + nextNum)[0].appendChild(newLabel);
  document.querySelectorAll('#list_element_' + nextNum)[0].appendChild(newSpanNum);
  document.querySelectorAll('#list_element_' + nextNum)[0].appendChild(newSpanData);
  document.querySelectorAll('#list_element_' + nextNum)[0].appendChild(newDeleteDiv);

  document.querySelectorAll('.todo_input_line_class')[0].value = '';
};

var nextNum;
function checkListLength () {
  var allListElements = document.querySelectorAll('.todo_mainlist')[0].childNodes;
  nextNum = allListElements.length;
};

function through (num) {
  console.log('through check');
  if (document.getElementById('through_box_' + num).checked == false) {
    document.getElementById('span_data_num_' + num).className = '';
  } else {
    document.getElementById('span_data_num_' + num).className = 'through_line';
  };
};

function deleteLine (num) {
  console.log('deleteLine check ' + num);
  var selectLine = document.getElementById('list_element_' + num);
  document.getElementById('todo_mainlist_id').removeChild(selectLine);
  refreshNum(num);
};

function refreshNum (num) {
  for (var i = num; i <= nextNum; i++) {
    var existElem = (document.getElementById('list_element_' + i) != null) ? true : false;
    var c = i - 1;
    if ( existElem == true ) {
      var curElem = document.getElementById('list_element_' + i);
      curElem.setAttribute('id', 'list_element_' + c);
      
      curElem = document.getElementById('span_num_' + i);
      curElem.setAttribute('id', 'span_num_' + c);
      curElem.innerHTML = c + '. ';

      curElem = document.getElementById('span_data_num_' + i);
      curElem.setAttribute('id', 'span_data_num_' + c);

      curElem = document.getElementById('through_form_' + i);
      curElem.setAttribute('id', 'through_form_' + c);

      curElem = document.getElementById('through_box_' + i);
      curElem.setAttribute('id', 'through_box_' + c);
      curElem.setAttribute('onclick', 'through(' + c + ')');

      curElem = document.getElementById('label_through_num_' + i);
      curElem.setAttribute('id', 'label_through_num_' + c);
      curElem.setAttribute('for', 'through_box_' + c);      

      curElem = document.getElementById('delete_line_num_' + i);
      curElem.setAttribute('id', 'delete_line_num_' + c);
      curElem.setAttribute('onclick', 'deleteLine(' + c + ')');
    };
  };
};
