function Point(x,y){
	this.x=X;
	this.y=Y;
}
function SnakeManager(){ // const parameter
	// Events:
	this.OnInitialiseBoard=null;
	this.OnUpdateBoard=null;
	this.OnReportUsability=null;
	var that=this;
	
	// Private Variables:
	var Grid=null;
	var Snake=null;
	
	// Public Methods:
	this.Start=function(map){
		Grid=[]; // 0 - wall, 1 - empty
		for(var i=0;i<map.Grid.length;++i){
			var linedata=[];
			for(var j=0;j<map.Grid[i].length;++j){
				linedata.push(map.Grid[i].charAt(j)=="0"?0:1);
			}
			Grid.push(linedata);
		}
		Snake=[]; // an array of points, from tail to head
		for(var i=0;i<map.Snake.length;++i){
			Snake.push(new Point(map.Snake[i].X,map.Snake[i].Y));
		}
		// TODO: process portal data.
		map=null; // to release the memory
		that.OnInitialiseBoard(/*TODO: determine the data to go here.*/);
	}
	this.Input=function(direction){ // this direction is relative to the snake
		
	}
}
// Point:{X:int,Y:int}
// Direction: 0-right,1-up,2-left,3-down
// map={Grid:char array,Snake:[...Point...],Portals:[...[{Location:Point,Direction:Direction},{Location:Point,Direction:int}]...]}