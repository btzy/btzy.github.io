if(!window.$){
	alert("jQuery is not supported. Get a new browser.");
}
$(document).ready(function(e) {
    /*var ie = (function(){
		var undef, v = 3, div = document.createElement('div');
		while (
			div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
			div.getElementsByTagName('i')[0]
		);
		return v> 4 ? v : undef;
	}());
	if(ie)alert("Still using Internet Explorer? It (probably) doesn't work here. Switch to Chrome or Firefox.");*/
	if(!window.SVGSVGElement){
		alert("SVG is not supported. Get a new browser.");
	}
	
	
	var svgmanager=new SvgManager(document.getElementById("mainsvg"));
	var levelmanager=new LevelManager();
	levelmanager.OnUpdateCallsFromSvg=function(callpoint,callcurve,callall){
		svgmanager.UpdateCalls([(callpoint)?levelmanager.CheckNewPoint:null,(callcurve)?levelmanager.CheckNewCurve:null,(callall)?levelmanager.CheckAll:null]);
	}
	levelmanager.OnLevelComplete=function(selectedpoints,selectedcurves,continuable){
		svgmanager.SelectAndFadeOthers(selectedpoints,selectedcurves);
		//alert("Level Complete!");
		if(continuable){
			$("#header").removeClass("headertitle question complete").addClass("complete").html('Level Complete! &raquo; <div id="nextlevelbutton" class="headerbutton">Next Level</div>');
			$("#nextlevelbutton").click(function(e) {
				levelmanager.StartNextLevel();
			});
		}
		else{
			$("#header").removeClass("headertitle question complete").addClass("complete").html('Level Complete! &raquo; <div id="nextlevelbutton" class="headerbutton">Back to Menu</div>');
			$("#nextlevelbutton").click(function(e) {
				levelmanager.OpenLevelSelector();
			});
		}
	}
	levelmanager.OnStart=function(startdata){
		$("#header").removeClass("headertitle question complete").addClass("question").html(startdata.Question+'<div id="skiplevelbutton" class="headerbutton">Skip Level</div>');
		$("#skiplevelbutton").click(function(e) {
            svgmanager.ResetSvg();
			$("#header").removeClass("headertitle question complete").addClass("complete").html('You resigned... <div id="nextlevelbutton" class="headerbutton">Next Level</div>');
			$("#nextlevelbutton").click(function(e) {
				levelmanager.StartNextLevel();
			});
        });
		svgmanager.ResetSvg();
		for(var i=0;i<startdata.Points.length;++i){
			svgmanager.AddPoint(startdata.Points[i]);
		}
		for(var i=0;i<startdata.Curves.length;++i){
			svgmanager.AddCurve(startdata.Curves[i]);
		}
		if("HighlightedPoints" in startdata){
			for(var i=0;i<startdata.HighlightedPoints.length;++i){
				svgmanager.AddHighlightedPoint(startdata.HighlightedPoints[i]);
			}
		}
		if("HighlightedCurves" in startdata){
			for(var i=0;i<startdata.HighlightedCurves.length;++i){
				svgmanager.AddHighlightedCurve(startdata.HighlightedCurves[i]);
			}
		}
	}
	$("#compass").click(function(e) {
        if($(this).hasClass("selected")){
			$(".sidebutton").removeClass("selected");
			svgmanager.ChangeCurveType(CurveType.None);
		}
		else{
			$(".sidebutton").removeClass("selected");
			$(this).addClass("selected");
			svgmanager.ChangeCurveType(CurveType.Circle);
		}
    });
	$("#straightedge").click(function(e) {
        if($(this).hasClass("selected")){
			$(".sidebutton").removeClass("selected");
			svgmanager.ChangeCurveType(CurveType.None);
		}
		else{
			$(".sidebutton").removeClass("selected");
			$(this).addClass("selected");
			svgmanager.ChangeCurveType(CurveType.Line);
		}
    });
	$("#challenge").click(function(e) {
        levelmanager.OpenLevelSelector();
    });
	$("#sticky").change(function(e) {
        svgmanager.ChangeStickyLimit(parseInt($(this).val()));
    });
	$("#drag").change(function(e) {
        svgmanager.ChangeDragState($(this).is(":checked"));
    });
	$("#clearall").click(function(e) {
        svgmanager.ResetSvg();
    });
	$("body").keydown(function(e) {
        if(e.which==16){ // shift
			svgmanager.StickyPoints=false;
			$("#nopoints").removeClass("modifierunselected").addClass("modifierselected");
			e.preventDefault();
		}
		else if(e.which==17){
			svgmanager.StickyCurves=false;
			$("#nocurves").removeClass("modifierunselected").addClass("modifierselected");
			e.preventDefault();
		}
    });
	$("body").keyup(function(e) {
        if(e.which==16){ // shift
			svgmanager.StickyPoints=true;
			$("#nopoints").removeClass("modifierselected").addClass("modifierunselected");
			e.preventDefault();
		}
		else if(e.which==17){
			svgmanager.StickyCurves=true;
			$("#nocurves").removeClass("modifierselected").addClass("modifierunselected");
			e.preventDefault();
		}
    });
});