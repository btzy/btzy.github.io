// JavaScript Document
$(document).ready(function(e) {
    $(document).on("touchmove", function(e) {
		e.preventDefault();
	});
	$("#playtitlebutton").click(function(e) {
		$("#titlebuttonflex").animate({opacity:0},300,"linear",function(){
			$("#titlebuttonflex").addClass("displaynone");
			$("#settingbuttonflex").css({opacity:0});
			$("#settingbuttonflex").removeClass("displaynone");
			$("#settingbuttonflex").animate({opacity:1},300,"linear");
		});
    });
});