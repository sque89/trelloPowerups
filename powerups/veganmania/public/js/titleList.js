var t = TrelloPowerUp.iframe();

t.lists('all').then(function (lists) {
    lists.forEach(function (list) {
        $('#selectList').append('<option value="' + list.id + '">' + list.name + '</option>');
    });
});

$("#showList").click(function () {
    t.cards('all').then(function (cards) {
        var cardsInSelectedList = _.filter(cards, {idList: $('#selectList').val()});
        var titles = [];
        cardsInSelectedList.forEach(function (card) {
            titles.push(card.name);
        });
        t.modal({
            url: '../views/titleListModal.html',
            args: {titles: titles},
            accentColor: 'green',
            height: 500,
            fullscreen: false
        });
    });
});