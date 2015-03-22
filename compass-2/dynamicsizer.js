var DynamicSizer={};
DynamicSizer.Init=function(width,height){
	DynamicSizer._w=DynamicSizer._width=width;
	DynamicSizer._h=DynamicSizer._height=height;
	DynamicSizer._l=0;
	DynamicSizer._t=0;
}
DynamicSizer.SetAspectRatio=function(width,height){
	var minval=Math.min(DynamicSizer._width/width,DynamicSizer._height/height);
	DynamicSizer._w=width*minval;
	DynamicSizer._h=height*minval;
	DynamicSizer._l=(DynamicSizer._width-DynamicSizer._w)/2;
	DynamicSizer._t=(DynamicSizer._height-DynamicSizer._h)/2;
}
DynamicSizer.CreatePoint=function(x,y){
	return new Point(DynamicSizer._w*x+DynamicSizer._l,DynamicSizer._h*y+DynamicSizer._t);
}