function NimmtManager(){
	this.OnSendMessage=null;
	var game_started=false;
	var game_object={Player:[]};
	var that=this;
	this.MessageReceived=function(message){
		message_parts=message.split(" ");
		if(message_parts.length<1)return;
		var first_part=message_parts.shift();
		if(first_part==="move"){
			if(message_parts.length<1){
				that.OnSendMessage("send "+JSON.stringify(game_object));
				return;
			}
			if(message_parts.length<3)return;
			var sender_id=message_parts.shift();
			var command=message_parts.shift();
			var remaining_message=message_parts.join(" ");
			if(game_started){
				// process game
			}
			else{
				if(command==="join"&&sender_id!=""){
					var id_exists=false;
					for(var i=0;i<game_object.Player.length;++i){
						if(game_object.Player[i][0]===sender_id){
							id_exists=true;
							break;
						}
					}
					if(!id_exists){
						game_object.Player.push([sender_id,remaining_message]);
						that.OnSendMessage("send "+JSON.stringify(game_object));
					}
				}
			}
		}
	}
}
// Message Structure:

// "move id "<xxx>
// "send "<xxx>

// "send "<[playerlist]>
// "send "<{move object}
// "send "<{game object}>
/* playerlist object
{Player:[id,name]}
*/
/* move object
{PlayerId:string;PlayedCard:int}
OR
{Advance:true}
*/
/* game object
{CardsLeft:int
Player:[id,name,points,playedcard]
Table:[[ordered_card]]}
*/