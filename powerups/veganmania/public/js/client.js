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
                    if (_.includes(data.listsToDelete, card.idList)) {
                        window.Trello.delete('/cards/' + card.id);
                    }
                    if ((!data.excludedLists || !data.excludedLists.includes(card.idList)) && !_.includes(data.listsToDelete, card.idList)) {
                        window.Trello.put('/cards/' + card.id + '/idList/', {value: data.initialList});
                    }
                });
            }, 1000 * index);
        });
    });
};

var resetVotes = function (t, options) {
    t.member('id').then(function (currentMember) {
        t.get('board', 'shared', 'votes').then(function (currentVotes) {
            _.remove(currentVotes, function (value) {
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

var showContactDataPanel = function (t, options) {
    t.popup({
        title: 'Kontaktdaten',
        url: './views/contactData.html',
        height: 300,
        width: 300
    });
};

var showMailingListPanel = function (t, options) {
    t.popup({
        title: 'Mailing-Liste',
        url: './views/mailingList.html',
        height: 300,
        width: 300
    });
};

var showTitleListPanel = function (t, options) {
    t.popup({
        title: 'Titel-Liste',
        url: './views/titleList.html',
        height: 300,
        width: 300
    });
};

Trello.authorize({
    type: 'popup',
    name: 'Power-Up Veganmania',
    scope: {
        read: 'true',
        write: 'true'
    },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
});

TrelloPowerUp.initialize({
    'board-buttons': function (t, options) {
        return [{
                text: 'Board zurücksetzen',
                condition: 'admin',
                callback: resetBoard
            }, {
                text: 'Eigene Abstimmungen zurücksetzen',
                condition: 'edit',
                callback: resetVotes
            }, {
                text: 'Mailing-Liste anzeigen',
                condition: 'edit',
                callback: showMailingListPanel
            }, {
                text: 'Titel-Liste anzeigen',
                condition: 'edit',
                callback: showTitleListPanel
            }];
    },
    'card-buttons': function (t, options) {
        return [{
                text: 'Abstimmen',
                condition: 'edit',
                callback: showVotingPanel
            }, {
                text: 'Kontaktdaten',
                condition: 'edit',
                callback: showContactDataPanel
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
                t.get('board', 'shared', 'votingActive', false).then(function (votingActive) {
                    if (votingActive) {
                        deferred.resolve({
                            text: 'Stimmen: ' + _.filter(currentVotes, {card: card.id}).length,
                            color: 'green'
                        });
                    } else {
                        deferred.resolve({});
                    }
                });
            });
        });
        return deferred.promise();
    },
    'list-sorters': function (t) {
        return t.list('name', 'id')
                .then(function (list) {
                    return [{
                            text: "Kartenname",
                            callback: function (t, opts) {
                                // Trello will call this if the user clicks on this sort
                                // opts.cards contains all card objects in the list
                                var sortedCards = opts.cards.sort(
                                        function (a, b) {
                                            if (a.name > b.name) {
                                                return 1;
                                            } else if (b.name > a.name) {
                                                return -1;
                                            }
                                            return 0;
                                        });

                                return {
                                    sortedIds: sortedCards.map(function (c) {
                                        return c.id;
                                    })
                                };
                            }
                        }];
                });
    }
});