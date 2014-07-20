function InternationalManager(is_online,game_manager,is_host,websocket_url){
	this.OnSendLocalMessage=null;
	this.OnInitialised=null;
	that=this;
	var GameManager=null;
	var Gateway=null;
	if(!is_online||is_host){
		GameManager=game_manager;
		GameManager.OnSendMessage=function(message){
			if(message==="")return;
			if(message.split(" ")[0]==="send"){
				if(Gateway!==null)Gateway.send(message);
				this.OnSendLocalMessage(message);
			}
		}
	}
	if(is_online){
		Gateway=new WebSocket(websocket_url);
		Gateway.onopen=function(){
			setInterval(function(){
				GateWay.send("ping");
			},30000);
			LocalMessageReceived("move"); // triggers a resend of the game state
			that.OnInitialised();
		}
	}
	else{
		setTimeout(function(){
			LocalMessageReceived("move"); // triggers a resend of the game state
			that.OnInitialised();
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
				this.OnSendLocalMessage(message);
			}
		}
	}
	this.MessageReceived=LocalMessageReceived;
	if(Gateway!==null)Gateway.onmessage=function(event){
		ForeignMessageReceived(event.data);
	}
}