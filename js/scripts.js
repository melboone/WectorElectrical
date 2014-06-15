$(function () {
    $('input:text').typeout();
    $('#nwl').submit(newsletter_subscribe);
    $('#formular').submit(formular_check);
    $('.buy').click(open_clk);
});

/******************************************************************/
function formular_check() {
    var sbm = $('#main-sbm');
    if (sbm.hasClass('wait')) {
        return false;
    }
    sbm.addClass('wait');

    function unwait() {
        sbm.removeClass('wait');
    }
    function responded(data, status) {
        var type = 'warning';
        if (data) {
            if (data.indexOf('<ok') > -1) {
                type = 'check';
            }
        }
        else {
            data = 'Unable to complete your request';
        }
        var html = '<i class="fa fa-' + type  + ' fa-lg"></i> ' + data;
        var msg_el = $('#form-msg');
        if (msg_el.length) {
            msg_el.removeClass('warning check');
            msg_el.addClass(type).html(html);
        }
        else {
            html = '<div id="form-msg" class="' + type + '">' + html + '</div>';
            f.prepend(html);
        }
        unwait();
    }

    var f = $(this);

    var form_data = {
        'is_ajax': 1
    };
    var ok = true;
    $('input', f).each(function () {
        var name = this.name;
        if (name) {
            var el = $(this);
            var val = el.val();
            if (
                this.hasAttribute('required')
                && (
                    !val
                    || (
                        name == 'email'
                        && !email_is_valid(val)
                    )
                )
            ) {
                el.focus();
                ok = false;
                return false;
            }
            form_data[name] = val;
        }
    });
    if (!ok) {
        unwait();
        return false;
    }

    /******************************************************************/
        var action = this.getAttribute('action');
        var method = this.getAttribute('method') || 'GET';
        $.ajax({
            type: method,
            url: action,
            success: responded,
            data: form_data,
            async: false
        });
    /******************************************************************/

    return false;
}
/******************************************************************/

/******************************************************************/
function preload_wait() {
    var img = new Image(1, 1);
    img.src = 'images/wait.gif';
}
/******************************************************************/

/******************************************************************/
function open_clk() {
    var div = $('#frm-d');
    if (div.hasClass('v')) {
        div.dialog('open');
        return false;
    }

    preload_wait();

    var ttl = this.getAttribute('title');
    if (!ttl) {
        ttl = this.innerHTML;
    }
    /******************************************************************/
    var d_params = {
        title: ttl,
        modal: true,
        width: 400,
        overlay: {
            backgroundColor: '#000',
            opacity: 0.5
        }
    };
    /******************************************************************/

    div.addClass('v');
    var h = (window.innerHeight - div.outerHeight()) / 2;
    if (h < 0) {
        h = 0;
    }
    d_params.position = [null, h];

    div.dialog(d_params);

    return false;
}
/******************************************************************/

/******************************************************************/
function newsletter_subscribe() {
    var sbm = $('#subscribe');
    if (sbm.hasClass('wait')) {
        return false;
    }

    var e_el = $('#email');
    var val = $.trim(e_el.val());

    if (!email_is_valid(val)) {
        alert('Please enter a valid email address');
        e_el.focus();
        return false;
    }
    sbm.addClass('wait');

    function unwait() {
        sbm.removeClass('wait');
    }

    function responded(data, status) {
        if (!data || data.indexOf('<ok') < 0) {
            alert('Unable to subscribe');
            unwait();
            return false;
        }
        e_el.remove();
        sbm.replaceWith('<div class="tx w30">Thanks!</div>');
        console.log(data);
    }

    /******************************************************************/
        var form_data = {
            'is_ajax': 1,
            'email': val
        };
        var action = this.getAttribute('action');
        var method = this.getAttribute('method') || 'GET';
        $.ajax({
            type: method,
            url: action,
            success: responded,
            data: form_data,
            async: false
        });
    /******************************************************************/

    return false;
}
/******************************************************************/

/******************************************************************/
function email_is_valid(val) {
    var EMAIL_REGEXP = new RegExp("^[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z](?:[a-z0-9-]*[a-z0-9])?$", 'gi');
    return (val && val.search(EMAIL_REGEXP) > -1 ? true : false);
}
/******************************************************************/

/******************************************************************/
/* start typeout */
    (function($) {
        $.fn.typeout = function (options){
            var opts = $.extend({}, $.fn.typeout.defaults, options);
            /******************************************************************
            var opts = $.fn.typeout.defaults;
            /******************************************************************/
            return this.each(function () {
                var t = $(this);
                var title = t.attr(opts.attr);
                if (title) {
                    t.removeAttr(opts.attr);
                    t.blur(function () {
                        if ($.trim(t.val()) == '') {
                            t.val(title);
                            if (opts.classWhenEmpty) {
                                t.addClass(opts.classWhenEmpty);
                            }
                        }
                    });
                    t.focus(function (){
                        if (t.val() == title) {
                            t.val('');
                            if (opts.classWhenEmpty) {
                                t.removeClass(opts.classWhenEmpty);
                            }
                        }
                    });
                    t.parents('form:first').submit(function(){
                        if (t.val() == title) {
                            t.val('');
                        }
                    });
                    t.blur();
                }
            });
        };
        $.fn.typeout.defaults = {
            'classWhenEmpty' : '',
            'attr': 'alt'
        };
    })($);
/* end typeout */
/******************************************************************/
