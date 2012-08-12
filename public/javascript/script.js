$(document).ready(function() {
    $('#settingsLink').click(function() {
        var myDialog = $('#settingsDialog')
            .dialog({ autoOpen: false,  buttons: { "OK":  function() {}, "Cancel": function() {} }});
        myDialog.dialog('open');
        return false;
    });

    $('#languageBox').autocomplete({source:  "/getLanguages", minLength: 3});
});
