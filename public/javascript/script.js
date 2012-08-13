var selectedLanguage;



$(document).ready(function() {
    $('#settingsLink').click(function() {
        var myDialog = $('#settingsDialog')
            .dialog({ autoOpen: false, title: 'Select Languages', width:400,  buttons: { "OK":  function() {}, "Cancel": function() {} }});
        myDialog.dialog('open');
        return false;
    });

    $('#languageBox').autocomplete({
        source:  "/getLanguages", minLength: 3,
        select: function(ev, ui) {
            var language = ui.item.value,
            span = $('<span>').text(language).append('<a href="#">Close</a>');
            $('#languageList').append(span);
        }
    });
});
