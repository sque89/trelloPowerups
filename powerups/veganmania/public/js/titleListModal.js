var t = TrelloPowerUp.iframe();

t.arg("titles").forEach(function (title) {
    if (title) {
        $("#titleList").append(title + "<br />");
    }
});

