$(document).ready(function(e){
	$("#start").click(function(e) {
        window.parent.postMessage("start ","*");
		$("#start").off();
    });
	window.addEventListener("message",function(e){
		var message=JSON.parse(e.data);
		if(("CardsLeft" in message)&&("Points" in message)&&("Cards" in message)&&("Table" in message)){
			$("body").html("");
			for(var i=0;i<message.Cards.length;++i){
				$("body").append("<div class=\"card\" id=\"c"+i+"><div>"+CreateCard(message.Cards[i])+"</div></div>");
			}
			$(".card").click(function(e) {
                var index=parseInt($(this).attr("id").substr(1));
				window.parent.postMessage("play "+message.Cards[index].toString(),"*");
				$(".card").off();
				$(".card:not(#c"+index+")").animate({opacity:0.4},400,"linear");
				$("#c"+index).css("border-color","#F00");
            });
		}
		else{
			$("body").html("<div id=\"start\">Click to start game</div>");
			$("#start").click(function(e) {
                window.parent.postMessage("start ","*");
				$("#start").off();
            });
		}
	});
	window.parent.postMessage("_","*");
});
/*
AI communication specification:

Incoming Message:
{CardsLeft:<int>;
Points:<int>;
Cards:<int array>; (sorted ascending)
Table:[<int array>,<int array>,<int array>,<int array>]; (sorted by largest card in stack)} as JSON object string

Outgoing Message:
"play"<space><int(value of card played)> as plain text
*/