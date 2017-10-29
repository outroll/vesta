$(document).ready(function(){
    $('select[name=v_filemanager]').change(function(){
        if($(this).val() == 'yes'){
            $('.filemanager.description').show();
        } else {
            $('.filemanager.description').hide();
        }
    });

    $('select[name=v_sftp]').change(function(){
        if($(this).val() == 'yes'){
            $('.sftp.description').show();
        } else {
            $('.sftp.description').hide();
        }
    });
    $('select[name=v_backup_type]').change(function(){
        if($(this).val() == 's3'){
            $('input[name=v_backup_bucket]').closest('tr').show().prev().show();
            $('input[name=v_backup_host]').closest('tr').show().prev().show();
            $('input[name=v_backup_host]').replaceWith('<select class="vst-list" name="v_backup_host">' + ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'ap-southeast-1', 'ap-southeast-2', 'sa-east-1'].reduce(function (data, region) {
                    return data + "\n" + ' <option value="' + region + '">' + region + '</option>';
                }) + '</select>');

        } else {
            $('input[name=v_backup_bucket]').closest('tr').hide().prev().hide();
            $('select[name=v_backup_host]').replaceWith('<input type="text" size="20" class="vst-input" name="v_backup_host" value="' +  (typeof $('input[name=v_backup_host]').val() === 'string' ? $('input[name=v_backup_host]').val() : '') + '">');
        }
    });
});


function toggle_letsencrypt(elm) {
    if ($(elm).attr('checked')) {
        $('#ssl textarea[name=v_ssl_crt],#ssl textarea[name=v_ssl_key], #ssl textarea[name=v_ssl_ca]').attr('disabled', 'disabled');
        $('#generate-csr').hide();
        if(!$('.lets-encrypt-note').hasClass('enabled')) {
            $('.lets-encrypt-note').show();
        }
    }
    else {
        $('#ssl textarea[name=v_ssl_crt],#ssl textarea[name=v_ssl_key], #ssl textarea[name=v_ssl_ca]').removeAttr('disabled');
        $('#generate-csr').show();
	    $('.lets-encrypt-note').hide();
    }
}