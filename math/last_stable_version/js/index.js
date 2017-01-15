// ЗАДАЧИ:  написать алгоритм сравнения 
// результата и ответа игрока
// РАБОТАЮ ОКОЛО СТРОК 21, 67, 117, 171, 178, 321

// arthur прежде чем сравнивать ответ и ввод нужно сделать хранилище для
// всех выражений, правильных и пользовательских ответов var storage
// обработку буквенных сокращений добавим позже

"use strict"

$(document).ready(function(){

// =====================================================
// BEGIN ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ
// =====================================================

  var conditions = {
    difficult: null,
    operation: null,
    // arthur заменил precise на precision - точный на точность, чтобы убрать путаницу в коде
    // зависимости в html и дальше по коду поправил
    precision: null
  }

  var settings = {
    quantity: null,
    time: null,
    currRange: null,
    symbol: null,
    currFold: null
  }

// arthur! структура [['строка выражения', правильный ответ, ввод пользователя], [...], ... [...]]
  var storage = [];

  var ranges = [[2, 9],
                [1, 99],
                [10, 99],
                [11, 99],
                [101, 999],
                [1001, 9999],
                [10001, 99999],
                [100001, 999999]];

  // alex повозился со св-вом per
  var generalNums = {
    precise: {
      add: {
        quantity: [2, 2, 3, 4],
        range: [[ranges[1], ranges[1]],
                [ranges[4], ranges[4]],
                [ranges[4], ranges[4]],
                [ranges[4], ranges[4]]]
      },
      sub: {
        quantity: [2, 2, 3, 4],
        range: [[ranges[1], ranges[1]],
                [ranges[4], ranges[4]],
                [ranges[4], ranges[4]],
                [ranges[4], ranges[4]]]
      },
      mul: {
        quantity: [2, 2, 2, 2],
        range: [[ranges[0], ranges[2]],
                [ranges[2], ranges[2]],
                [ranges[2], ranges[2]],
                [ranges[4], ranges[4]]]
      },
      div: {
        quantity: [2, 2, 2, 2],
        range: [[ranges[0], ranges[2]],
                [ranges[2], ranges[2]],
                [ranges[2], ranges[2]],
                [ranges[4], ranges[4]]]
      },
      per: {
 // quantity тут отражает кол-во обычных рандомных чисел (чтобы функция genEquationNums 
 // была универсальной, а первый член каждого из массивов fold -  кол-во процентных "ставок"
        quantity: [1, 1, 1, 1],
        range: [[ranges[3], ranges[3]],
                [ranges[4], ranges[4]],
                [ranges[4], ranges[4]],
                [ranges[5], ranges[5]]],
        fold: [[1, 10, null],
               [1, 5, null],
               [1, 1, null],
               [2, 10, 5]]
      }
    },
    approx: {
      add: {
        quantity: [2, 3, 4, 5],
        range: [[ranges[4], ranges[4]],
                [ranges[5], ranges[5]],
                [ranges[6], ranges[6]],
                [ranges[7], ranges[7]]]
      },
      sub: {
        quantity: [2, 3, 4, 5],
        range: [[ranges[4], ranges[4]],
                [ranges[5], ranges[5]],
                [ranges[6], ranges[6]],
                [ranges[7], ranges[7]]]
      },
      mul: {
        quantity: [2, 2, 2, 3],
        range: [[ranges[3], ranges[3]],
                [ranges[4], ranges[4]],
                [ranges[5], ranges[5]],
                [ranges[4], ranges[4]]]
      },
      div: {
        quantity: [2, 2, 2, 3],
        range: [[ranges[3], ranges[3]],
                [ranges[4], ranges[4]],
                [ranges[5], ranges[5]],
                [ranges[4], ranges[4]]]
      },
      per: {
  // quantity тут отражает кол-во обычных рандомных чисел (чтобы функция genEquationNums 
 // была универсальной, а первый член каждого из массивов fold -  кол-во процентных "ставок"
        quantity: [1, 1, 1, 1],
        range: [[ranges[5], ranges[5]],
                [ranges[6], ranges[6]],
                [ranges[6], ranges[6]],
                [ranges[7], ranges[7]]],
        fold: [[1, 5, null],
               [1, 1, null],
               [2, 5, 5],
               [2, 5, 1]]
      }
    },
    time: [1, 3, 5, 7]
  }

// =====================================================
// END ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ
// =====================================================
////////////////////////////////////////////////////////
// =====================================================
// BEGIN ОБЪЯВЛЕНИЕ ФУНКЦИЙ
// =====================================================

// скрываем форму опций и показываем форму решения задач
  function showWorksheet(e) {
   $('.conditions').css('opacity', 0)
     .one('transitionend', function(){
       $(this).css('display', 'none')
     })
    $('.worksheet').css('display', 'block');
    setTimeout(function(){
      $('.worksheet').css('opacity', 1);
    }, 50)
  }

  function nextEquation(symbol) {
    var equationStr, answer;
    if (symbol == '+' || symbol == '-' || symbol == '*') {
      var equationNums = genEquationNums();
      equationStr = equation.innerHTML = equationNums.join(' ' + symbol + ' ');
      answer = eval(equationStr);

    } else if (symbol == '/') {
      var multipliers = genEquationNums();
      var mulResult = multipliers.reduce(function(a, b) {
        return a * b;
      })
      answer = multipliers.splice(-1);
      var equationNums = [mulResult].concat(multipliers);
      equationStr = equation.innerHTML = equationNums.join(' ' + symbol + ' ');

    } else if (symbol == '%') {
// alex is working here...
      var equationNums = genEquationNums();
      // arthur! расчёт результата, формула не универсальная.
      // можно сделать универсальную, проверяя следующее значение на == '%'
      if (equationNums.length == 5) {
        answer = (equationNums[3] * 100) / equationNums[0];
      } else {
        answer = (((equationNums[6] * 100) / equationNums[3]) * 100) / equationNums[0];
      }
      equationStr = equation.innerHTML = equationNums.join('');
    }
    storage.push([equationStr, answer]);
  }

// arthur! запись ответа пользователя, вывод следующего выражения
  function admit() {
    storage[storage.length - 1].push(userAnswer.value);
    userAnswer.value = '';
    nextEquation(settings.symbol);
  }

// arthur! проверка результатов и заполнение таблицы ответов
// пока вывод самый простой
  function fillAnswerSheet() {
    var answers = {
      right: 0,
      wrong: 0
    }

    storage.forEach(function(c, i, arr){
      if (c.length > 2) {
        if (c[1] == c[2]) {
          answers.right++;
          $('.answer-sheet table tbody')
          .append('<tr class="answer-right">\
                    <td>' + (i + 1) + '</td>\
                    <td>' + c[0] + '</td>\
                    <td>' + c[2] + '</td>\
                    <td>' + c[1] + '</td></tr>');
        } else {
          answers.wrong++;
          $('.answer-sheet table tbody')
          .append('<tr class="answer-wrong">\
                    <td>' + (i + 1) + '</td>\
                    <td>' + c[0] + '</td>\
                    <td>' + c[2] + '</td>\
                    <td>' + c[1] + '</td></tr>');
        }
      }
    })

    answers.total = answers.right + answers.wrong;
    answers.percent = Math.round((answers.right * 100) / answers.total);
    $('.answer-stats-total').append('<span> ' + answers.total + '</span>');
    $('.answer-stats-right').append('<span> ' + answers.right + '</span>');
    $('.answer-stats-wrong').append('<span> ' + answers.wrong + '</span>');
    $('.answer-stats-percent').append('<span> ' + answers.percent + ' %</span>');
  }

// alex is working here... Делаю фунцию универсальной (подходящей для процентов)
  function genEquationNums() {
    var equationNums = [];

    if (settings.currFold !== null){ //arthur упростил проверку
      for (var i = 1; i <= settings.currFold[0]; i++) { // arthur заменил < на <= и убрал +1 после settings.currFold[0]
// можно свести в одну переменную, но пока для наглядности пусть будет так
        var perMulBase = settings.currFold[i]; // arthur* возможные значения 5, 10, 1, 5, 10
        var perMulWhole = perMulBase * genNum(1, 100 / perMulBase); // arthur? может здесь вместо 100 лучше установить 95
        equationNums.push(perMulWhole, ' % ', '(')
      }
    }

    for (var i = 0; i < settings.quantity; i++) {
      if (i < settings.currRange.length - 1) {
        equationNums.push(genNum(settings.currRange[i][0], settings.currRange[i][1]));
      } else {
        equationNums.push(genNum(settings.currRange[settings.currRange.length-1][0], settings.currRange[settings.currRange.length-1][1]));
      }
    }

  // закрываем скобки после числа
    if (settings.currFold !== null){
      for (var i = 1; i < settings.currFold[0] + 1; i++) {
        equationNums.push(')')
      }
    }

    return equationNums;
  }

  function genNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

// функция основного таймера
  function mainTimer() {
    var begin = Date.now(),
        limit = settings.time * 1000 * 60 + 1000;

    var localTimer = setTimeout(function tick() {
      var now = Date.now(),
          dif = now - begin;

      if (dif < limit) {
        var left = ~~((limit - dif) / 1000),
            minutes = ~~(left / 60),
            seconds = left - minutes * 60;
        minutes = '0' + minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        $('.maintimer').text(minutes + ':' + seconds);
        localTimer = setTimeout(tick, 1000);
      } else {
        clearTimeout(localTimer);
        fillAnswerSheet();
        userAnswer.disabled = true;
        $('.worksheet').css('opacity', 0)
          .one('transitionend', function(){
            $(this).css('display', 'none')
          })
         $('.answer-sheet').css('display', 'block');
         setTimeout(function(){
           $('.answer-sheet').css('opacity', 1);
         }, 50)
      }
    }, 10);
  }

  function countdown() {
    // arthur изменил исчезновение кнопки, чтобы не было скачка таймера
    $('.worksheet-begin').removeClass('.worksheet-begin').css('opacity', '0');
    userAnswer.focus();
    var count = 3;
    var countdown = setTimeout(function tick() {
      if (count > -1) {
        $('.pretimer').text(count);
        count--;
        countdown = setTimeout(tick, 10);
      } else {
        clearTimeout(countdown);
        $('.pretimer').text('');
        mainTimer();
        nextEquation(settings.symbol);
      }
    }, 10);
  }

  function initWorksheet() {
    var str = '';
    switch (conditions.operation) {
      case 'add':
        str += 'Сложение, ';
        settings.symbol = '+';
        break
      case 'sub':
        str += 'Вычитание, '
        settings.symbol = '-';
        break
      case 'mul':
        str += 'Умножение, '
        settings.symbol = '*';
        break
      case 'div':
        str += 'Деление, '
        settings.symbol = '/';
        break
      case 'per':
        str += 'Проценты, '
        settings.symbol = '%';
        break
      case 'ran':
        str += 'Случайное упражнение, '
        break
    }

    switch (conditions.difficult) {
      case '0':
        str += 'первый '
        break
      case '1':
        str += 'второй '
        break
      case '2':
        str += 'третий '
        break
      case '3':
        str += 'четвёртый '
        break
    }
    str += 'уровень сложности, ';

    if (conditions.precision == 'precise') {
      str += 'абсолютная точность.';
    } else {
      str += 'допустима погрешность в 20%.'
    }

    settings.quantity = generalNums[conditions.precision][conditions.operation]['quantity'][conditions.difficult];
    settings.currRange = generalNums[conditions.precision][conditions.operation]['range'][conditions.difficult];
    settings.time = generalNums.time[conditions.difficult];

    // alex поработал и здесь!!!
    if (generalNums[conditions.precision][conditions.operation]['fold'] !== undefined) {
      settings.currFold = generalNums[conditions.precision][conditions.operation]['fold'][conditions.difficult];
    }
    // arthur убрал лишнее присвоение settings.currFold

    $('.worksheet-header').html(str);
    $('.maintimer').text('0' + settings.time + ':00');
  }

// =====================================================
// END ОБЪЯВЛЕНИЕ ФУНКЦИЙ
// =====================================================
////////////////////////////////////////////////////////
// =====================================================
// BEGIN ОБРАБОТЧИКИ СОБЫТИЙ
// =====================================================

// нажатие на СТАРТ в первом блоке
  $('.conditions-start').on('click', function(e) {
    conditions.difficult = $('.condition-difficult input:checked').val();
    conditions.precision = $('.condition-precision input:checked').val();
// arthur! похоже random проще реализовать на более ранней стадии
// и в generalNums свойство ran не нужно оказалось
    conditions.operation = $('.condition-operation input:checked').val();
    if (conditions.operation == 'ran') {
      var ranCheck = Math.random();
      if (ranCheck < 0.2) {
        conditions.operation = 'per';
      } else if (ranCheck < 0.4) {
        conditions.operation = 'div';
      } else if (ranCheck < 0.6) {
        conditions.operation = 'mul';
      } else if (ranCheck < 0.8) {
        conditions.operation = 'sub';
      } else {
        conditions.operation = 'add';
      }
    }

    initWorksheet();
    showWorksheet();
  });

  $('.worksheet-begin').click(countdown);
  //arthur обработчик ответа пользователя
  $('#userAnswer').on('keypress', function(e){
    if (e.keyCode == 13) {
      admit();
    }
  })
  $('.admit-answer').click(admit);
  // arthur временная функция обновления страницы
  $('.answer-sheet button').click(function(){window.location.reload(true)});

// =====================================================
// END ОБРАБОТЧИКИ СОБЫТИЙ
// =====================================================

});