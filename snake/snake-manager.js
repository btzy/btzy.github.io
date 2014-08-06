function Point(x,y){
	this.X=x;
	this.Y=y;
}
function SnakeManager(){ // const parameter
	// Events:
	this.OnInitialiseBoard=null;
	this.OnUpdateBoard=null; // new_segment_data={Id,Point,Direction:0..3 or null}, old_segment_id=string
	this.OnReportUsability=null;
	this.OnGameOver=null;
	var that=this;
	
	// Private Variables:
	var Grid=null;
	var Snake=null;
	var Current_Direction=null; // 0,1,2,3
	var dx=[1,0,-1,0]; var dy=[0,1,0,-1];
	var No_Remove=0;
	var id_gen=(function(){
		var id_last=0;
		return function(){
			++id_last;
			if(id_last>=1000000)id_last-=1000000;
			return id_last;
		}
	})();
	
	// Private Functions:
	var GetOrthogonalDirection=function(from_point,to_point){
		var dx=to_point.X-from_point.X;
		var dy=to_point.Y-from_point.Y;
		if(Math.abs(dx)>Math.abs(dy)){
			return dx>0?0:2;
		}
		else{
			return dy>0?1:3;
		}
	}
	
	// Public Methods:
	this.Start=function(map){
		Grid=[]; // 0 - wall, 1 - empty [y][x] coordinates
		for(var i=0;i<map.Grid.length;++i){
			var linedata=[];
			for(var j=0;j<map.Grid[i].length;++j){
				linedata.push(map.Grid[i].charAt(j)=="0"?0:1);
			}
			Grid.push(linedata);
		}
		Snake=[]; // an array of {Id:string,Point:Point}, from tail to head
		for(var i=0;i<map.Snake.length;++i){
			Snake.push({Id:"s"+(id_gen()),Point:new Point(map.Snake[i].X,map.Snake[i].Y)});
		}
		// TODO: process portal data.
		map=null; // to release the memory
		that.OnInitialiseBoard(new Point(Grid[0].length,Grid.length),Grid,Snake,null);
		for(var i=0;i<map.Snake.length;++i){
			Grid[map.Snake[i].Y][map.Snake[i].X]=0;
		}
		Current_Direction=GetOrthogonalDirection(map.Snake[map.Snake.length-2],map.Snake[map.Snake.length-1]);
	}
	this.Input=function(direction_keycode){ // this direction is relative to the snake
		// verify acceptable direction:
		if(direction_keycode<37||direction_keycode>39){
			that.OnReportUsability(false,direction_keycode);
			return;
		}
		var add_segment_data=null;
		if(direction_keycode==37||direction_keycode==39){
			// Valid input test:
			var resolved_direction=null;
			if(direction_keycode==37){
				resolved_direction=(Current_Direction+3)%4;
			}
			else{
				resolved_direction=(Current_Direction+1)%4;
			}
			var new_point=new Point(Snake[Snake.length-1].Point.X+dx[resolved_direction],Snake[Snake.length-1].Point.Y+dy[resolved_direction]);
			if(Grid[new_point.Y][new_point.X]==0&&(new_point.X!=Snake[0].Point.X||new_point.Y!=Snake[0].Point.Y||No_Remove>0)){ // rejection condition
				// reject the point:
				that.OnReportUsability(false,direction_keycode);
				return;
			}
			add_segment_data={Id:id_gen(),Point:new_point,Direction:resolved_direction};
			Current_Direction=resolved_direction;
		}
		else{
			add_segment_data={Id:id_gen(),Point:new Point(Snake[Snake.length-1].Point.X+dx[Current_Direction],Snake[Snake.length-1].Point.Y+dy[Current_Direction]),Direction:null};
		}
		// verify that snake isn't running into a wall or snake body:
		if(Grid[add_segment_data.Point.Y][add_segment_data.Point.X]==0){
			// We have crashed!
			that.OnGameOver("You have crashed!");
			return;
		}
		// calculate the segment to remove:
		var remove_segment_id=null;
		if(No_Remove<=0){
			var last_point=Snake.shift();
			Grid[last_point.Point.Y][last_point.Point.X]=1;
			remove_segment_id=Snake[0].Id;
		}
		else{
			--No_Remove;
		}
		// add the segment:
		Grid[add_segment_data.Point.Y][add_segment_data.Point.X]=0;
		Snake.push({Id:add_segment_data.Id,Point:add_segment_data.Point});
		that.OnUpdateBoard(add_segment_data,remove_segment_id);
		that.OnReportUsability(true,direction_keycode);
	}
}
// Point:{X:int,Y:int}
// Direction: 0-right,1-up,2-left,3-down
// map={Grid:char array,Snake:[...Point...],Portals:[...[{Location:Point,Direction:Direction},{Location:Point,Direction:int}]...]}