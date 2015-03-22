function SvgManager(svgelement){
	this._SvgHandler=new SvgHandler(svgelement);
	this._ObjectStorage=new ObjectStorage();
	this._FirstPoint=null;
	this._SecondPoint=null;
	this._CurveType=CurveType.None;
	this._Drag=false;
	this._StickyLimit=10;
	this.OnNewPoint=null;
	this.OnNewCurve=null;
	this.OnCheckAll=null;
	this.StickyPoints=true;
	this.StickyCurves=true;
	var that=this;
	var ResetPoints=function(){
		that._FirstPoint=null;
		that._SecondPoint=null;
		that._SvgHandler.RemovePoint("tmppoint1");
		that._SvgHandler.RemovePoint("tmppoint2");
		that._SvgHandler.RemoveCurve("tmpcurve");
	}
	var HoverPoint1=function(point){
		that._SvgHandler.SetPoint("tmppoint1","red",point);
	}
	var HoverPoint2=function(point){
		that._SvgHandler.SetPoint("tmppoint2","red",point);
	}
	var HoverCurve=function(curve){
		that._SvgHandler.SetCurve("tmpcurve","red",curve);
	}
	var PutPoint=function(index,point){
		that._SvgHandler.SetPoint("p"+index,"navy",point);
	}
	var PutCurve=function(index,curve){
		that._SvgHandler.SetCurve("c"+index,"navy",curve);
	}
	var PutHighlightedPoint=function(index,point){
		that._SvgHandler.SetPoint("p"+index,"lime",point);
	}
	var PutHighlightedCurve=function(index,curve){
		that._SvgHandler.SetCurve("c"+index,"lime",curve);
	}
	var TryAddPoint=function(point,putter){
		if(putter===undefined)putter=PutPoint;
		if(that._ObjectStorage.PointIsNew(point)){
			var pointindex=that._ObjectStorage.AddPoint(point);
			putter(pointindex,point);
			if(that.OnNewPoint!==null)that.OnNewPoint(point);
			if(that.OnCheckAll!==null)that.OnCheckAll([that._ObjectStorage.Points,that._ObjectStorage.Curves]);
		}
	}
	var TryAddCurveAndPoints=function(curve,putter){
		if(putter===undefined)putter=PutCurve;
		if(that._ObjectStorage.CurveIsNew(curve)){
			var retdata=that._ObjectStorage.AddCurve(curve);
			for(var i=0;i<retdata[1].length;++i){
				PutPoint(retdata[1][i][0],retdata[1][i][1]);
				if(that.OnNewPoint!==null)that.OnNewPoint([retdata[1][i][0],retdata[1][i][1]]);
			}
			putter(retdata[0],curve);
			if(that.OnNewCurve!==null)that.OnNewCurve(curve);
			if(that.OnCheckAll!==null)that.OnCheckAll([that._ObjectStorage.Points,that._ObjectStorage.Curves]);
		}
	}
	this._SvgHandler.SetTempPoint=function(point,clicktype){
		point=that._ObjectStorage.FindNearestPoint(point,that._StickyLimit,that.StickyPoints,that.StickyCurves);
		if(that._CurveType!==CurveType.None){
			if(that._Drag){
				if(clicktype===ClickType.Down&&that._FirstPoint===null){
					that._FirstPoint=point;
					HoverPoint1(point);
				}
				else if(clicktype===ClickType.Up&&that._FirstPoint!==null){
					that._SecondPoint=point;
					TryAddPoint(that._FirstPoint);
					TryAddPoint(that._SecondPoint);
					if(!Point.IsEqual(that._FirstPoint,that._SecondPoint))TryAddCurveAndPoints(new Curve(that._FirstPoint,that._SecondPoint,that._CurveType));
					ResetPoints();
				}
			}
			else if(clicktype===ClickType.Down){
				if(that._FirstPoint===null){
					that._FirstPoint=point;
					HoverPoint1(point);
				}
				else{
					that._SecondPoint=point;
					TryAddPoint(that._FirstPoint);
					TryAddPoint(that._SecondPoint);
					if(!Point.IsEqual(that._FirstPoint,that._SecondPoint))TryAddCurveAndPoints(new Curve(that._FirstPoint,that._SecondPoint,that._CurveType));
					ResetPoints();
				}
			}
		}
		else if(clicktype===ClickType.Down){
			TryAddPoint(point);
			ResetPoints();
		}
	}
	this._SvgHandler.HoverTempPoint=function(point){
		point=that._ObjectStorage.FindNearestPoint(point,that._StickyLimit,that.StickyPoints,that.StickyCurves);
		if(that._CurveType!==CurveType.None){
			if(that._FirstPoint===null){
				HoverPoint1(point);
			}
			else{
				HoverPoint2(point);
				if(!Point.IsEqual(that._FirstPoint,point))HoverCurve(new Curve(that._FirstPoint,point,that._CurveType));
			}
		}
		else{
			HoverPoint1(point);
		}
	}
	this._SvgHandler.OnRepaint=function(){
		for(var i in that._ObjectStorage.Curves){
			that._SvgHandler.SetCurve("c"+i,null,that._ObjectStorage.Curves[i]);
		}
		for(var i in that._ObjectStorage.Points){
			that._SvgHandler.SetPoint("p"+i,null,that._ObjectStorage.Points[i]);
		}
		if(that._FirstPoint!==null){
			HoverPoint1(that._FirstPoint);
		}
	}
	this.ChangeCurveType=function(curvetype){
		this._CurveType=curvetype;
		ResetPoints();
	}
	this.ChangeStickyLimit=function(stickylimit){
		this._StickyLimit=stickylimit;
	}
	this.ChangeDragState=function(draggable){
		this._Drag=draggable;
	}
	this.UpdateCalls=function(callsarray){
		this.OnNewPoint=callsarray[0];
		this.OnNewCurve=callsarray[1];
		this.OnCheckAll=callsarray[2];
	}
	this.AddPoint=TryAddPoint;
	this.AddCurve=TryAddCurveAndPoints;
	this.AddHighlightedPoint=function(point){
		TryAddPoint(point,PutHighlightedPoint);
	}
	this.AddHighlightedCurve=function(curve){
		TryAddCurveAndPoints(curve,PutHighlightedCurve);
	}
	this.ResetSvg=function(){
		for(var i in this._ObjectStorage.Curves){
			this._SvgHandler.RemoveCurve("c"+i);
		}
		for(var i in this._ObjectStorage.Points){
			this._SvgHandler.RemovePoint("p"+i);
		}
		this._SvgHandler.ResetMovement();
		this._ObjectStorage.ClearAll();
	}
	this.SelectAndFadeOthers=function(pointarray,curvearray){
		$({anim:0}).animate({anim:0.8},{duration:1000,step:function(val){
			var opacity=1-val;
			for(var i in that._ObjectStorage.Curves){
				var j;
				for(j=0;j<curvearray.length;++j){
					if(Curve.IsEqual(that._ObjectStorage.Curves[i],curvearray[j])){
						break;
					}
				}
				if(j==curvearray.length){
					that._SvgHandler.SetOpacity("c"+i,opacity);
				}
			}
			for(var i in that._ObjectStorage.Points){
				var j;
				for(j=0;j<pointarray.length;++j){
					if(Point.IsEqual(that._ObjectStorage.Points[i],pointarray[j])){
						break;
					}
				}
				if(j==pointarray.length){
					that._SvgHandler.SetOpacity("p"+i,opacity);
				}
			}
		},easing:"linear"});
	}
}