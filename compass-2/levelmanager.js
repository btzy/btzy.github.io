function LevelManager(){
	this._LevelHandler=new LevelHandler();
	this.OnLevelComplete=null; // call this when solution is correct
	this.OnUpdateCallsFromSvg=null; // [points,curves,all]
	this.OnStart=null;
	this._Checker=null;
	var that=this;
	this.OpenLevelSelector=function(){
		this._LevelHandler.OpenLevelSelector();
	}
	this._LevelHandler.OnStartLevel=function(checkercodestring,index,levelcount){
		that._Checker=new CheckerHandler("checkersandbox",checkercodestring,function(){
			that._Checker.Start(index,function(data){
				that._Checker.OnWin=function(points,curves){
					that._Checker.Destroy();
					that._Checker=null;
					that._LevelHandler.Win();
					if(that.OnLevelComplete!==null)that.OnLevelComplete(points,curves,index+1<levelcount);
				}
				that.OnUpdateCallsFromSvg(data[0][0],data[0][1],data[0][2]);
				// load the question data and start configuration:
				that.OnStart(data[1]); // {Question:"...",Points:[...],Curves:[...]};
			});
		});
	}
	this.CheckNewPoint=function(point){
		if(that._Checker!==null)that._Checker.CheckPoint(point);
	}
	this.CheckNewCurve=function(curve){
		if(that._Checker!==null)that._Checker.CheckCurve(curve);
	}
	this.CheckAll=function(pointarray,curvearray){
		if(that._Checker!==null)that._Checker.CheckAll(pointarray,curvearray);
	}
	this.StartNextLevel=function(){
		this._LevelHandler.StartNextLevel();
	}
}