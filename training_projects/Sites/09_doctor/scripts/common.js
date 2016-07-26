'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var percentage = document.querySelector('.js_percentage');

  lory(percentage, {
      infinite: 1
  });

  var next = percentage.querySelector('.next');

  var sliderTimeout = setTimeout(function sliderTimeoutIn() {
    next.click();
    sliderTimeout = setTimeout(sliderTimeoutIn, 5000);
  }, 5000)
});

$(function(){
  $('#projects-container').mixItUp();
});

var selectSpec = document.forms['select-specialist'];
var blank = document.querySelector('.blank');

selectSpec.onclick = function(e) {
  if (e.target.id) {
    refillFields(e.target.id);
  }
  blank.style.left = '100%';
}

var selectServicesDrug = ['Choose Services', 'Drug1', 'Drug2', 'Drug3', 'Drug4', 'Drug5'];
var selectDoctorDrug = ['Select Doctor', 'DocDrug1', 'DocDrug2', 'DocDrug3', 'DocDrug4', 'DocDrug5'];
var selectServicesDental = ['Choose Services', 'Dental1', 'Dental2', 'Dental3', 'Dental4', 'Dental5'];
var selectDoctorDental = ['Select Doctor', 'DocDental1', 'DocDental2', 'DocDental3', 'DocDental4', 'DocDental5'];
var selectServicesSpecial = ['Choose Services', 'Special1', 'Special2', 'Special3', 'Special4', 'Special5'];
var selectDoctorSpecial = ['Select Doctor', 'DocSpecial1', 'DocSpecial2', 'DocSpecial3', 'DocSpecial4', 'DocSpecial5'];
var selectServicesOperation = ['Choose Services', 'Operation1', 'Operation2', 'Operation3', 'Operation4', 'Operation5'];
var selectDoctorOperation = ['Select Doctor', 'DocOperation1', 'DocOperation2', 'DocOperation3', 'DocOperation4', 'DocOperation5'];
var selectServicesSurgery = ['Choose Services', 'Surgery1', 'Surgery2', 'Surgery3', 'Surgery4', 'Surgery5'];
var selectDoctorSurgery = ['Select Doctor', 'DocSurgery1', 'DocSurgery2', 'DocSurgery3', 'DocSurgery4', 'DocSurgery5'];
var selectServicesCheck = ['Choose Services', 'Check1', 'Check2', 'Check3', 'Check4', 'Check5'];
var selectDoctorCheck = ['Select Doctor', 'DocCheck1', 'DocCheck2', 'DocCheck3', 'DocCheck4', 'DocCheck5'];

function refillFields(value) {
  var divAppointment = document.querySelector('.make-appointment');
  var divFields = divAppointment.getElementsByTagName('div');
  var ulServices, ulDoctors, newServices, newDoctors;

  for (var i = 0; i < divFields.length; i++) {
    if (divFields[i].dataset.specialist == 'service') {
      ulServices = divFields[i].childNodes[0];
    };
    if (divFields[i].dataset.specialist == 'doctor') {
      ulDoctors = divFields[i].childNodes[0];
    };
  }

  while (ulServices.firstChild) {
    ulServices.removeChild(ulServices.firstChild);
  }
  while (ulDoctors.firstChild) {
    ulDoctors.removeChild(ulDoctors.firstChild);
  }

  if (value == 'spec-drug') {
    newServices = selectServicesDrug;
    newDoctors = selectDoctorDrug;
  } else if (value == 'spec-dental') {
    newServices = selectServicesDental;
    newDoctors = selectDoctorDental;    
  } else if (value == 'spec-special') {
    newServices = selectServicesSpecial;
    newDoctors = selectDoctorSpecial;    
  } else if (value == 'spec-operation') {
    newServices = selectServicesOperation;
    newDoctors = selectDoctorOperation;    
  } else if (value == 'spec-surgery') {
    newServices = selectServicesSurgery;
    newDoctors = selectDoctorSurgery;    
  } else if (value == 'spec-check') {
    newServices = selectServicesCheck;
    newDoctors = selectDoctorCheck;    
  }

  for(var j = 0; j < newServices.length; j++) {
    var newli = document.createElement('li');
    var newa = document.createElement('a');
    newli.v = newServices[j];
    //Следующие два свойства для быстрого доступа к значениям
    newli.elm = document.getElementById('appointment-service');
    newli.istrigger = newli.elm.nextSibling.nextSibling;
    newa.href = '#';

    newa.innerHTML = newServices[j];

    newli.onclick = function() {
      this.elm.value = this.v;
      this.istrigger.click();
      this.istrigger.firstChild.nodeValue = this.firstChild.firstChild.nodeValue;
      return false;
    }

    newli.appendChild(newa);
    ulServices.appendChild(newli);
  }

  for(var j = 0; j < newDoctors.length; j++) {
    var newli = document.createElement('li');
    var newa = document.createElement('a');
    newli.v = newDoctors[j];
    //Следующие два свойства для быстрого доступа к значениям
    newli.elm = document.getElementById('appointment-doctor');
    newli.istrigger = newli.elm.nextSibling.nextSibling;
    newa.href = '#';

    newa.innerHTML = newDoctors[j];

    newli.onclick = function() {
      this.elm.value = this.v;
      this.istrigger.click();
      this.istrigger.firstChild.nodeValue = this.firstChild.firstChild.nodeValue;
      return false;
    }

    newli.appendChild(newa);
    ulDoctors.appendChild(newli);
  }

}

var appointmentBlock = document.querySelector('.make-appointment');
appointmentBlock.onclick = function(e) {
  e.preventDefault();

  if (e.target.className == 'trigger') {
    var elem = e.target.nextSibling.getElementsByTagName('ul')[0];
    var elemFor = e.target.htmlFor;
    var arrowCheckbox = document.getElementById(elemFor);
    arrowCheckbox.checked = !arrowCheckbox.checked;
  } else {
    if (e.target.type == 'submit') {
      document.forms.appointment.submit();
      return;
    } else {
      return;
    };
  }

  var check = getComputedStyle(elem).height;

  if (check == '0px') {
    elem.style.borderWidth = '1px';
    var prevHeight = elem.style.height;
    elem.style.height = 'auto';
    var endHeight = getComputedStyle(elem).height;
    elem.style.height = prevHeight;
    elem.offsetHeight; // force repaint
    elem.style.transition = 'height .5s ease-in-out';
    elem.style.height = endHeight;

  } else {
    elem.style.height = getComputedStyle(elem).height
    elem.style.transition = 'height .5s ease-in-out'
    elem.offsetHeight // force repaint
    elem.style.height = '0px'
    setTimeout(function(){elem.style.borderWidth = '0px'}, 500);
  }
}

window.onload = function () {
  tamingSelect();
}