/* global TrelloPowerUp */

var authenticationSuccess = function() {
  console.log('Successful authentication');
};

var authenticationFailure = function() {
  console.log('Failed authentication');
};

var resetBoard = function(t, options) {
	t.cards('all').then(function(cards) {
		cards.forEach(function(card) {
			card.members.forEach(function(member) {
				window.Trello.delete('/cards/' + card.id + '/idMembers/' + member.id);
			});
			
			t.get('board', 'private', 'initial-list').then(function(initialList) {
				window.Trello.put('/cards/' + card.id + '/idList/', {value: initialList});
			});
		});
	});
	t.board('members').then(function(boardMembers) {
		console.log(boardMembers);
		boardMembers.members.forEach(function(boardMember) {
			t.set('member', 'private', 'maxVotesFavorite', 25);
		});
	});
};

var showVotingPanel = function(t, options) {
	t.popup({
		title: 'Teilnehmer-Abstimmung',
		url: './voting.html',
		height: 300,
		width: 300
	});
};

Trello.authorize({
  type: 'popup',
  name: 'Power-Up Veganmania',
  scope: {
    read: 'true',
    write: 'true' },
  expiration: 'never',
  success: authenticationSuccess,
  error: authenticationFailure
});

TrelloPowerUp.initialize({
	'board-buttons': function(t, options) {
		return [{
			text: 'Reset Board',
			condition: 'admin',
			callback: resetBoard
		}];
	},
	'card-buttons': function(t, options) {
		return [{
			text: 'Voting',
			condition: 'edit',
			callback: showVotingPanel
		}];
	},
	'show-settings': function(t, options) {
		return t.popup({
			title: 'Power-UP Veganmania Settings',
			url: './settings.html',
			height: 184,
			condition: 'admin'
		});
	}
});