$(document).ready(function(e){
	var MessageReceived=function(e){
		window.removeEventListener("message",MessageReceived);
		MessageReceived=null;
		eval(e.data);
		window.parent.postMessage("_","*");
	}
	window.addEventListener("message",MessageReceived);
	window.parent.postMessage("_","*");
});