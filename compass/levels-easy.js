var level_set=new Array("Default Levels",
//Level 1
new Array("The most basic level!","Construct an equilateral triangle.","Select the three sides of the triangle.",
function(curveconstructor,pointconstructor){//initialise
},
function(curves,points){//autocheck
	if(curves.length==3&&curves[0].type==LINE&&curves[1].type==LINE&&curves[2].type==LINE){
		var p1=Intersections(curves[0],curves[1]);
		var p2=Intersections(curves[1],curves[2]);
		var p3=Intersections(curves[2],curves[0]);
		if(p1.length==1&&p2.length==1&&p3.length==1){
			var d1=Distance(p1[0],p2[0]);
			var d2=Distance(p2[0],p3[0]);
			var d3=Distance(p3[0],p1[0]);
			if(Math.abs(d1-d2)<EPSILON&&Math.abs(d2-d3)<EPSILON){
				return true;
			}
			return false;
		}
		return false;
	}
	return false;
},
function(curves,points){//manualcheck
	return false;
}));