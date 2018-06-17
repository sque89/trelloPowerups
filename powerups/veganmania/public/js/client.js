/* global TrelloPowerUp */

var authenticationSuccess = function () {
    console.log('Successful authentication');
};

var authenticationFailure = function () {
    console.log('Failed authentication');
};

var resetBoard = function (t, options) {
    t.cards('all').then(function (cards) {
        cards.forEach(function (card, index) {
            setTimeout(function () {
                card.members.forEach(function (member) {
                    window.Trello.delete('/cards/' + card.id + '/idMembers/' + member.id);
                });

                window.Trello.get('/cards/' + card.id + '/actions').then(function (cardActions) {
                    cardActions.forEach(function (action) {
                        if (action.type === 'commentCard') {
                            window.Trello.delete('/actions/' + action.id);
                        }
                    });
                });

                t.get('board', 'shared').then(function (data) {
                    if (!data.excludedLists.includes(card.idList)) {
                        window.Trello.put('/cards/' + card.id + '/idList/', {value: data.initialList});
                    }
                });
            }, 1000 * index);
        });
    });
};

var resetVotes = function(t, options) {
    t.member('id').then(function(currentMember) {
        t.get('board', 'shared', 'votes').then(function(currentVotes) {
            _.remove(currentVotes, function(value) {
                return value.member === currentMember.id;
            });
            t.set('board', 'shared', 'votes', currentVotes);
        });
    });
};

var showVotingPanel = function (t, options) {
    t.popup({
        title: 'Teilnehmer-Abstimmung',
        url: './views/voting.html',
        height: 300,
        width: 300
    });
};

Trello.authorize({
    type: 'popup',
    name: 'Power-Up Veganmania',
    scope: {
        read: 'true',
        write: 'true'},
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
});

TrelloPowerUp.initialize({
    'board-buttons': function (t, options) {
        return [
            {
                text: 'Reset Board',
                condition: 'admin',
                callback: resetBoard
            },
            {
                text: 'Abstimmungen zurücksetzen',
                condition: 'edit',
                callback: resetVotes
            }
        ];
    },
    'card-buttons': function (t, options) {
        return [{
                text: 'Abstimmen',
                condition: 'edit',
                callback: showVotingPanel
            }];
    },
    'show-settings': function (t, options) {
        return t.popup({
            title: 'Power-UP Veganmania Settings',
            url: './views/settings.html',
            height: 184,
            condition: 'admin'
        });
    },
    'card-badges': function (t, opts) {
        var deferred = $.Deferred();
        t.get('board', 'shared', 'votes', []).then(function (currentVotes) {
            t.card('id').then(function (card) {
                deferred.resolve({
                    text: 'Stimmen: ' + _.filter(currentVotes, {card: card.id}).length,
                    color: 'green'
                });
            });
        });
        return deferred.promise();
    }
});