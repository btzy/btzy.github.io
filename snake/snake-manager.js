function Point(x,y){
	this.X=x;
	this.Y=y;
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
	var id_gen=(function(){
		var id_last=0;
		return function(){
			++id_last;
			if(id_last>=1000000)id_last-=1000000;
			return id_last;
		}
	})();
	
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
		Snake=[]; // an array of {Id:string,Point:Point}, from tail to head
		for(var i=0;i<map.Snake.length;++i){
			Snake.push({Id:"s"+(id_gen()),Point:new Point(map.Snake[i].X,map.Snake[i].Y)});
		}
		// TODO: process portal data.
		map=null; // to release the memory
		that.OnInitialiseBoard(new Point(Grid[0].length,Grid.length),Grid,Snake,null);
	}
	this.Input=function(direction){ // this direction is relative to the snake
		
	}
}
// Point:{X:int,Y:int}
// Direction: 0-right,1-up,2-left,3-down
// map={Grid:char array,Snake:[...Point...],Portals:[...[{Location:Point,Direction:Direction},{Location:Point,Direction:int}]...]}