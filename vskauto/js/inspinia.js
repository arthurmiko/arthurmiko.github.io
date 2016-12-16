/*
 *
 *   INSPINIA - Responsive Admin Theme
 *   version 2.6
 *
 */


$(document).ready(function () {

    // Add body-small class if window less than 768px
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }

    // Collapse ibox function
    $('.collapse-link').on('click', function () {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    });

    // Close ibox function
    $('.close-link').on('click', function () {
        var content = $(this).closest('div.ibox');
        content.remove();
    });

    // Fullscreen ibox function
    $('.fullscreen-link').on('click', function () {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        $('body').toggleClass('fullscreen-ibox-mode');
        button.toggleClass('fa-expand').toggleClass('fa-compress');
        ibox.toggleClass('fullscreen');
        setTimeout(function () {
            $(window).trigger('resize');
        }, 100);
    });

    // Close menu in canvas mode
    $('.close-canvas-menu').on('click', function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });

    // Run menu of canvas
    $('body.canvas-menu .sidebar-collapse').slimScroll({
        height: '100%',
        railOpacity: 0.9
    });

    // Open close right sidebar
    $('.right-sidebar-toggle').on('click', function () {
        $('#right-sidebar').toggleClass('sidebar-open');
    });

    // Small todo handler
    $('.check-link').on('click', function () {
        var button = $(this).find('i');
        var label = $(this).next('span');
        button.toggleClass('fa-check-square').toggleClass('fa-square-o');
        label.toggleClass('todo-completed');
        return false;
    });

    // Minimalize menu
    $('.navbar-minimalize').on('click', function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();

    });

    // Tooltips demo
    $('.tooltip-demo').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });


    // Full height of sidebar
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarHeigh = $('nav.navbar-default').height();
        var wrapperHeigh = $('#page-wrapper').height();

        if (navbarHeigh > wrapperHeigh) {
            $('#page-wrapper').css("min-height", navbarHeigh + "px");
        }

        if (navbarHeigh < wrapperHeigh) {
            $('#page-wrapper').css("min-height", $(window).height() + "px");
        }

        if ($('body').hasClass('fixed-nav')) {
            if (navbarHeigh > wrapperHeigh) {
                $('#page-wrapper').css("min-height", navbarHeigh + "px");
            } else {
                $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
            }
        }

    }

    fix_height();

    // Fixed Sidebar
    $(window).bind("load", function () {
        if ($("body").hasClass('fixed-sidebar')) {
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }
    });

    // Move right sidebar top after scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    $(window).bind("load resize scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    $("[data-toggle=popover]").popover();

    // Add slimscroll to element
    $('.full-height-scroll').slimscroll({
        height: '100%'
    })

    // Show selected table depending on bid-type option
    $('select.bid-type').on('click', function(e){
        $('.footable').removeClass('active');
        $('.footable.' + $(this).val()).addClass('active');
    })

});

