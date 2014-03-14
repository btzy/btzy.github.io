$(document).ready(function() {
	var data_zoom=1;
	var data_angle=1;
	var edit_lock=true;
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
		$("#svgmover").css("width",width+'px');
		$("#svgmover").css("height",height+'px');
		//$("#svgmover").html('<svg width="'+width+'" height="'+height+'"></svg>');
		//$(SVG("svg").attr("width",width).attr("height",height)).appendTo($("#svgmover"));
		//svg=$(SVG("svg"));
		//svg.data("angle",anglestep);
		$("#svgmover").svg({"width":width,"height":height});
		//$("#svgmover").svg("get").attr("data-angle",anglestep);
		data_angle=anglestep;
		data_zoom=Math.min($("#svgbox").width()/width,$("#svgbox").height()/height);
		$("svg").attr("data-angle",data_angle);
		$("svg").attr("data-zoom",data_zoom);
		scalesvgmover();
		translatesvgmovertocenter();
		setTimeout(function(){edit_lock=false;},500);
	}
	$("#svgmover").mousemove(function(e) {
        var x=e.pageX-$("#svgmover").offset().left;
		var y=e.pageY-$("#svgmover").offset().top;
    });
	function SVG(tag){
		return document.createElementNS('http://www.w3.org/2000/svg', tag);
	}
	function scalesvgmover(){
		$("#svgmover").css({transform:"scale("+data_zoom+","+data_zoom+")","-webkit-transform":"scale("+data_zoom+","+data_zoom+")","-moz-transform":"scale("+data_zoom+","+data_zoom+")","-o-transform":"scale("+data_zoom+","+data_zoom+")","-ms-transform":"scale("+data_zoom+","+data_zoom+")"});
	}
	function translatesvgmovertocenter(){
		//$("#svgmover").
	}
});