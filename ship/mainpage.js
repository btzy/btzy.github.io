// JavaScript Document
$(document).ready(function(e) {
	$(document).on("touchmove", function(e) {
		e.preventDefault();
	});
	MapRenderer.Init();
	LoadDefaultMaps();
	var requestfullscreen=(function(){
		if(document.documentElement.requestFullscreen){
		    return function(elem){elem.requestFullscreen();};
		}
		else if(document.documentElement.msRequestFullscreen){
		    return function(elem){elem.msRequestFullscreen();};
		}
		else if(document.documentElement.mozRequestFullScreen){
		    return function(elem){elem.mozRequestFullScreen();};
		}
		else if(document.documentElement.webkitRequestFullscreen){
		    return function(elem){elem.webkitRequestFullscreen();};
		}
		else{
			return null;
		}
	})();
	var requestpointerlock=(function(){
		if(document.documentElement.requestPointerLock){
		    return function(elem){elem.requestPointerLock();};
		}
		else if(document.documentElement.mozRequestPointerLock){
		    return function(elem){elem.mozRequestPointerLock();};
		}
		else if(document.documentElement.webkitRequestPointerLock){
		    return function(elem){elem.webkitRequestPointerLock();};
		}
		else{
			return null;
		}
	})();
	$("#playtitlebutton").click(function(e) {
		$("#titlebuttonflex").animate({opacity:0},300,"linear",function(){
			$("#titlebuttonflex").addClass("displaynone");
			$("#settingbuttonflex").css({opacity:0});
			$("#settingbuttonflex").removeClass("displaynone");
			$("#settingbuttonflex").animate({opacity:1},300,"linear");
		});
    });
	if(requestfullscreen){
		$("#fullscreensettingbutton").removeClass("settingbuttonoff").addClass("settingbuttonon").click(function(e) {
            $(this).toggleClass("settingbuttonoff settingbuttonon");
        });
	}
	else{
		$("#fullscreensettingbutton").addClass("settingbuttondisabled");
	}
	if(requestpointerlock){
		$("#pointerlocksettingbutton").removeClass("settingbuttonoff").addClass("settingbuttonon").click(function(e) {
            $(this).toggleClass("settingbuttonoff settingbuttonon");
        });
	}
	else{
		$("#pointerlocksettingbutton").addClass("settingbuttondisabled");
	}
});