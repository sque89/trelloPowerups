var t = TrelloPowerUp.iframe();

function setVotingButtonStatus(votePossible, votesLeft) {
    if (votePossible) {
        $("#buttonVote").html("Für diese Karte abstimmen<br />Noch " + votesLeft + " übrig");
        $("#buttonVote").data('vote-possible', true);
    } else {
        $("#buttonVote").html("Abstimmung für diese Karte löschen");
        $("#buttonVote").data('vote-possible', false);
    }
}

function handleVote(voted, memberId, cardId, currentVotes, votesLeft) {
    if (voted) {
        currentVotes.push({member: memberId, card: cardId});
    } else {
        _.remove(currentVotes, {member: memberId, card: cardId});
    }
    t.set('board', 'shared', 'votes', currentVotes).then(function () {
        setVotingButtonStatus(!voted, votesLeft);
        setVoteCounter(_.filter(currentVotes, {card: cardId}).length);
    });
}

function setVoteCounter(count) {
    $("#voteCount").html("Aktuelle Stimmen für diese Karte: " + count);
}

t.get('board', 'shared', 'votingActive', false).then(function (votingActive) {
    if (votingActive) {
        $("#votingInactive").hide();
        t.member('id').then(function (currentMember) {
            t.get('board', 'shared', 'votes', []).then(function (currentVotes) {
                t.get('board', 'shared', 'possibleVotes', 0).then(function (possibleVotes) {
                    var votesLeft = parseInt(possibleVotes) - _.filter(currentVotes, {member: currentMember.id}).length;
                    $("#buttonVote .favoriteVotesLeft").html(votesLeft);

                    t.card('id').then(function (card) {
                        setVoteCounter(_.filter(currentVotes, {card: card.id}).length);
                        if (votesLeft > 0) {
                            t.member('id').then(function (member) {
                                setVotingButtonStatus(!_.find(currentVotes, {member: member.id, card: card.id}), votesLeft);
                                $("#buttonVote").click(function () {
                                    handleVote($("#buttonVote").data('vote-possible') === true, member.id, card.id, currentVotes, votesLeft);
                                });
                            });
                        } else {
                            $("#buttonVote").html("Keine Stimmen mehr übrig");
                            $("#buttonVote").proü('disabled', true);
                        }
                    });
                });
            });
        });
    } else {
        $("#votingActive").hide();
        $("#votingInactive").show();
    }
});