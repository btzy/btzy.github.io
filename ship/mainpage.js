// JavaScript Document
$(document).ready(function(e) {
    $(document.body).on("touchmove MSPointerMove", function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	$("#playtitlebutton").click(function(e) {
        alert("H");
		$("#titlebuttonbox").fadeOut(300,"linear",function(){
			$("#settingbuttonbox").fadeIn(300,"linear");
		});
    });
});