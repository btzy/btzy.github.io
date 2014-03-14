$(document).ready(function() {
    $("#faderbox").css("opacity","0.5");
	$("#newbutton").click(function() {
        $("#faderbox").css("display","block");
		$("#newbox").css("display","block");
		$("#mapwidth").val(2970);
		$("#mapheight").val(2100);
		$("#anglestep").val(20);
		updateanglecalculation();
    });
	$("#anglestep").on("input propertychange",updateanglecalculation);
	function updateanglecalculation(){
		$("#anglestep").parent().find("span").html(parseFloat((90/$("#anglestep").val()).toFixed(10)));
	}
	$("#anglestep").change(verifyanglestep);
	$("#mapwidth").change(verifymapsize);
	$("#mapheight").change(verifymapsize);
	function verifymapsize(){
		var intwidth=parseInt($("#mapwidth").val());
		var intheight=parseInt($("#mapheight").val());
		if(intwidth!=$("#mapwidth").val()||intheight!=$("#mapheight").val()||intwidth<=0||intheight<=0){
			alert("Map width and height must be a positive integer!");
			return false;
		}
		return true;
	}
	function verifyanglestep(){
		var intval=parseInt($("#anglestep").val());
		if(intval!=$("#anglestep").val()||intval<=0||intval>100){
			alert("Angle step must be an integer between 1 and 100 inclusive!");
			return false;
		}
		return true;
	}
	$("#cancelbutton").click(function() {
        $("#faderbox").css("display","none");
		$("#newbox").css("display","none");
    });
	$("#createbutton").click(function() {
        if(verifymapsize()&&verifyanglestep()){
			createnewsvg($("#mapwidth").val(),$("#mapheight").val(),$("#anglestep").val());
			$("#faderbox").css("display","none");
			$("#newbox").css("display","none");
		}
    });
	function createnewsvg(width,height,anglestep){
	}
});