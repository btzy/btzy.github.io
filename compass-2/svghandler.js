function SvgHandler(svgelement){
	this.SvgElement=svgelement;
	this.SetTempPoint=null;
	this.HoverTempPoint=null;
	this.ChangeCurveType=null;
	this.OnRepaint=null;
	var IsTranslating=false;
	this.Zoom=1; // original --> zoom --> translate --> svg
	this.ApproachedLogZoom=0;
	this.TranslateX=0;
	this.TranslateY=0;
	var TranslateOriginal=null;
	var that=this;
	var mousepoint=null;
	$(svgelement).parent().mousemove(function(e) {
        var position=$(this).parent().offset();
		var cursorpoint=new Point(e.pageX-position.left-1,e.pageY-position.top-1);
		mousepoint=that.ReversePoint(cursorpoint);
		if(that.HoverTempPoint!==null)that.HoverTempPoint(mousepoint);
		if(IsTranslating){
			that.TranslateX+=cursorpoint.X-TranslateOriginal.X;
			that.TranslateY+=cursorpoint.Y-TranslateOriginal.Y;
			TranslateOriginal=cursorpoint;
			if(that.OnRepaint!==null)that.OnRepaint();
		}
    });
	$(svgelement).parent().mousedown(function(e) {
        var position=$(this).parent().offset();
		var cursorpoint=new Point(e.pageX-position.left-1,e.pageY-position.top-1);
		if(e.which==1){
			if(that.SetTempPoint!==null)that.SetTempPoint(that.ReversePoint(cursorpoint),ClickType.Down);
		}
		else if(e.which==3){
			TranslateOriginal=cursorpoint;
			IsTranslating=true;
			$(svgelement).css("cursor","move");
		}
    });
	$(svgelement).parent().mouseup(function(e) {
        var position=$(this).parent().offset();
		var cursorpoint=new Point(e.pageX-position.left-1,e.pageY-position.top-1);
		if(e.which==1){
			if(that.SetTempPoint!==null)that.SetTempPoint(that.ReversePoint(cursorpoint),ClickType.Up);
		}
		else if(e.which==3){
			that.TranslateX+=cursorpoint.X-TranslateOriginal.X;
			that.TranslateY+=cursorpoint.Y-TranslateOriginal.Y;
			TranslateOriginal=null;
			IsTranslating=false;
			$(svgelement).css("cursor","default");
			if(that.OnRepaint!==null)that.OnRepaint();
		}
    });
	$(svgelement).parent().mouseleave(function(e) {
        //if(that.SetTempPoint!==null)that.SetTempPoint(new Point(-10000,-10000),ClickType.Up);
    });
	$(svgelement).parent().bind("contextmenu",function(e){e.preventDefault();});
	$(svgelement).parent().mousewheel(function(e) {
		if(e.deltaY<0){
			--that.ApproachedLogZoom;
		}
		else if(e.deltaY>0){
			++that.ApproachedLogZoom;
		}
		$("#zoomanimator").stop(true,false);
		var zoomcentre=mousepoint;
		var origtransX=that.TranslateX;
		var origtransY=that.TranslateY;
		var origzoom=that.Zoom;
		$("#zoomanimator").animate({left:that.ApproachedLogZoom},{duration:400,step:function(now){
			that.Zoom=Math.pow(1.5,now);
			that.TranslateX=zoomcentre.X*(origzoom-that.Zoom)+origtransX;
			that.TranslateY=zoomcentre.Y*(origzoom-that.Zoom)+origtransY;
			if(that.OnRepaint!==null)that.OnRepaint();
		}});
		e.preventDefault();
	});
}
SvgHandler.MakeSvg=function(tag,attrs){
	var el=document.createElementNS("http://www.w3.org/2000/svg",tag);
	for(var k in attrs)el.setAttribute(k,attrs[k]);
	return el;
}
SvgHandler.prototype.SetPoint=function(id,color,point){
	if(color===null)color=(document.getElementById(id)!==null)?document.getElementById(id).getAttribute("fill"):"navy";
	this.RemovePoint(id);
	point=this.ForwardPoint(point);
	var element=SvgHandler.MakeSvg("circle",{id:id,cx:point.X,cy:point.Y,r:5,stroke:"none",fill:color});
	this.SvgElement.appendChild(element);
}
SvgHandler.prototype.SetCurve=function(id,color,curve){
	if(color===null)color=(document.getElementById(id)!==null)?document.getElementById(id).getAttribute("stroke"):"navy";
	this.RemoveCurve(id);
	var element=null;
	// don't create a new curve. just calculate the numbers here.
	if(curve.CurveType===CurveType.Circle){
		var newcentre=this.ForwardPoint(curve.Centre);
		element=SvgHandler.MakeSvg("circle",{id:id,cx:newcentre.X,cy:newcentre.Y,r:curve.Radius*this.Zoom,stroke:color,"stroke-width":2,fill:"none"});
	}
	else if(curve.CurveType===CurveType.Line){
		var svglinedata=this.CalculateSvgLine(curve);
		element=SvgHandler.MakeSvg('line',{id:id,x1:svglinedata[0],y1:svglinedata[1],x2:svglinedata[2],y2:svglinedata[3],stroke:color,"stroke-width":2});
	}
	if(element!==null)this.SvgElement.appendChild(element);
}
SvgHandler.prototype.SetOpacity=function(id,opacity){
	var element=document.getElementById(id);
	element.setAttribute("opacity",opacity);
}
SvgHandler.prototype.RemovePoint=function(id){
	var element=document.getElementById(id);
	if(element!==null)element.parentNode.removeChild(element);
}
SvgHandler.prototype.RemoveCurve=function(id){
	var element=document.getElementById(id);
	if(element!==null)element.parentNode.removeChild(element);
}
SvgHandler.prototype.CalculateSvgLine=function(line){
	var newC=line.C*this.Zoom+line.A*this.TranslateX+line.B*this.TranslateY;
	if(Math.abs(line.A)>Math.abs(line.B)){
		var height=$(this.SvgElement).parent().height()+5;
		return [(newC-line.B*(-5))/line.A,-5,(newC-line.B*height)/line.A,height];
	}
	else{
		var width=$(this.SvgElement).parent().width()+5;
		return [-5,(newC-line.A*(-5))/line.B,width,(newC-line.A*width)/line.B];
	}
}
SvgHandler.prototype.ForwardPoint=function(point){
	return new Point(point.X*this.Zoom+this.TranslateX,point.Y*this.Zoom+this.TranslateY);
}
SvgHandler.prototype.ReversePoint=function(point){
	return new Point((point.X-this.TranslateX)/this.Zoom,(point.Y-this.TranslateY)/this.Zoom);
}
SvgHandler.prototype.ResetMovement=function(){
	this.Zoom=1;
	this.ApproachedLogZoom=0;
	this.TranslateX=0;
	this.TranslateY=0;
}
var ClickType={};
ClickType.Up=1;
ClickType.Down=2;