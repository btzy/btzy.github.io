function Point(x,y){
	this.X=x;
	this.Y=y;
}
Point.IsEqual=function(point1,point2){
	return Number.IsEqual(point1.X,point2.X)&&Number.IsEqual(point1.Y,point2.Y);
}
