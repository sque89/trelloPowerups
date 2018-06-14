var t = TrelloPowerUp.iframe();
t.get('member', 'private', 'maxVotesFavorite').then(function(maxVotesFavorite) {
	$("#favoriteVote .favoriteVotesLeft").html(maxVotesFavorite);
});