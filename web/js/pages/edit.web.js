App.Actions.WEB.update_ftp_username_hint = function(elm, hint) {
    if (hint.trim() == '') {
        $(elm).parent().find('.hint').html('');
    }

    if (hint.indexOf(GLOBAL.FTP_USER_PREFIX) == 0) {
        hint = hint.slice(GLOBAL.FTP_USER_PREFIX.length, hint.length);
    }
    hint = hint.replace(/[^\w\d]/gi, '');

    $(elm).parent().find('.v-ftp-user').val(hint);
    $(elm).parent().find('.hint').text(GLOBAL.FTP_USER_PREFIX + hint);
}

App.Listeners.WEB.keypress_ftp_username = function() {
    var ftp_user_inputs = $('.v-ftp-user');
    $.each(ftp_user_inputs, function(i, ref) {
        var ref = $(ref);
        var current_val = ref.val();
        if (current_val.trim() != '') {
            App.Actions.WEB.update_ftp_username_hint(ref, current_val);
        }
        
        ref.bind('keypress input', function(evt) {
            clearTimeout(window.frp_usr_tmt);
            window.frp_usr_tmt = setTimeout(function() {
                var elm = $(evt.target);
                App.Actions.WEB.update_ftp_username_hint(elm, $(elm).val());
            }, 100);
        });
    });
}

//
//

App.Actions.WEB.update_ftp_path_hint = function(elm, hint) {
    if (hint.trim() == '') {
        $(elm).parent().find('.v-ftp-path-hint').html('');
    }

    if (hint[0] != '/') {
        hint = '/' + hint;
    }
    
    hint = hint.replace(/\/(\/+)/g, '/');

    $(elm).parent().find('.v-ftp-path-hint').text(hint);
}

App.Listeners.WEB.keypress_ftp_path = function() {
    var ftp_path_inputs = $('.v-ftp-path');
    $.each(ftp_path_inputs, function(i, ref) {
        var ref = $(ref);
        var current_val = ref.val();
        if (current_val.trim() != '') {
            App.Actions.WEB.update_ftp_path_hint(ref, current_val);
        }
        
        ref.bind('keypress input', function(evt) {
            clearTimeout(window.frp_usr_tmt);
            window.frp_usr_tmt = setTimeout(function() {
                var elm = $(evt.target);
                App.Actions.WEB.update_ftp_path_hint(elm, $(elm).val());
            }, 100);
        });
    });
}

//
//
App.Actions.WEB.add_ftp_user_form = function() {
    var ref = $('#templates').find('.ftptable').clone(true);
    var index = $('.data-col2 .ftptable').length + 1;
    
    ref.find('input').each(function(i, elm) {
        var attr_value = $(elm).prop('name').replace('%INDEX%', index);
        $(elm).prop('name', attr_value);
    });
    
    ref.find('.ftp-user-number').text(index);
    
    $('.data-col2 .ftptable:last').after(ref);
    
    var index = 1;
    $('.data-col2 .ftp-user-number:visible').each(function(i, o) {
        $(o).text(index);
        index += 1;
    });
}

App.Actions.WEB.remove_ftp_user = function(elm) {
    var ref = $(elm).parents('.ftptable');
    ref.find('.v-ftp-user-deleted').val('1');
    if (ref.find('.v-ftp-user-is-new').val() == 1) {
        ref.remove();
        return true;
    }
    ref.removeClass('ftptable-nrm');
    ref.hide();
    
    var index = 1;
    $('.data-col2 .ftp-user-number:visible').each(function(i, o) {
        $(o).text(index);
        index += 1;
    });
    
    if ($('.ftptable-nrm:visible').length == 0) {
        $('.add-new-ftp-user-button').hide();
        $('input[name="v_ftp"]').attr('checked', false);
    }
}

App.Actions.WEB.toggle_additional_ftp_accounts = function(elm) {
    if ($(elm).attr('checked')) {
        $('.ftptable-nrm, .v-add-new-user, .add-new-ftp-user-button').show();
        $('.ftptable-nrm').each(function(i, elm) {
            var login = $(elm).find('.v-ftp-user');
            if (login.val().trim() != '') {
                $(elm).find('.v-ftp-user-deleted').val(0);
            }
        });
    }
    else {
        $('.ftptable-nrm, .v-add-new-user, .add-new-ftp-user-button').hide();
        $('.ftptable-nrm').each(function(i, elm) {
            var login = $(elm).find('.v-ftp-user');
            if (login.val().trim() != '') {
                $(elm).find('.v-ftp-user-deleted').val(1);
            }
        });
    }
}

App.Actions.WEB.randomPasswordGenerated = function(elm) { 
    return App.Actions.WEB.passwordChanged(elm);
}

App.Actions.WEB.passwordChanged = function(elm) { 
    var ref = $(elm).parents('.ftptable');
    if (ref.find('.vst-email-alert-on-psw').length == 0) {
        var inp_name = ref.find('.v-ftp-user-is-new').prop('name');
        inp_name = inp_name.replace('is_new', 'v_ftp_email');
        ref.find('tr:last').after('<tr>\
                                        <td class="vst-text step-left input-label">\
                                             Send FTP credentials to email\
                                        </td>\
                                    </tr>\
                                    <tr>\
                                        <td class="step-left">\
                                            <input type="text" value="" name="' + inp_name + '" class="vst-input vst-email-alert-on-psw">\
                                        </td>\
                                    </tr>');
    }
}

//
// Page entry point
App.Listeners.WEB.keypress_ftp_username();
App.Listeners.WEB.keypress_ftp_path();

$('.v-ftp-user-psw').on('keypress', function(evt) {
    var elm = $(evt.target);
    App.Actions.WEB.passwordChanged(elm);
});
