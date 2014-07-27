function NimmtManager(){
	this.OnSendMessage=null;
	var game_started=false;
	var game_object={Player:[]};
	var that=this;
	var ShuffleCards=function(number){
		var ret=[];
		for(var i=1;i<=number;++i){
			var index=Math.floor(Math.random()*i)%i;
			if(index+1<i){
				ret[i-1]=ret[index];
				ret[index]=i;
			}
			else{
				ret[i-1]=i;
			}
		}
		return ret;
	}
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
				if(command==="play"){
					var index=null;
					for(var i=0;i<game_object.Player.length;++i){
						if(game_object.Player[i][0]===sender_id){
							index=i;
							break;
						}
					}
					if(index!==null){ // id exists!
						var requested_play_card=parseInt(remaining_message);
						var hand_card_index=game_object.Player[index][4].indexOf(requested_play_card);
						if(hand_card_index>-1){ // the card is really in your hand
							delete game_object.Advance;
							game_object.Player[index][3]=requested_play_card;
							game_object.Player[index][4].splice(hand_card_index,1);
							game_object.PlayerId=sender_id;
							game_object.PlayedCard=requested_play_card;
							var is_complete=true;
							for(var i=0;i<game_object.Player.length;++i){
								if(game_object.Player[i][3]==0){
									is_complete=false;
									break;
								}
							}
							if(is_complete){
								game_object.Advance=true;
							}
							// Add card to table:
							if(is_complete){
								var played_cards=[];
								for(var i=0;i<game_object.Player.length;++i){
									played_cards.push([game_object.Player[i][3],i]);
									//game_object.Player[i][3]=0;
								}
								played_cards.sort(function(a,b){
									if(a[0]<b[0])return -1;
									if(a[0]>b[0])return 1;
									return 0;
								});
								for(var i=0;i<played_cards.length;++i){
									var insert_location=-1;
									for(var j=0;j<game_object.Table.length;++j){
										if(game_object.Table[j][game_object.Table[j].length-1]>played_cards[i][0]){
											break;
										}
										else{
											insert_location=j;
										}
									}
									if(insert_location==-1){ // we will just clear the stack with lowest value. This is a modification to the original game.
										var max_points=0;
										var max_points_index=-1;
										for(var j=0;j<game_object.Table.length;++j){
											var points=0;
											for(var k=0;k<game_object.Table[j].length;++k){
												points+=game_object.Table[j][k];
											}
											if(points>max_points){
												max_points=points;
												max_points_index=j;
											}
										}
										var points=0;
										while(game_object.Table[max_points_index].length>0){
											points+=GetPoints(game_object.Table[max_points_index].pop());
										}
										game_object.Player[played_cards[i][1]][2]+=points;
										insert_location=max_points_index;
									}
									else{
										if(game_object.Table[insert_location].length==5){
											var points=0;
											while(game_object.Table[insert_location].length>0){
												points+=GetPoints(game_object.Table[insert_location].pop());
											}
											game_object.Player[played_cards[i][1]][2]+=points;
										}
									}
									game_object.Table[insert_location].push(played_cards[i][0]);
									game_object.Table.sort(function(a,b){
										if(a[a.length-1]<b[b.length-1])return -1;
										if(a[a.length-1]>b[b.length-1])return 1;
										return 0;
									});
								}
							}
							that.OnSendMessage("send "+JSON.stringify(game_object));
							if(is_complete){
								for(var i=0;i<game_object.Player.length;++i){
									game_object.Player[i][3]=0;
								}
							}
						}
					}
				}
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
				if(command==="start"&&remaining_message===""){
					game_started=true;
					// Generate game data:
					var cards=ShuffleCards(104);
					var len=cards.length;
					var new_object={CardsLeft:10,Table:[[cards[--len]],[cards[--len]],[cards[--len]],[cards[--len]]],Advance:false,Player:[]};
					new_object.Table.sort(function(a,b){
						if(a[0]<b[0])return -1;
						if(a[0]>b[0])return 1;
						return 0;
					});
					for(var i=0;i<game_object.Player.length;++i){
						var player_hand=[];
						for(var j=0;j<10;++j){
							player_hand.push(cards[--len]);
						}
						player_hand.sort(function(a,b){
							if(a<b)return -1;
							if(a>b)return 1;
							return 0;
						});
						new_object.Player.push([game_object.Player[i][0],game_object.Player[i][1],0,0,player_hand]);
					}
					game_object=new_object;
					that.OnSendMessage("send "+JSON.stringify(game_object));
				}
			}
		}
	}
}
// Message Structure:

// "move id card_number"
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
Player:[id,name,points,playedcard,cards[]]
Table:[[ordered_card]]
PlayerId:string;PlayedCard:int||Advance:true}
*/
/* Structure for AI
{CardsLeft:int;
Points:int;
Cards:[ordered_card];
Table:[[ordered_card]]}
*/