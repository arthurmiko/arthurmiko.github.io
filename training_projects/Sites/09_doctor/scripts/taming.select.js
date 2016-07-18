function tamingSelect()
{
  //Проверка наличия двух методов DOM
  if(!document.getElementById && !document.createTextNode){return;}
  
// Classes for the link and the visible dropdown
  var ts_selectclass = 'turnintodropdown';  // class to identify selects
  var ts_boxclass = 'dropcontainer';    // parent element
  var ts_triggeron = 'activetrigger';     // class for the active trigger link
  var ts_triggeroff = 'trigger';      // class for the inactive trigger link
  var ts_dropdownclosed = 'dropdownhidden'; // closed dropdown
  var ts_dropdownopen = 'dropdownvisible';  // open dropdown
/*
  Turn all selects into DOM dropdowns
*/
  var count = 0;
  var toreplace = new Array();
  var sels = document.getElementsByTagName('select');

  for(var i = 0; i < sels.length; i++){
    // проверка наличия класса, указателя
    if (ts_check(sels[i], ts_selectclass)) {

      // создание <input> с name и id от <select>
      var hiddenfield = document.createElement('input');
      hiddenfield.name = sels[i].name;
      hiddenfield.type = 'hidden';
      hiddenfield.id = sels[i].id;
      hiddenfield.value = sels[i].options[0].value;
      //вставка созданного <input> перед текущим <select>
      sels[i].parentNode.insertBefore(hiddenfield, sels[i])

      //создание и настройка элемента на место placeholder
      var hiddenCheckbox = document.createElement('input');
      hiddenCheckbox.type = 'checkbox';
      hiddenCheckbox.id = sels[i].id + '-' + 'checkbox';
      hiddenCheckbox.hidden = true;
      sels[i].parentNode.insertBefore(hiddenCheckbox, sels[i]);

      var trigger = document.createElement('label');
      trigger.htmlFor = hiddenCheckbox.id;
      ts_addclass(trigger, ts_triggeroff);
      trigger.appendChild(document.createTextNode(sels[i].options[0].text));
      sels[i].parentNode.insertBefore(trigger, sels[i]);

      var replaceUL = document.createElement('ul');

      //дублирование <option> в новые элементы списка
      for(var j = 0; j < sels[i].getElementsByTagName('option').length; j++) {
        var newli = document.createElement('li');
        var newa = document.createElement('a');
        newli.v = sels[i].getElementsByTagName('option')[j].value;
        //Следующие два свойства для быстрого доступа к значениям
        newli.elm = hiddenfield;
        newli.istrigger = trigger;
        newa.href = '#';

        newa.appendChild(document.createTextNode(sels[i].getElementsByTagName('option')[j].text));

        newli.onclick = function() {
          this.elm.value = this.v;
          this.istrigger.click();
          this.istrigger.firstChild.nodeValue = this.firstChild.firstChild.nodeValue;
          return false;
        }

        newli.appendChild(newa);
        replaceUL.appendChild(newli);
      }

      ts_addclass(replaceUL, ts_dropdownclosed);
      //Для каждого <select> создаётся отдельный div
      //Переменная toreplace начинает использоваться здесь
      var div = document.createElement('div');
      div.appendChild(replaceUL);
      div.dataset.specialist = hiddenfield.name;
      ts_addclass(div, ts_boxclass);
      sels[i].parentNode.insertBefore(div, sels[i])
      toreplace[count] = sels[i];
      count++;
    }
  }
  
  for (i = 0; i < count; i++) {
    toreplace[i].parentNode.removeChild(toreplace[i]);
  }

  function ts_check(o, c) {
    return new RegExp('\\b' + c + '\\b').test(o.className);
  }

  function ts_swapclass(o, c1, c2) {
    var cn = o.className;
    //replace - метод String, возвращает изменённую строку
    o.className = !ts_check(o, c1) ? cn.replace(c2, c1) : cn.replace(c1, c2);
  }

  function ts_addclass(o, c) {
    //проверка на наличие уже существуещего класса и добавления
    //пробела в случае необходимости
    if(!ts_check(o, c)){o.className += o.className == '' ? c : ' ' + c;}
  }
}

// testing data-attr
