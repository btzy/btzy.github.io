(function(){
	var Data={Title:"Easy Levels (Default)",UniqueId:1,Checker:[]};
	Data.Checker[0]=(function(){
		var Checker={};
		var initpoints;
		var preline;
		Checker.Start=function(){
			DynamicSizer.SetAspectRatio(1,1);
			initpoints=[DynamicSizer.CreatePoint(0.3,0.5),DynamicSizer.CreatePoint(0.7,0.5)];
			preline=Line(initpoints[0],initpoints[1]);
			return {Question:"Construct the perpendicular bisector to the line segment defined by the two points.",Points:initpoints,Curves:[]};
		}
		Checker.CheckCurve=function(curve){
			if(curve.CurveType===CurveType.Line){
				if(Geometry.IsPerpendicular(preline,curve)){
					var intersection=Geometry.IntersectionPoints(preline,curve)[0];
					if(Number.IsEqual(Geometry.Distance(intersection,initpoints[0]),Geometry.Distance(intersection,initpoints[1]))){
						return [initpoints,[curve]];
					}
				}
			}
			return false;
		}
		return Checker;
	})();
	Data.Checker[1]=(function(){
		var Checker={};
		var initpoint;
		var initcurve;
		Checker.Start=function(){
			DynamicSizer.SetAspectRatio(1,1);
			initpoint=DynamicSizer.CreatePoint(0.5,0.3);
			initcurve=Line(DynamicSizer.CreatePoint(0,0.5),DynamicSizer.CreatePoint(1,0.5));
			return {Question:"Construct a line perpendicular to the given line that passes through the point.",Points:[initpoint],Curves:[initcurve]};
		}
		Checker.CheckCurve=function(curve){
			if(curve.CurveType===CurveType.Line){
				if(Geometry.IsPerpendicular(initcurve,curve)&&Geometry.IsPointOnCurve(curve,initpoint)){
					return [[initpoint],[curve,initcurve]];
				}
			}
			return false;
		}
		return Checker;
	})();
	Data.Checker[2]=(function(){
		var Checker={};
		var initpoint;
		var initcurves;
		Checker.Start=function(){
			DynamicSizer.SetAspectRatio(1,1);
			initpoint=DynamicSizer.CreatePoint(0.2,0.4);
			initcurves=[Line(initpoint,DynamicSizer.CreatePoint(0.5,0.4)),Line(initpoint,DynamicSizer.CreatePoint(0.5,0.6))];
			return {Question:"Construct an angle bisector of the two lines.",Points:[initpoint],Curves:initcurves};
		}
		Checker.CheckCurve=function(curve){
			if(curve.CurveType===CurveType.Line){
				if(Number.IsEqual(Geometry.DirectedAngle(initcurves[0],curve),Geometry.DirectedAngle(curve,initcurves[1]))){
					return [[initpoint],[initcurves[0],initcurves[1],curve]];
				}
			}
			return false;
		}
		return Checker;
	})();
	Data.Checker[3]=(function(){
		var Checker={};
		var initpoints;
		var initcurves;
		var line1,line2;
		Checker.Start=function(){
			DynamicSizer.SetAspectRatio(1,1);
			initpoints=[DynamicSizer.CreatePoint(0.2,0.7),DynamicSizer.CreatePoint(0.3,0.3),DynamicSizer.CreatePoint(0.7,0.7)];
			initcurves=[Line(initpoints[0],initpoints[1]),Line(initpoints[0],initpoints[2])];
			line1=line2=null;
			return {Question:"Complete the parallelogram that has the given three points as vertices.",Points:initpoints,Curves:initcurves};
		}
		Checker.CheckCurve=function(curve){
			if(curve.CurveType===CurveType.Line){
				if(Geometry.IsParallel(initcurves[0],curve)&&Geometry.IsPointOnCurve(curve,initpoints[2])){
					line1=curve;
				}
				else if(Geometry.IsParallel(initcurves[1],curve)&&Geometry.IsPointOnCurve(curve,initpoints[1])){
					line2=curve;
				}
				if(line1!==null&&line2!==null){
					return [[initpoints[0],initpoints[1],initpoints[2],Geometry.IntersectionPoints(line1,line2)[0]],[initcurves[0],initcurves[1],line1,line2]];
				}
			}
			return false;
		}
		return Checker;
	})();
	Data.Checker[4]=(function(){
		var Checker={};
		var initpoint;
		var initcurve;
		var initangle;
		Checker.Start=function(){
			DynamicSizer.SetAspectRatio(1,1);
			initpoint=DynamicSizer.CreatePoint(0.25,0.5);
			initcurve=Line(initpoint,DynamicSizer.CreatePoint(0.35,0.4));
			var tmppoint=DynamicSizer.CreatePoint(0.7,0.5);
			var startcurves=[Line(tmppoint,DynamicSizer.CreatePoint(0.75,0.2)),Line(tmppoint,DynamicSizer.CreatePoint(1,0.45))];
			initangle=Geometry.DirectedAngle(startcurves[0],startcurves[1]);
			return {Question:"Construct an angle at the highlighted point on the highlighted line that is equal to the angle between the two other lines.",Points:[tmppoint],Curves:startcurves,HighlightedPoints:[initpoint],HighlightedCurves:[initcurve]};
		}
		Checker.CheckCurve=function(curve){
			if(curve.CurveType===CurveType.Line){
				if(!Geometry.IsParallel(curve,initcurve)&&Point.IsEqual(Geometry.IntersectionPoints(curve,initcurve)[0],initpoint)){
					var angle=Geometry.DirectedAngle(initcurve,curve);
					if(Number.IsEqual(angle,initangle)||Number.IsEqual(angle+initangle,Math.PI)){
						return [[initpoint],[initcurve,curve]];
					}
				}
			}
			return false;
		}
		return Checker;
	})();
	return Data;
})()