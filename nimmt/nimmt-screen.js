var game_started=false;
var AI_list=[];
var sandbox_count=0;
var AwaitingIframeLoad=null;
function UpdateScreen(message){
	var message_object=JSON.parse(message);
	if(("CardsLeft" in message_object)&&("Player" in message_object)&&("Table" in message_object)){ // game object
		// wait for animations to stop before using this object.
		if(("PlayerId" in message_object)&&("PlayedCard" in message_object)){ // move object (1)
			
		}
		else if("Advance" in message_object){ // move object (2)
			
		}
	}
	else if("Player" in message_object){ // playerlist object
		$(".innerflex").addClass("hidden");
		$("#lobby").html("<table><tr><th>ID</th><th>Name</th></tr></table>");
		for(var i=0;i<message_object.Player.length;++i){
			$("#lobby").children("table").append("<tr><td>"+message_object.Player[i][0]+"</td><td>"+message_object.Player[i][1]+"</td></tr>");
		}
		var select_data="<option value=\"1\">Human</option>";
		for(var i=0;i<AI_list.length;++i){
			select_data+="<option value=\""+(i+2)+"\">"+AI_list[i][0]+"</option>";
		}
		$("#lobby").children("table").append("<tr><td colspan=\"2\">Add new player: <input type=\"text\" value=\"Player name\" id=\"player-name\" /><select id=\"player-type\">"+select_data+"</select><input type=\"button\" value=\"Add\" id=\"player-create\" /></td></tr>");
		var just_focused=false;
		$("#player-name").focus(function(e) {
			setTimeout((function(obj){return function(){obj.setSelectionRange(0,obj.value.length);}})(this),10);
        });
		$("#player-create").click(function(e) {
            // spawn the iframe
			var selected_index=parseInt($("#player-type").val())-2;
			if(selected_index==-1){ // human player
				$("#player-name").prop("disabled",true);
				$("#player-type").prop("disabled",true);
				$("#player-create").prop("disabled",true);
				// create the player controller iframe
				var iframe=$('<iframe sandbox="allow-scripts" id="player-controls" src="control.html"></iframe>');
				/*var width=$("#control").width();
				var height=$("#control").height();*/
				$("#control").html(iframe);
				frame_element=document.getElementById("player-controls");
				/*$(frame_element).height(height);
				$(frame_element).width(width);*/
					AwaitingIframeLoad=function(){
						local_manager.AddPlayer(frame_element,$("#player-name").val());
						AwaitingIframeLoad=null;
					}
			}
			else{ // AI
				$("#player-name").prop("disabled",true);
				$("#player-type").prop("disabled",true);
				$("#player-create").prop("disabled",true);
				ai_code=$.get(AI_list[selected_index][1],{},function(reply){
					var sandbox_id="sandbox_"+(sandbox_count++);
					var sandbox=$('<iframe sandbox="allow-scripts" class="sandbox" id="'+sandbox_id+'" src="ai.html"></iframe>');
					$("body").append(sandbox);
					frame_element=document.getElementById(sandbox_id);
					AwaitingIframeLoad=function(){
						frame_element.contentWindow.postMessage(reply,"*");
						AwaitingIframeLoad=function(){
							local_manager.AddPlayer(frame_element,$("#player-name").val());
							AwaitingIframeLoad=null;
						};
					}
				},"text").fail(function(){
					alert("Error! Please retry.");
				}).always(function(){
					// enable inputs again
				});
			}
        });
		$("#lobby").removeClass("hidden"); // unhide the #lobby
	}
}