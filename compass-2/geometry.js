var Geometry={};
Geometry.Distance=function(point1,point2){
	return Math.sqrt((point1.X-point2.X)*(point1.X-point2.X)+(point1.Y-point2.Y)*(point1.Y-point2.Y));
}
Geometry.IntersectionPoints=function(curve1,curve2){ // source for formula: http://paulbourke.net/geometry/circlesphere/
	if(curve1.CurveType===curve2.CurveType){
		if(curve1.CurveType===CurveType.Circle){
			var d=Geometry.Distance(curve1.Centre,curve2.Centre);
			if(Number.IsZero(d)||Number.IsGreater(d,curve1.Radius+curve2.Radius)||Number.IsGreater(Math.abs(curve1.Radius-curve2.Radius),d)){
				return [];
			}
			var dx=curve2.Centre.X-curve1.Centre.X;
			var dy=curve2.Centre.Y-curve1.Centre.Y;
			var a=(curve1.Radius*curve1.Radius-curve2.Radius*curve2.Radius+d*d)/(2*d);
			var x3=curve1.Centre.X+(dx*a/d);
			var y3=curve1.Centre.Y+(dy*a/d);
			var h=Math.sqrt(curve1.Radius*curve1.Radius-a*a);
			if(Number.IsZero(h)){
				return [new Point(x3,y3)];
			}
			var rx=-dy*h/d;
			var ry=dx*h/d;
			return [new Point(x3+rx,y3+ry),new Point(x3-rx,y3-ry)];
		}
		if(curve1.CurveType===CurveType.Line){
			var d=curve1.B*curve2.A-curve2.B*curve1.A;
			if(Number.IsZero(d)){
				return [];
			}
			return [new Point((curve2.C*curve1.B-curve1.C*curve2.B)/d,(curve1.C*curve2.A-curve2.C*curve1.A)/d)];
		}
	}
	if(curve1.CurveType===CurveType.Line&&curve2.CurveType===CurveType.Circle){
		var tmp=curve1;
		curve1=curve2;
		curve2=tmp;
	}
	if(curve1.CurveType===CurveType.Circle&&curve2.CurveType===CurveType.Line){ // something is wrong with this algorithm.
		var a2b2=curve2.A*curve2.A+curve2.B*curve2.B;
		var bp_aq=curve2.B*curve1.Centre.X-curve2.A*curve1.Centre.Y;
		var bkt=curve2.A*curve1.Centre.X+curve2.B*curve1.Centre.Y-curve2.C;
		var det=curve1.Radius*curve1.Radius*a2b2-bkt*bkt;
		if(Number.IsZero(det)){
			return [new Point((curve2.A*curve2.C+curve2.B*bp_aq)/a2b2,(curve2.B*curve2.C-curve2.A*bp_aq)/a2b2)];
		}
		if(det<0){
			return [];
		}
		det=Math.sqrt(det);
		return [new Point((curve2.A*curve2.C+curve2.B*(bp_aq+det))/a2b2,(curve2.B*curve2.C-curve2.A*(bp_aq+det))/a2b2),new Point((curve2.A*curve2.C+curve2.B*(bp_aq-det))/a2b2,(curve2.B*curve2.C-curve2.A*(bp_aq-det))/a2b2)]; // sign of y determinant might be wrong!!!
	}
	return [];
}
Geometry.ClosestPoint=function(curve,point){
	if(curve.CurveType===CurveType.Circle){
		var d=Geometry.Distance(curve.Centre,point);
		if(Number.IsZero(d)){
			return new Point(curve.Centre.X+curve.Radius,curve.Centre.Y);
		}
		var d=curve.Radius/d;
		return new Point((point.X-curve.Centre.X)*d+curve.Centre.X,(point.Y-curve.Centre.Y)*d+curve.Centre.Y);
	}
	if(curve.CurveType===CurveType.Line){
		var bp_aq=curve.B*point.X-curve.A*point.Y;
		var a2b2=curve.A*curve.A+curve.B*curve.B;
		return new Point((curve.A*curve.C+curve.B*bp_aq)/a2b2,(curve.B*curve.C-curve.A*bp_aq)/a2b2);
	}
}
Geometry.IsPointOnCurve=function(curve,point){
	return Number.IsZero(Geometry.Distance(Geometry.ClosestPoint(curve,point),point));
}
Geometry.IsPerpendicular=function(line1,line2){
	return Number.IsEqual(line1.A*line2.A,-line1.B*line2.B);
}
Geometry.IsParallel=function(line1,line2){
	return Number.IsEqual(line1.A*line2.B,line2.A*line1.B);
}
Geometry.Direction=function(line){ // returns a value [0,PI] as an angle
	//return Math.atan(-a/b);
	var ret=Math.atan2(line.B,-line.A);
	if(ret<0)ret+=Math.PI;
	return ret;
}
Geometry.DirectedAngle=function(line1,line2){ // angle from line1 to line2: [0,PI]
	var ret=Geometry.Direction(line2)-Geometry.Direction(line1);
	if(ret<0)ret+=Math.PI;
	return ret;
}