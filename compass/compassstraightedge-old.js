$(document).ready(function(){
	var ie = (function(){
		var undef, v = 3, div = document.createElement('div');
		while (
			div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
			div.getElementsByTagName('i')[0]
		);
		return v> 4 ? v : undef;
	}());
	if(ie)alert("Still using Internet Explorer? It doesn't work here. Switch to Chrome or Firefox.");
	
	var pointarray=new Array();
	var circlearray=new Array();
	var linearray=new Array();
	var selected=0;
	var clicked=false;
	var clickindex=0;
	var nostickypoints=false;
	var nostickycurves=false;
	var stickylimit=10;
	alert("Welcome");
	
	function Point(x,y){
		this.x=+x;
		this.y=+y;
	}
	
	function Circle(x,y,r){
		this.x=+x;
		this.y=+y;
		this.r=+r;
	}
	
	function Distance(x1,y1,x2,y2){
		return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	}
	
	function Line(x1,y1,x2,y2){
		this.x1=+x1;
		this.y1=+y1;
		this.x2=+x2;
		this.y2=+y2;
	}
	
	function CurveIndexer(t,index){
		this.type=t;
		this.index=index;
	}
	
	function ConstructLine(tx1,ty1,tx2,ty2){
		var x1,y1,x2,y2;
		//alert(tx1+" "+ty1+" "+tx2+" "+ty2);
		if(Math.abs(tx1-tx2)>0.01){
			if(Math.abs(ty1-ty2)>0.01){
				if((ty1-ty2)/(tx1-tx2)>0){
					var tmp1=(ty1-ty2)/(tx1-tx2);
					var tmp2=(tx1-tx2)/(ty1-ty2);
					var k1=(-5-tx1)*tmp1+ty1;
					var k3=(-5-ty1)*tmp2+tx1;
					if(k1>k3){
						x1=-5;
						y1=k1;
					}
					else{
						x1=k3;
						y1=-5;
						//alert("i");
					}
					//alert(k1+" "+k3+"H"+" "+tx1);
					k1=($("#mainbar").width()+5-tx1)*tmp1+ty1;
					k3=($("#mainbar").height()+5-ty1)*tmp2+tx1;
					if(k1<k3){
						x2=$("#mainbar").width()+5;
						y2=k1;
					}
					else{
						x2=k3;
						y2=$("#mainbar").height()+5;
					}
				}
				else{
					var tmp1=(ty1-ty2)/(tx1-tx2);
					var tmp2=(tx1-tx2)/(ty1-ty2);
					var k1=(-5-tx1)*tmp1+ty1;
					var k3=($("#mainbar").height()+5-ty1)*tmp2+tx1;
					if(k3<-5){
						x1=-5;
						y1=k1;
					}
					else{
						x1=k3;
						y1=$("#mainbar").height()+5;
					}
					//alert(k1+" "+k3+"L"+" "+$("#mainbar").height());
					k1=($("#mainbar").width()+5-tx1)*tmp1+ty1;
					k3=(-5-ty1)*tmp2+tx1;
					if(k3<-5){
						x2=$("#mainbar").width()+5;
						y2=k1;
					}
					else{
						x2=k3;
						y2=-5;
					}
				}
			}
			else{
				var tmp1=(ty1-ty2)/(tx1-tx2);
				x1=-5;
				y1=(-5-tx1)*tmp1+ty1;
				x2=$("#mainbar").width()+5;
				y2=($("#mainbar").width()+5-tx1)*tmp1+ty1;
			}
		}
		else{
			if(Math.abs(ty1-ty2)>0.01){
				var tmp2=(tx1-tx2)/(ty1-ty2);
				x1=(-5-ty1)*tmp2+tx1;
				y1=-5;
				x2=($("#mainbar").height()+5-ty1)*tmp2+tx1;
				y2=$("#mainbar").height()+5;
			}
			else{
				x1=tx1;
				y1=ty1;
				x2=x1;
				y2=y1;
			}
		}
		return new Line(x1,y1,x2,y2);
	}
	
	function makeSVG(tag,attrs){
		var el= document.createElementNS('http://www.w3.org/2000/svg',tag);
		for (var k in attrs)
			el.setAttribute(k,attrs[k]);
		return el;
	}
	
	function SolveQuadratic(a,b,c){
		var det=b*b-4*a*c;
		if(det<0)return new Array();
		else if(det>0){
			det=Math.sqrt(det);
			return new Array((-b+det)/(2*a),(-b-det)/(2*a));
		}
		else{
			return new Array((-b)/(2*a),0);
		}
	}
	
	function IntersectCC(circle1,circle2){
		var x1=circle1.x;
		var y1=circle1.y;
		var r1=circle1.r;
		var x2=circle2.x;
		var y2=circle2.y;
		var r2=circle2.r;
		var d=(x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
		var dcr=((r1+r2)*(r1+r2)-d)*(d-(r1-r2)*(r1-r2));
		if(dcr>=-0.0000001){
			if(dcr>0)dcr=Math.sqrt(dcr);
			else dcr=0;
			var xf=(x2+x1)+(x2-x1)*(r1*r1-r2*r2)/d;
			var xb=(y2-y1)*dcr/d;
			var yf=(y2+y1)+(y2-y1)*(r1*r1-r2*r2)/d;
			var yb=(x2-x1)*dcr/d;
			CreatePoint(new Point((xf+xb)/2,(yf-yb)/2));
			CreatePoint(new Point((xf-xb)/2,(yf+yb)/2));
		}
	}
	
	function IntersectCL(circle,line){
		var x1=circle.x;
		var y1=circle.y;
		var r=circle.r;
		var x2=line.x1;
		var y2=line.y1;
		var x3=line.x2;
		var y3=line.y2;
		if(y3-y2!=0){
			var k1=(x3-x2)/(y3-y2);
			var k2=x2-x1-k1*y2;
			var roots=SolveQuadratic(k1*k1+1,2*(k1*k2-y1),k2*k2+y1*y1-r*r);
			$.each(roots,function(index,value){
				CreatePoint(new Point(k1*value-k1*y2+x2,value));
			});
		}
	}
	
	function IntersectLL(line1,line2){
		var x1=line1.x1;
		var y1=line1.y1;
		var x2=line1.x2;
		var y2=line1.y2;
		var x3=line2.x1;
		var y3=line2.y1;
		var x4=line2.x2;
		var y4=line2.y2;
		var x5;
		var y5;
		var k1=(x2-x1)/(y2-y1);
		var k2=(x4-x3)/(y4-y3);
		if(y2-y1!=0&&y4-y3!=0){
			if(Math.abs(k1-k2)>=0.0000001){
				y5=(x3+k1*y1-x1-k2*y3)/(k1-k2);
				x5=x1+k1*(y5-y1);
				CreatePoint(new Point(x5,y5));
			}
		}
		else if(y4-y3!=0){
			y5=y1;
			x5=x3+k2*(y5-y3);
			CreatePoint(new Point(x5,y5));
		}
		else if(y2-y1!=0){
			y5=y3;
			x5=x1+k1*(y5-y1);
			CreatePoint(new Point(x5,y5));
		}
	}
	
	function IntersectArrCL(circle,line){
		var x1=circle.x;
		var y1=circle.y;
		var r=circle.r;
		var x2=line.x1;
		var y2=line.y1;
		var x3=line.x2;
		var y3=line.y2;
		var pointarr=new Array();
		if(y3-y2!=0){
			var k1=(x3-x2)/(y3-y2);
			var k2=x2-x1-k1*y2;
			var roots=SolveQuadratic(k1*k1+1,2*(k1*k2-y1),k2*k2+y1*y1-r*r);
			$.each(roots,function(index,value){
				var len=pointarr.length;
				pointarr[len]=new Point(k1*value-k1*y2+x2,value);
			});
		}
		return pointarr;
	}
	
	function GetNearestPoint(p){
		var minkey=-1;
		var minvalue=100000000;
		$.each(pointarray,function(k,v){
			var w=Distance(p.x,p.y,v.x,v.y);
			if(w<minvalue){
				minvalue=w;
				minkey=k;
			}
		});
		if(minvalue>stickylimit)return -1;
		else return minkey;
	}
	
	function GetNearestCurve(p){
		var minpoint;
		var minvalue=100000000;
		$.each(circlearray,function(k,v){
			var line=new Line(p.x,p.y,v.x,v.y);
			var pointarr=IntersectArrCL(v,line);
			$.each(pointarr,function(k,point){
				var dist=Distance(p.x,p.y,point.x,point.y);
				if(dist<minvalue){
					minvalue=dist;
					minpoint=point;
				}
			});
		});
		$.each(linearray,function(k,v){
			//var a=v.y1-v.y2;
			//var b=v.x2-v.x1;
			//var c=v.y1*b+v.x1*a;
			//var dist=Math.abs(a*p.x+b*p.y-c)/Math.sqrt(a*a+b*b);
			var u=(p.x-v.x1)(v.x2 - v.x1)+(p.y - v.y1)(v.y2 - v.y1)/((v.x2 - v.x1)^2+(v.y2-v.y1)^2);
			if(dist<minvalue){
				
			}
		});
		if(minvalue<=stickylimit)return minpoint;
		else{
			var und;
			return und;
		}
	}
	
	function SelectPoint(index){
		document.getElementById('p'+index).setAttribute('fill','red');
	}
	
	function DeselectPoint(index){
		document.getElementById('p'+index).setAttribute('fill','blue');
	}
	
	function CreatePoint(p){
		var len=pointarray.length;
		pointarray[len]=p;
		var elem=makeSVG('circle',{id:'p'+len,cx:p.x,cy:p.y,r:5,stroke:'none',fill:'blue'});
		document.getElementById('mainsvg').appendChild(elem);
		return len;
	}
	
	function CreateTempCircle(p){
		var circ=makeSVG('circle',{id:'c'+circlearray.length,cx:p.x,cy:p.y,r:0,stroke:'red','stroke-width':2,fill:'none'});
		document.getElementById('mainsvg').appendChild(circ);
		return circlearray.length;
	}
	
	function CreateTempLine(){
		var line=makeSVG('line',{id:'l'+linearray.length,stroke:'red','stroke-width':2});
		document.getElementById('mainsvg').appendChild(line);
	}
	
	function SetTempCircle(r){
		document.getElementById('c'+circlearray.length).setAttribute('r',r);
	}
	
	function GetTempCircle(){
		return document.getElementById('c'+circlearray.length).getAttribute('r');
	}
	
	function SetTempLine(l){
		document.getElementById('l'+linearray.length).setAttribute('x1',l.x1);
		document.getElementById('l'+linearray.length).setAttribute('x2',l.x2);
		document.getElementById('l'+linearray.length).setAttribute('y1',l.y1);
		document.getElementById('l'+linearray.length).setAttribute('y2',l.y2);
	}
	
	function GetTempLine(){
		return new Line(document.getElementById('l'+linearray.length).getAttribute('x1'),document.getElementById('l'+linearray.length).getAttribute('y1'),document.getElementById('l'+linearray.length).getAttribute('x2'),document.getElementById('l'+linearray.length).getAttribute('y2'));
	}
	
	function StoreCircle(c){
		document.getElementById('c'+circlearray.length).setAttribute('stroke','black');
		var clen=circlearray.length;
		circlearray[clen]=c;
	}
	
	function StoreLine(l){
		document.getElementById('l'+linearray.length).setAttribute('stroke','black');
		var llen=linearray.length;
		linearray[llen]=l;
	}
	
	function CalculateCircleIntersections(c){
		$.each(circlearray,function(index,value){
			IntersectCC(c,value);
		});
		$.each(linearray,function(index,value){
			IntersectCL(c,value);
		});
	}
	
	function CalculateLineIntersections(l){
		$.each(circlearray,function(index,value){
			IntersectCL(value,l);
		});
		$.each(linearray,function(index,value){
			IntersectLL(l,value);
		});
	}
	
	$("#mainsvg").click(function(e){
		var c=new Point(e.pageX,e.pageY);
		var minkey=-1;
		var mincurvepoint;
		if(!nostickypoints){
			minkey=GetNearestPoint(c);
		}
		if(minkey==-1&&!nostickycurves){
			mincurvepoint=GetNearestCurve(c);
		}
		if(clicked==false){
			if(minkey!=-1){
				clickindex=minkey;
				SelectPoint(minkey);
			}
			else if(mincurvepoint!==undefined){
				clickindex=CreatePoint(mincurvepoint);
				SelectPoint(clickindex);
			}
			else{
				clickindex=CreatePoint(c);
				SelectPoint(clickindex);
			}
			clicked=true;
			if(selected==1){
				CreateTempCircle(pointarray[clickindex]);
			}
			else if(selected==2){
				CreateTempLine();
			}
			else{
				DeselectPoint(clickindex);
				clicked=false;
			}
		}
		else{
			if(selected==1){
				var rad;
				if(minkey!=-1){
					rad=Distance(pointarray[minkey].x,pointarray[minkey].y,pointarray[clickindex].x,pointarray[clickindex].y);
					SetTempCircle(rad);
				}
				else if(mincurvepoint!==undefined){
					var len=CreatePoint(mincurvepoint);
					rad=Distance(mincurvepoint.x,mincurvepoint.y,pointarray[clickindex].x,pointarray[clickindex].y);
					SetTempCircle(rad);
				}
				else{
					var len=CreatePoint(c);
					rad=GetTempCircle();
				}
				var tmpcircle=new Circle(pointarray[clickindex].x,pointarray[clickindex].y,rad);
				CalculateCircleIntersections(tmpcircle);
				DeselectPoint(clickindex);
				StoreCircle(tmpcircle);
			}
			else if(selected==2){
				var line;
				if(minkey!=-1){
					line=ConstructLine(pointarray[minkey].x,pointarray[minkey].y,pointarray[clickindex].x,pointarray[clickindex].y);
					SetTempLine(line);
				}
				else{
					var len=CreatePoint(c);
					line=GetTempLine();
				}
				CalculateLineIntersections(line);
				DeselectPoint(clickindex);
				StoreLine(line);
			}
			clicked=false;
		}
	});
	
	$("#mainsvg").mousemove(function(e){
		if(clicked==true){
			if(selected==1){
				SetTempCircle(Distance(e.pageX,e.pageY,pointarray[clickindex].x,pointarray[clickindex].y));
			}
			else if(selected==2){
				var tmpline=ConstructLine(pointarray[clickindex].x,pointarray[clickindex].y,e.pageX,e.pageY);
				SetTempLine(tmpline);
			}
		}
	});
	
	$("#compass").click(function(){
		$(".sidebutton").css("background-color","#FF0");
		$(".sidebutton").css("font-weight","normal");
		if(selected==1)selected=0;
		else{
			selected=1;
			$(this).css("background-color","#FC0");
			$(this).css("font-weight","bold");
		}
	});
	
	$("#straightedge").click(function(){
		$(".sidebutton").css("background-color","#FF0");
		$(".sidebutton").css("font-weight","normal");
		if(selected==2)selected=0;
		else{
			selected=2;
			$(this).css("background-color","#FC0");
			$(this).css("font-weight","bold");
		}
	});
	
	function SelectOption(id){
		$("#"+id).css("border-color","#000");
		$("#"+id).css("color","#000");
		$("#"+id).css("background-color","#999");
	}
	
	function UnselectOption(id){
		$("#"+id).css("border-color","#666");
		$("#"+id).css("color","#666");
		$("#"+id).css("background-color","#FFF");
	}
	
	$(document).keydown(function(e){
		if(e.keyCode==16){ //Shift key
			nostickypoints=true;
			SelectOption("nopoints");
		}
		else if(e.keyCode==17){ //Ctrl key
			nostickycurves=true;
			SelectOption("nocurves");
		}
	});
	
	$(document).keyup(function(e){
		if(e.keyCode==16){ //Shift key
			nostickypoints=false;
			UnselectOption("nopoints");
		}
		else if(e.keyCode==17){ //Ctrl key
			nostickycurves=false;
			UnselectOption("nocurves");
		}
	});
	
	$("#sticky").change(function(){
		stickylimit=$("#sticky").val();
	});
});