// Form validation
(function() {
    var app = {
        initialize: function() {
            this.modules();
            this.setUpListiners();
        },

        modules: function() {

        },

        setUpListiners: function() {
            $('form').on('submit', app.submitForm);
            $('form').on('keydown', 'input, .chosen-container', app.removeError);
            $('form').on('mousedown', 'input, .chosen-container', app.removeError);
        },

        submitForm: function(e) {
            e.preventDefault();

            var form = $(this),
                submitBtn = form.find('button[type="submit"]');

            if (app.validateForm(form) === false) return false;

            submitBtn.attr('disabled', 'disabled');

            // валидация формы добавления авто
            // требуется добавить храние данных о пробеге, объеме двигателя и т.д. до отправки основной формы
            // также нужно предотвратить повторное добавление уже существующего авто
            if ($(e.target).hasClass('add-auto-form')) {
                $('.add-auto .btn').webuiPopover('hide');
                var optionVal = $(e.target).find('#car_brand_id').val();
                var optionText = [];
                optionText[0] = $(e.target).find('#car_brand_id option:selected').text();
                optionText[1] = $(e.target).find('#car_model_id option:selected').text();
                optionText[2] = $(e.target).find('#car_year option:selected').text();
                optionText = optionText.join(' ');

                // обновление <input type="select" id="request_car_id"> в основной форме
                $('#request_car_id').append('<option value="' + optionVal + '" selected>' + optionText + '</option>');
                $('#request_car_id').trigger('chosen:updated');

                // очистка заполненной формы добавления авто
                $('.add-auto-form select option:selected').removeAttr('selected').trigger('chosen:updated');
                $('.add-auto-form select').trigger('chosen:updated');
                $('.add-auto-form .form-group').removeClass('has-success');
                $('.add-auto-form input[type="number"]').val('');

                submitBtn.removeAttr('disabled');
                return false;
            }

            var str = form.serialize();

            $.ajax({
                url: 'test.php',
                method: 'POST',
                data: str
            })
            .done(function(msg){
                if (msg !== 'OK') { //убрать когда всё будет уже работать "!"===================================
                    if (form.hasClass('newbid')) {
                        var result = '<div class="form-success">\
                                          <h2 class="m-b">Ваша заявка принята.</h2>\
                                          <a href="newbid.html" class="btn btn-default">Создать новую заявку</a>\
                                          <a href="index.html" class="btn btn-primary">Вернуться к списку заявок</a>\
                                      </div>';
                    } else if (form.hasClass('newpartner')) {
                        var result = '<div class="form-success">\
                                          <h2 class="m-b">Новый контрагент добавлен.</h2>\
                                          <a href="newpartner.html" class="btn btn-default">Создать ещё одного контрагента</a>\
                                          <a href="partners.html" class="btn btn-primary">Вернуться к списку контрагентов</a>\
                                      </div>';
                    }
                    form.html(result);
                } else {
                    form.html(msg);
                }
            })
            .always(function(){
                submitBtn.removeAttr('disabled');
            })
        },

        validateForm: function(form) {
            var inputs = form.find('input.required, select.required');
                valid = true;

            $.each(inputs, function(index, val){
                var input = $(val),
                    val = input.val(),
                    formGroup = input.parents('.form-group'),
                    label = formGroup.find('label').text();

                    label = label.charAt(0).toLowerCase() + label.slice(1);
                    switch (label) {
                        case 'марка':
                            label = 'марку';
                            break;
                        case 'выберите авто':
                            label = 'авто'
                            break;
                    }

                var textError = 'Укажите ' + label;

                if (val.length === 0) {
                    formGroup.addClass('has-error').removeClass('has-success');

                    if (input.prop('tagName') == 'SELECT') {
                        $(window[input.prop('id') + '_chosen']).tooltip({
                            trigger: 'manual',
                            placement: 'bottom',
                            title: textError
                        }).tooltip('show');
                    } else {
                        input.tooltip({
                            trigger: 'manual',
                            placement: 'bottom',
                            title: textError
                        }).tooltip('show');
                    }

                    valid = false;
                } else {
                    formGroup.addClass('has-success').removeClass('has-error');
                }
            })

            return valid;
        },

        removeError: function() {
            $(this).tooltip('destroy').parents('.form-group').removeClass('has-error');
        }
    }

    app.initialize();
}())

// Minimalize menu when screen is less than 768px
$(window).bind("resize", function () {
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }
});

// Local Storage functions
// Set proper body class and plugins based on user configuration
$(document).ready(function () {
    if (localStorageSupport()) {

        var collapse = localStorage.getItem("collapse_menu");
        var fixedsidebar = localStorage.getItem("fixedsidebar");
        var fixednavbar = localStorage.getItem("fixednavbar");
        var boxedlayout = localStorage.getItem("boxedlayout");
        var fixedfooter = localStorage.getItem("fixedfooter");

        var body = $('body');

        if (fixedsidebar == 'on') {
            body.addClass('fixed-sidebar');
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }

        if (collapse == 'on') {
            if (body.hasClass('fixed-sidebar')) {
                if (!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                }
            } else {
                if (!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                }

            }
        }

        if (fixednavbar == 'on') {
            $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
            body.addClass('fixed-nav');
        }

        if (boxedlayout == 'on') {
            body.addClass('boxed-layout');
        }

        if (fixedfooter == 'on') {
            $(".footer").addClass('fixed');
        }
    }
});

// check if browser support HTML5 local storage
function localStorageSupport() {
    return (('localStorage' in window) && window['localStorage'] !== null)
}

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        $('#side-menu').hide();
        // For smoothly turn on menu
        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 200);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $('#side-menu').removeAttr('style');
    }
}

// Dragable panels
function WinMove() {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    var connect = "[class*=col]";
    $(element).sortable(
        {
            handle: handle,
            connectWith: connect,
            tolerance: 'pointer',
            forcePlaceholderSize: true,
            opacity: 0.8
        })
        .disableSelection();
}

