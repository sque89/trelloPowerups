var t = TrelloPowerUp.iframe();

t.arg("mails").forEach(function (mail) {
    if (mail) {
        $("#mailingList").append(mail + ";");
    }
});

