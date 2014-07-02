// JavaScript Document
$(document).ready(function(e) {
    $(document).on("touchmove MSPointerMove", function(e) {
		e.preventDefault();
	});
	$("#playtitlebutton").click(function(e) {
        alert("H");
		$("#titlebuttonbox").fadeOut(300,"linear",function(){
			$("#settingbuttonbox").fadeIn(300,"linear");
		});
    });
});