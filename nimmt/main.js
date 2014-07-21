function RandomString(length){
	var result="";
	var possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for(var i=0;i<length;++i){
		result+=possible.charAt(Math.floor(Math.random()*possible.length)%possible.length);
	}
	return result;
}
$(document).ready(function(e) {
	var international_manager=null;
	var local_manager=null;
	
	var DoCommonSetUp=function(){
		local_manager=new LocalManager(UpdateScreen);
		international_manager.OnSendLocalMessage=local_manager.InternationalMessageReceived;
		local_manager.OnSendInternationalMessage=international_manager.MessageReceived;
		international_manager.OnInitialised=function(){
			// Allow user to select AIs?
			alert("connected to mbed!");
			$("#gameselector").css("display","none");
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
		}while(!(/^[a-zA-Z]+$/).test(gameid));
		international_manager=new InternationalManager(true,new NimmtManager(),true,"ws://sockets.mbed.org/ws/"+gameid+"/rw:443");
		DoCommonSetUp();
    });
	$("#mode-multi-join").click(function(e) {
        var gameid=null;
		do{
			gameid=prompt("Please enter the game name:","");
		}while(!(/^[a-zA-Z]+$/).test(gameid));
		international_manager=new InternationalManager(true,null,false,"ws://sockets.mbed.org/ws/"+gameid+"/rw:443");
		DoCommonSetUp();
    });
	if(!("WebSocket" in window)||window.WebSocket==undefined){
		$("#mode-multi-host").remove();
		$("#mode-multi-join").remove();
		$("#modeselector").append("No WebSocket support detected.");
	}
});