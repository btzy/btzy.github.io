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
	alert("Welcome");
	
	function Point(x,y){
		this.x=x;
		this.y=y;
	}
	
	function Circle(x,y,r){
		this.x=x;
		this.y=y;
		this.r=r;
	}
	
	function Distance(x1,y1,x2,y2){
		return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	}
	
	function Line(x1,y1,x2,y2){
		this.x1=x1;
		this.y1=y1;
		this.x2=x2;
		this.y2=y2;
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
	
	function makeSVG(tag, attrs) {
		var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
		for (var k in attrs)
			el.setAttribute(k, attrs[k]);
		return el;
	}
	
	function IntersectCC(circle1,circle2){
		
	}
	
	function IntersectCL(circle,line){
		
	}
	
	function IntersectLL(line1,line2){
		
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
		if(minvalue>10)return -1;
		else return minkey;
	}
	
	//function GetNearestCurve
	
	$("#mainsvg").click(function(e){
		var c=new Point(e.pageX,e.pageY);
		var minkey;
		if(!nostickypoints){
			minkey=GetNearestPoint(c);
		}
		else{
			minkey=-1;
		}
		if(clicked==false){
			if(minkey!=-1){
				clickindex=minkey;
				document.getElementById('p'+minkey).setAttribute('fill','red');
				
			}
			else{
				var len=pointarray.length;
				pointarray[len]=c;
				var elem=makeSVG('circle',{id:'p'+len,cx:c.x,cy:c.y,r:5,stroke:'none',fill:'red'});
				document.getElementById('mainsvg').appendChild(elem);
				clickindex=len;
				//alert("click!");
			}
			clicked=true;
			if(selected==1){
				var circ=makeSVG('circle',{id:'c'+circlearray.length,cx:pointarray[clickindex].x,cy:pointarray[clickindex].y,r:0,stroke:'red','stroke-width':2,fill:'none'});
				document.getElementById('mainsvg').appendChild(circ);
			}
			else if(selected==2){
				var line=makeSVG('line',{id:'l'+linearray.length,stroke:'red','stroke-width':2});
				document.getElementById('mainsvg').appendChild(line);
			}
			else{
				document.getElementById('p'+clickindex).setAttribute('fill','blue');
				clicked=false;
			}
		}
		else{
			if(selected==1){
				var rad;
				if(minkey!=-1){
					rad=Distance(pointarray[minkey].x,pointarray[minkey].y,pointarray[clickindex].x,pointarray[clickindex].y);
					document.getElementById('c'+circlearray.length).setAttribute('r',rad);
				}
				else{
					var len=pointarray.length;
					pointarray[len]=c;
					var elem=makeSVG('circle',{id:'p'+len,cx:c.x,cy:c.y,r:5,stroke:'none',fill:'blue'});
					document.getElementById('mainsvg').appendChild(elem);
					rad=document.getElementById('c'+circlearray.length).getAttribute('r');
				}
				document.getElementById('c'+circlearray.length).setAttribute('stroke','black');
				document.getElementById('p'+clickindex).setAttribute('fill','blue');
				var tmpcircle=new Circle(pointarray[clickindex].x,pointarray[clickindex].y,rad);
				$.each(circlearray,function(index,value){
					//IntersectCC(tmpcircle,value);
				});
				$.each(linearray,function(index,value){
					//IntersectCL(tmpcircle,value);
				});
				var clen=circlearray.length;
				circlearray[clen]=tmpcircle;
			}
			else if(selected==2){
				var line;
				if(minkey!=-1){
					line=ConstructLine(pointarray[minkey].x,pointarray[minkey].y,pointarray[clickindex].x,pointarray[clickindex].y);
					document.getElementById('l'+linearray.length).setAttribute('x1',line.x1);
					document.getElementById('l'+linearray.length).setAttribute('x2',line.x2);
					document.getElementById('l'+linearray.length).setAttribute('y1',line.y1);
					document.getElementById('l'+linearray.length).setAttribute('y2',line.y2);
				}
				else{
					var len=pointarray.length;
					pointarray[len]=c;
					var elem=makeSVG('circle',{id:'p'+len,cx:c.x,cy:c.y,r:5,stroke:'none',fill:'blue'});
					document.getElementById('mainsvg').appendChild(elem);
					line=new Line(document.getElementById('l'+linearray.length).getAttribute('x1'),document.getElementById('l'+linearray.length).getAttribute('y1'),document.getElementById('l'+linearray.length).getAttribute('x2'),document.getElementById('l'+linearray.length).getAttribute('y2'));
				}
				document.getElementById('l'+linearray.length).setAttribute('stroke','black');
				document.getElementById('p'+clickindex).setAttribute('fill','blue');
				$.each(circlearray,function(index,value){
					//IntersectCL(line,value);
				});
				$.each(linearray,function(index,value){
					//IntersectLL(line,value);
				});
				var llen=linearray.length;
				linearray[llen]=new Circle(pointarray[clickindex].x,pointarray[clickindex].y,rad);
			}
			clicked=false;
		}
	});
	
	$("#mainsvg").mousemove(function(e){
		if(clicked==true){
			if(selected==1){
				document.getElementById('c'+circlearray.length).setAttribute('r',Distance(e.pageX,e.pageY,pointarray[clickindex].x,pointarray[clickindex].y));
			}
			else if(selected==2){
				var tmpline=ConstructLine(pointarray[clickindex].x,pointarray[clickindex].y,e.pageX,e.pageY);
				//1=pointarray[clickindex]
				//2=e.page
				//alert("height="+$("#mainbar").height()+" width="+$("#mainbar").width());
				document.getElementById('l'+linearray.length).setAttribute('x1',tmpline.x1);
				document.getElementById('l'+linearray.length).setAttribute('x2',tmpline.x2);
				document.getElementById('l'+linearray.length).setAttribute('y1',tmpline.y1);
				document.getElementById('l'+linearray.length).setAttribute('y2',tmpline.y2);
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
	
	$(document).keydown(function(e){
		if(e.keyCode==16){ //Shift key
			nostickypoints=true;
		}
		else if(e.keyCode==17){ //Ctrl key
			nostickycurves=true;
		}
	});
	
	$(document).keyup(function(e){
		if(e.keyCode==16){ //Shift key
			nostickypoints=false;
		}
		else if(e.keyCode==17){ //Ctrl key
			nostickycurves=false;
		}
	});
});