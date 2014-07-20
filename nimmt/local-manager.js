function LocalManager(screen_callback){
	this.OnSendInternationalMessage=null;
	var iframes={};
	this.AddPlayer=function(iframe_element){
		var rand=Math.random().toString()+((performance.now)?performance.now().toString():(new Date()).getTime().toString());
		iframes[rand]=iframe_element;
		this.OnSendInternationalMessage("move "+rand); // to sign up for game
	}
	window.addEventListener("message",function(e){
		var sender_id=null;
		for(var id in iframes){
			if(iframe[id].contentWindow===e.source){
				sender_id=id;
				break;
			}
		}
		if(e.origin==="null"&&sender_id!==null){
			this.OnSendInternationalMessage("move "+sender_id+" "+e.data);
		}
	});
	this.InternationalMessageReceived=function(message){
		messageparts=message.split(" ");
		if(messageparts<2)return;
		var command=messageparts.shift();
		var remaining_message=messageparts.join(" ");
		if(command==="send"){
			for(var id in iframes){
				receiver_iframe=iframes[id].contentWindow.postMessage(remaining_message,"*");;
			}
			screen_callback(remaining_message);
		}
	}
}