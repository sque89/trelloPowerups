var t = TrelloPowerUp.iframe();
t.lists('all').then(function (lists) {
    t.get('board', 'shared').then(function (data) {
        lists.forEach(function (list) {
            var selected = data.initialList === list.id ? ' selected' : '';
            var excluded = data.excludedLists && data.excludedLists.includes(list.id) ? ' checked' : '';
            $('#selectInitialList').append('<option value="' + list.id + '"' + selected + '>' + list.name + '</option>');
            $('#excludedListsContainer').append('<input id="exclude' + list.id + '" type="checkbox" value="' + list.id + '"' + excluded + ' />&nbsp;<label style="display: inline-block" for="exclude' + list.id + '">' + list.name + '</label><br />');
        });
        $("#textNumberOfPossibleVotes").val(data.possibleVotes);
        $("#checkboxVotingActive").prop('checked', data.votingActive);
    });

    $('#save').click(function () {
        var excludedLists = [];
        $('#excludedListsContainer input[type=checkbox]').each(function(index, checkbox) {
            if (checkbox.checked) {
                excludedLists.push($(checkbox).val());
            }
        });
        console.log($("#checkboxVotingActive").get('checked'));
        t.set('board', 'shared', {
            'initialList': $('#selectInitialList').val(),
            'excludedLists': excludedLists,
            'possibleVotes': $("#textNumberOfPossibleVotes").val(),
            'votingActive': $("#checkboxVotingActive").prop('checked')
        });
    });
});