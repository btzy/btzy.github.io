// JavaScript Document
$(document).ready(function(e) {
    $(document).on("touchmove", function(e) {
		e.preventDefault();
	});
	$("#playtitlebutton").click(function(e) {
		$("#titlebuttonbox").fadeOut(300,"linear",function(){
			$("#settingbuttonbox").fadeIn(300,"linear");
		});
    });
});