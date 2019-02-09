var t = TrelloPowerUp.iframe();

t.get('card', 'shared', 'contactDataMail').then(function(mail) {
    $("#contactMail").val(mail);

    $("#buttonSubmit").click(function() {
        t.set('card', 'shared', 'contactDataMail', $("#contactMail").val());
    });
});