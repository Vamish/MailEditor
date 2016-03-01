$(function() {
	$('.J_BtnToggle').click(function() {
		var a = $(this).siblings('.u-btn-grid .dropdown');
		if (a.is(':hidden')) {
			$('.u-btn-grid .dropdown').hide();
			$(this).siblings('.u-btn-grid .dropdown').show();
		} else {
			a.hide();
		}
	});
})
