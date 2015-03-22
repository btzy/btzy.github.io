function ObjectStorage(){
	this.Curves=[];
	this.Points=[];
}
ObjectStorage.prototype.ClearAll=function(){
	this.Curves=[];
	this.Points=[];
}
ObjectStorage.prototype.PointIsNew=function(point){
	for(var currindex=0;currindex<this.Points.length;++currindex){
		if(Point.IsEqual(this.Points[currindex],point)){
			return false;
		}
	}
	return true;
}

ObjectStorage.prototype.AddPoint=function(point){
	var currindex=this.Points.length;
	this.Points.push(point);
	return currindex;
}
ObjectStorage.prototype.CurveIsNew=function(curve){
	for(var currindex=0;currindex<this.Curves.length;++currindex){
		if(Curve.IsEqual(this.Curves[currindex],curve)){
			return false;
		}
	}
	return true;
}
ObjectStorage.prototype.AddCurve=function(curve){
	var currindex=this.Curves.length;
	var newpoints=[];
	for(var currindex=0;currindex<this.Curves.length;++currindex){
		var points=Geometry.IntersectionPoints(this.Curves[currindex],curve);
		for(var currpoint=0;currpoint<points.length;++currpoint){
			if(this.PointIsNew(points[currpoint])){
				var currpointindex=this.Points.length;
				this.Points.push(points[currpoint]);
				newpoints.push([currpointindex,points[currpoint]]);
			}
		}
	}
	this.Curves.push(curve);
	return [currindex,newpoints];
}
ObjectStorage.prototype.FindNearestPoint=function(point,stickylimit,stickypoints,stickycurves){
	var closestpoint=new Point(-10000,-10000);
	var distance=Number.MAX_VALUE;
	if(stickypoints){
		for(var currindex=0;currindex<this.Points.length;++currindex){
			var tmppoint=this.Points[currindex];
			var tmpdist=Geometry.Distance(tmppoint,point);
			if(tmpdist<distance){
				closestpoint=tmppoint;
				distance=tmpdist;
			}
		}
		if(distance<=stickylimit)return closestpoint;
	}
	if(stickycurves){
		for(var currindex=0;currindex<this.Curves.length;++currindex){
			var tmppoint=Geometry.ClosestPoint(this.Curves[currindex],point);
			var tmpdist=Geometry.Distance(tmppoint,point);
			if(tmpdist<distance){
				closestpoint=tmppoint;
				distance=tmpdist;
			}
		}
		if(distance<=stickylimit)return closestpoint;
	}
	return point;
}