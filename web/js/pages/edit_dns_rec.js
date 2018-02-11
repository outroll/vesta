//
//
// Generates a random API key
randomString = function() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var string_length = 64;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substr(rnum, 1);
    }
    document.v_edit_dns_rec.v_ddns_key.value = randomstring;
    updateDdnsUrl();
};

$(document).ready(function() {
    $('input[name=v_ddns_key]').change(function(){
        updateDdnsUrl();
    });
});

updateDdnsUrl = function () {
    $('#ddns-url').val($('#ddns-base-url').val() + $('input[name=v_ddns_key]').val());
};