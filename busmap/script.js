$(document).ready(function(e) {
    $("#faderbox").css("opacity","0.5");
	$("#newbutton").click(function(e) {
        $("faderbox").css("display","block");
		$("#newbox").css("display","block");
    });
});