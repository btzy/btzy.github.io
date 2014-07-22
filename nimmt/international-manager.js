function InternationalManager(is_online,game_manager,is_host,websocket_url){
	this.OnSendLocalMessage=null;
	this.OnInitialised=null;
	var that=this;
	var GameManager=null;
	var Gateway=null;
	if(!is_online||is_host){
		GameManager=game_manager;
		GameManager.OnSendMessage=function(message){
			if(message==="")return;
			if(message.split(" ")[0]==="send"){
				if(Gateway!==null)Gateway.send(message);
				that.OnSendLocalMessage(message);
			}
		}
	}
	if(is_online){
		Gateway=new WebSocket(websocket_url);
		Gateway.onopen=function(){
			setInterval(function(){
				Gateway.send("ping");
			},30000);
			that.OnInitialised();
			LocalMessageReceived("move"); // triggers a resend of the game state
		}
		Gateway.onerror=function(error){
			if(confirm("WebSocket error: "+error+"\nPress \"OK\" to refresh the page.")){
				location.reload();
			}
		}
		Gateway.onmessage=function(e){
			ForeignMessageReceived(e.data);
		}
	}
	else{
		setTimeout(function(){
			that.OnInitialised();
			LocalMessageReceived("move"); // triggers a resend of the game state
		},10);
	}
	var LocalMessageReceived=function(message){
		if(message==="")return;
		if(message.split(" ")[0]==="move"){
			if(GameManager!==null){
				GameManager.MessageReceived(message);
			}
			else{
				Gateway.send(message);
			}
		}
	}
	var ForeignMessageReceived=function(message){
		if(message==="")return;
		if(message.split(" ")[0]==="move"){
			if(GameManager!==null){
				GameManager.MessageReceived(message);
			}
		}
		else if(message.split(" ")[0]==="send"){
			if(GameManager===null){
				that.OnSendLocalMessage(message);
			}
		}
	}
	this.MessageReceived=LocalMessageReceived;
}