var game_started=false;
var AI_list=[];
var sandbox_count=0;
var AwaitingIframeLoad=null;
var Game_Object={};
var human_player=false;
function UpdateScreen(message){
	var message_object=JSON.parse(message);
	if(("CardsLeft" in message_object)&&("Player" in message_object)&&("Table" in message_object)){ // game object
		// wait for animations to stop before using this object.
		if(("PlayerId" in message_object)&&("PlayedCard" in message_object)){ // move object (1)
			// animate!
		}
		if(("Advance" in message_object)&&message_object.Advance===true){ // move object (2)
			// advance! (do not delete previously played card)
		}
		// compare with Game_Object:
		var isequal=true;
		if(isequal&&(Game_Object.CardsLeft!==message_object.CardsLeft||Game_Object.Player.length!==message_object.Player.length||Game_Object.Table.length!==message_object.Table.length)){
			isequal=false;
		}
		if(isequal){
			for(var i=0;i<Game_Object.Player.length;++i){
				if(Game_Object.Player[i][0]!==message_object.Player[i][0]||Game_Object.Player[i][1]!==message_object.Player[i][1]||Game_Object.Player[i][2]!==message_object.Player[i][2]||Game_Object.Player[i][3]!==message_object.Player[i][3]){
					isequal=false;
					break;
				}
			}
		}
		if(isequal){
			for(var i=0;i<Game_Object.Table.length;++i){
				if(Game_Object.Table[i].length!==message_object.Table[i].length){
					isequal=false;
					break;
				}
				for(var j=0;j<Game_Object.Table[i].length;++j){
					if(Game_Object.Table[i][j]!==message_object.Table[i][j]){
						isequal=false;
						break;
					}
				}
				if(!isequal)break;
			}
		}
		if(!isequal){
			Game_Object=message_object;
			if($("#screencontent").hasClass("hidden")){
				$(".innerflex").addClass("hidden");
				$("#screencontent").removeClass("hidden");
			}
			$("#playarea").html("");
			for(var i=0;i<Game_Object.Table.length;++i){
				var code='<div class="cardcolumn">';
				for(var j=0;j<Game_Object.Table[i].length;++j){
					code+='<div class="card" style="top:'+(j*30)+'px"><div>'+CreateCard(Game_Object.Table[i][j])+'</div></div>';
				}
				code+='</div>';
				$("#playarea").append(code);
			}
			// repaint display.
		}
		if(("Advance" in message_object)&&message_object.Advance===true){
			// delete the previously played card. [3]
		}
	}
	else if("Player" in message_object){ // playerlist object
		$(".innerflex").addClass("hidden");
		$("#lobby").html("<table><tr><th>ID</th><th>Name</th></tr></table>");
		for(var i=0;i<message_object.Player.length;++i){
			$("#lobby").children("table").append("<tr><td>"+message_object.Player[i][0]+"</td><td>"+message_object.Player[i][1]+"</td></tr>");
		}
		var select_data=human_player?"":"<option value=\"1\">Human</option>";
		for(var i=0;i<AI_list.length;++i){
			select_data+="<option value=\""+(i+2)+"\">"+AI_list[i][0]+"</option>";
		}
		$("#lobby").children("table").append("<tr><td colspan=\"2\">Add new player: <input type=\"text\" value=\"Player name\" id=\"player-name\" /><select id=\"player-type\">"+select_data+"</select><input type=\"button\" value=\"Add\" id=\"player-create\" /></td></tr>");
		var just_focused=false;
		$("#player-name").focus(function(e) {
			setTimeout((function(obj){return function(){obj.setSelectionRange(0,obj.value.length);}})(this),10);
        });
		$("#player-create").click(function(e) {
            if($("#player-name").val()==="Player name"){
				alert("Please input a player name!");
				return;
			}
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
						human_player=true;
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