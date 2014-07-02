// JavaScript Document
$(document).ready(function(e) {
    $(document).on("touchmove MSPointerMove", function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	$("#playtitlebutton").click(function(e) {
		$("#titlebuttonbox").fadeOut(300,"linear",function(){
			$("#settingbuttonbox").fadeIn(300,"linear");
		});
    });
});