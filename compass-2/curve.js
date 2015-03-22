function Curve(point1,point2,curvetype){ // do not try to create a curve when Point.IsEqual(point1,point2)===true !!!
	if(curvetype===CurveType.Circle){
		this.CurveType=curvetype;
		this.Centre=point1;
		this.Radius=Geometry.Distance(point1,point2);
	}
	else if(curvetype===CurveType.Line){ // Ax+By=C;
		this.CurveType=curvetype;
		this.A=point2.Y-point1.Y;
		this.B=point1.X-point2.X;
		this.C=point2.Y*point1.X-point1.Y*point2.X;
	}
}
function Line(point1,point2){ // do not try to create a curve when Point.IsEqual(point1,point2)===true !!!
	return new Curve(point1,point2,CurveType.Line);
}
Curve.IsEqual=function(curve1,curve2){
	if(curve1.CurveType!=curve2.CurveType)return false;
	if(curve1.CurveType===CurveType.Circle){
		return Point.IsEqual(curve1.Centre,curve2.Centre)&&Number.IsEqual(curve1.Radius,curve2.Radius);
	}
	if(curve1.CurveType===CurveType.Line){
		return Number.IsEqual(curve1.C*curve2.A,curve2.C*curve1.A)&&Number.IsEqual(curve1.C*curve2.B,curve2.C*curve1.B)&&Number.IsEqual(curve1.A*curve2.B,curve2.A*curve1.B);
	}
	return false;
}
var CurveType={};
CurveType.None=0;
CurveType.Circle=1;
CurveType.Line=2;