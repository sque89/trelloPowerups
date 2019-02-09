var t = TrelloPowerUp.iframe();

t.lists('all').then(function (lists) {
    lists.forEach(function (list) {
        $('#selectList').append('<option value="' + list.id + '">' + list.name + '</option>');
    });
});

$("#showList").click(function () {
    t.cards('all').then(function (cards) {
        var cardsInSelectedList = _.filter(cards, {idList: $('#selectList').val()});
        var mails = [];
        cardsInSelectedList.forEach(function (card) {
            t.get(card.id, 'shared', 'contactDataMail').then(function (mail) {
                mails.push(mail || null);
                if (mails.length === cardsInSelectedList.length) {
                    t.modal({
                        url: '../views/mailingListModal.html',
                        args: {mails: mails},
                        accentColor: 'green',
                        height: 500,
                        fullscreen: false
                    });
                }
            });
        });
    });
});