var t = TrelloPowerUp.iframe();
t.lists('all').then(function(lists) {
	t.get('board', 'private', 'initial-list').then(function(initialList) {
		lists.forEach(function(list) {
			var selected = initialList === list.id ? ' selected' : '';
			$('#selectInitialList').append('<option value="' + list.id + '"' + selected + '>' + list.name + '</option>');
		});
	});
	
	$('#save').click(function() {
		t.set('board', 'private', 'initial-list', $('#selectInitialList').val());
	});
});