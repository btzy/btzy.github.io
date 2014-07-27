function RandomString(length){
	var result="";
	var possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for(var i=0;i<length;++i){
		result+=possible.charAt(Math.floor(Math.random()*possible.length)%possible.length);
	}
	return result;
}
var international_manager=null;
var local_manager=null;
$(document).ready(function(e) {
	
	
	var mode=null;
	
	var DoCommonSetUp=function(){
		local_manager=new LocalManager(UpdateScreen);
		international_manager.OnSendLocalMessage=local_manager.InternationalMessageReceived;
		local_manager.OnSendInternationalMessage=international_manager.MessageReceived;
		international_manager.OnInitialised=function(){
			// Allow user to select AIs?
			//alert("connected to mbed!");
			$("#gameselector").css("display","none");
			// Show "downloading data..."
		}
		$("#modeselector").html("Connecting...");
	}
	$("#mode-single").click(function(e) {
		international_manager=new InternationalManager(false,new NimmtManager());
		DoCommonSetUp();
    });
	$("#mode-multi-host").click(function(e) {
		var gameid=null;
		do{
			gameid=prompt("Please enter a unique game name (alphabet only, no spaces):\n(Please record the game name and pass it to all other players connecting to your game)",RandomString(10));
			if(gameid===null)return;
		}while(!(/^[a-zA-Z]+$/).test(gameid));
		international_manager=new InternationalManager(true,new NimmtManager(),true,"ws://sockets.mbed.org:443/ws/"+gameid+"/rw");
		DoCommonSetUp();
    });
	$("#mode-multi-join").click(function(e) {
		var gameid=null;
		do{
			gameid=prompt("Please enter the game name:","");
			if(gameid===null)return;
		}while(!(/^[a-zA-Z]+$/).test(gameid));
		international_manager=new InternationalManager(true,null,false,"ws://sockets.mbed.org:443/ws/"+gameid+"/rw");
		DoCommonSetUp();
    });
	if(!("WebSocket" in window)||window.WebSocket==undefined){
		$("#mode-multi-host").remove();
		$("#mode-multi-join").remove();
		$("#modeselector").append("Your browser does not support WebSocket, so multiplayer mode cannot be played.");
	}
});