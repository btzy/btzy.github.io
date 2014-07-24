function LocalManager(screen_callback){
	this.OnSendInternationalMessage=null;
	var that=this;
	var iframes={};
	this.AddPlayer=function(iframe_element,display_name){
		var rand=Math.random().toString()+((performance.now)?performance.now().toString():(new Date()).getTime().toString());
		iframes[rand]=iframe_element;
		this.OnSendInternationalMessage("move "+rand+" join "+display_name); // to sign up for game
	}
	window.addEventListener("message",function(e){
		var sender_id=null;
		if(e.origin==="null"&&e.data==="_"){
			if(AwaitingIframeLoad!==null)AwaitingIframeLoad();
		}
		for(var id in iframes){
			if(iframe[id].contentWindow===e.source){
				sender_id=id;
				break;
			}
		}
		if(e.origin==="null"&&sender_id!==null){
			if(e.data==="_"){
			}
			else{
				that.OnSendInternationalMessage("move "+sender_id+" "+e.data);
			}
		}
	});
	this.InternationalMessageReceived=function(message){
		messageparts=message.split(" ");
		if(messageparts<2)return;
		var command=messageparts.shift();
		var remaining_message=messageparts.join(" ");
		if(command==="send"){
			var message_object=JSON.parse(remaining_message);
			if(("CardsLeft" in message_object)&&("Player" in message_object)&&("Table" in message_object)&&("Advance" in message_object)){
				for(var id in iframes){
					var cleaned_object={};
					cleaned_object.CardsLeft=message_object.CardsLeft;
					cleaned_object.Table=message_object.CardsLeft;
					var index=null;
					for(var i=0;i<message_object.Player.length;++i){
						if(message_object.Player[i][0]===id){
							cleaned_object.Points=message_object.Player[i][2];
							cleaned_object.Cards=message_object.Player[i][4];
							receiver_iframe=iframes[id].contentWindow.postMessage(JSON.stringify(cleaned_object),"*");
							break;
						}
					}
				}
			}
			screen_callback(remaining_message);
		}
	}
}