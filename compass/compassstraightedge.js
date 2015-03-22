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
	var curvearray=new Array();
	var CIRCLE=1;
	var LINE=2;
	
	var EPSILON=0.000000001;
	
	//title builder
	var titlediv=document.createElement('div');
	titlediv.setAttribute('id','titlename');
	var titletext=document.createTextNode("Compass");
	titlediv.appendChild(titletext);
	document.getElementById("header").appendChild(titlediv);
	
	alert("Welcome");
	
	function Point(x,y){
		this.x=+x;
		this.y=+y;
	}
	
	function Circle(centre,radius){
		this.type=CIRCLE;
		this.centre=centre;
		this.radius=+radius;
	}
	
	function Distance(p1,p2){
		return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
	}
	
	function Line(p1,p2){
		this.type=LINE;
		this.p1=p1;
		this.p2=p2;
	}
	
	function ConstructLine(p1,p2){
		var tx1=p1.x;
		var ty1=p1.y;
		var tx2=p2.x;
		var ty2=p2.y;
		var x1,y1,x2,y2;
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
					}
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
		return new Line(new Point(x1,y1),new Point(x2,y2));
	}
	
	function makeSVG(tag,attrs){
		var el= document.createElementNS('http://www.w3.org/2000/svg',tag);
		for (var k in attrs)
			el.setAttribute(k,attrs[k]);
		return el;
	}
	
	function SolveQuadratic(a,b,c){
		var det=b*b-4*a*c;
		if(det<-EPSILON)return new Array();
		else if(det>EPSILON){
			det=Math.sqrt(det);
			return new Array((-b+det)/(2*a),(-b-det)/(2*a));
		}
		else{
			return new Array((-b)/(2*a));
		}
	}
	/*
	function CreateIntersections(c1,c2){
		if(c1.type==CIRCLE&&c2.type==CIRCLE){
			var x1=c1.centre.x;
			var y1=c1.centre.y;
			var r1=c1.radius;
			var x2=c2.centre.x;
			var y2=c2.centre.y;
			var r2=c2.radius;
			var d=(x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
			var dcr=((r1+r2)*(r1+r2)-d)*(d-(r1-r2)*(r1-r2));
			if(dcr>EPSILON){
				dcr=Math.sqrt(dcr);
				var xf=(x2+x1)+(x2-x1)*(r1*r1-r2*r2)/d;
				var xb=(y2-y1)*dcr/d;
				var yf=(y2+y1)+(y2-y1)*(r1*r1-r2*r2)/d;
				var yb=(x2-x1)*dcr/d;
				CreatePoint(new Point((xf+xb)/2,(yf-yb)/2));
				CreatePoint(new Point((xf-xb)/2,(yf+yb)/2));
			}
			else if(dcr>-EPSILON){
				var xf=(x2+x1)+(x2-x1)*(r1*r1-r2*r2)/d;
				var yf=(y2+y1)+(y2-y1)*(r1*r1-r2*r2)/d;
				CreatePoint(new Point(xf/2,yf/2));
			}
		}
		else if(c1.type==LINE&&c2.type==LINE){
			var x1=c1.p1.x;
			var y1=c1.p1.y;
			var x2=c1.p2.x;
			var y2=c1.p2.y;
			var x3=c2.p1.x;
			var y3=c2.p1.y;
			var x4=c2.p2.x;
			var y4=c2.p2.y;
			var x5;
			var y5;
			var k1=(x2-x1)/(y2-y1);
			var k2=(x4-x3)/(y4-y3);
			if(y2-y1!=0&&y4-y3!=0){
				if(Math.abs(k1-k2)>=EPSILON){
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
		else{
			if(c1.type==LINE&&c2.type==CIRCLE){
				var temp=c2;
				c2=c1;
				c1=temp;
			}
			var x1=c1.centre.x;
			var y1=c1.centre.y;
			var r=c1.radius;
			var x2=c2.p1.x;
			var y2=c2.p1.y;
			var x3=c2.p2.x;
			var y3=c2.p2.y;
			if(y3-y2!=0){
				var k1=(x3-x2)/(y3-y2);
				var k2=x2-x1-k1*y2;
				var roots=SolveQuadratic(k1*k1+1,2*(k1*k2-y1),k2*k2+y1*y1-r*r);
				$.each(roots,function(index,value){
					CreatePoint(new Point(k1*value-k1*y2+x2,value));
				});
			}
		}
	}*/
	
	function CreateAllIntersections(curve){
		$.each(curvearray,function(index,value){
			var temparr=Intersections(curve,value);
			$.each(temparr,function(k,v){
				var closestdist=1000;
				$.each(pointarray,function(ind,pt){
					var dist=Distance(pt,v);
					if(dist<closestdist)closestdist=dist;
				});
				if(closestdist>EPSILON){
					CreatePoint(v);
				}
			});
		});
	}
	
	function IntersectCL(c1,c2){
		var x1=c1.centre.x;
		var y1=c1.centre.y;
		var r=c1.radius;
		var x2=c2.p1.x;
		var y2=c2.p1.y;
		var x3=c2.p2.x;
		var y3=c2.p2.y;
		var ret=new Array();
		if(y3-y2!=0){
			var k1=(x3-x2)/(y3-y2);
			var k2=x2-x1-k1*y2;
			var roots=SolveQuadratic(k1*k1+1,2*(k1*k2-y1),k2*k2+y1*y1-r*r);
			$.each(roots,function(index,value){
				ret.push(new Point(k1*value-k1*y2+x2,value));
			});
		}
		return ret;
	}
	
	function GetNearestPoint(p){
		var minkey=-1;
		var minvalue=100000000;
		$.each(pointarray,function(k,v){
			var w=Distance(p,v);
			if(w<minvalue){
				minvalue=w;
				minkey=k;
			}
		});
		if(minvalue>stickylimit)return -1;
		else return minkey;
	}
	
	function GetNearestCurveAndSpawnPoint(p){
		var minlocation;
		var minvalue=100000000;
		$.each(curvearray,function(k,v){
			if(v.type==CIRCLE){
				var tmpline=new Line(p,v.centre);
				var tmppoints=IntersectCL(v,tmpline);
				$.each(tmppoints,function(index,location){
					var dist=Distance(p,location);
					if(dist<minvalue){
						minvalue=dist;
						minlocation=location;
					}
				});
			}
			else{
				//Not yet implemented
				var x1=v.p1.x;
				var y1=v.p1.y;
				var x2=v.p2.x;
				var y2=v.p2.y;
				var x3=p.x;
				var y3=p.y;
				var xx=x2-x1;
				var yy=y2-y1;
				var u=((x3-x1)*xx+(y3-y1)*yy)/(xx*xx+yy*yy);
				var tmppoint=new Point(x1+u*xx,y1+u*yy);
				var dist=Distance(p,tmppoint);
				if(dist<minvalue){
					minvalue=dist;
					minlocation=tmppoint;
				}
			}
		});
		if(minvalue>stickylimit)return -1;
		else{
			return CreatePoint(minlocation);
		}
	}
	
	var POINT=0;
	var COMPASS=1;
	var STRAIGHTEDGE=2;
	var SELECTOR=9;
	var curvetype=0;
	var clicked=false;
	var clickindex=0;
	var nostickypoints=false;
	var nostickycurves=false;
	var stickylimit=10;
	var drag=false;
	
	//temp curves
	var tempcircle=makeSVG('circle',{id:'tc',cx:-5,cy:-5,r:0,stroke:'red','stroke-width':2,fill:'none'});
	var templine=makeSVG('line',{id:'tl',x1:-5,y1:-5,x2:-5,y2:-5,stroke:'red','stroke-width':2});
	document.getElementById('mainsvg').appendChild(tempcircle);
	document.getElementById('mainsvg').appendChild(templine);
	
	function SelectPoint(index){
		document.getElementById('p'+index).setAttribute('fill','red');
	}
	
	function DeselectPoint(index){
		document.getElementById('p'+index).setAttribute('fill','blue');
	}
	
	function CreatePoint(p){
		var len=pointarray.length;
		pointarray[len]=p;
		selectedpoints[len]=false;
		var elem=makeSVG('circle',{id:'p'+len,cx:p.x,cy:p.y,r:5,stroke:'none',fill:'blue'});
		document.getElementById('mainsvg').appendChild(elem);
		return len;
	}
	
	function CreateCurve(curve){
		var len=curvearray.length;
		curvearray[len]=curve;
		selectedcurves[len]=false;
		var elem;
		if(curve.type==CIRCLE){
			elem=makeSVG('circle',{id:'c'+len,cx:curve.centre.x,cy:curve.centre.y,r:curve.radius,stroke:'black','stroke-width':2,fill:'none'});
		}
		else{
			elem=makeSVG('line',{id:'c'+len,x1:curve.p1.x,y1:curve.p1.y,x2:curve.p2.x,y2:curve.p2.y,stroke:'black','stroke-width':2});
		}
		document.getElementById('mainsvg').appendChild(elem);
		return len;
	}
	
	function SetTempCircle(c){
		tempcircle.setAttribute('cx',c.centre.x);
		tempcircle.setAttribute('cy',c.centre.y);
		tempcircle.setAttribute('r',c.radius);
	}
	
	function SetTempLine(l){
		templine.setAttribute('x1',l.p1.x);
		templine.setAttribute('x2',l.p2.x);
		templine.setAttribute('y1',l.p1.y);
		templine.setAttribute('y2',l.p2.y);
	}
	
	function HideTempCircle(){
		tempcircle.setAttribute('cx',-5);
		tempcircle.setAttribute('cy',-5);
		tempcircle.setAttribute('r',0);
	}
	
	function HideTempLine(){
		templine.setAttribute('x1',-5);
		templine.setAttribute('x2',-5);
		templine.setAttribute('y1',-5);
		templine.setAttribute('y2',-5);
	}
	
	
	
	function GetClosestAndSpawnPoint(pt){
		var minpoint=-1;
		if(!nostickypoints){
			minpoint=GetNearestPoint(pt);
		}
		if(minpoint==-1&&!nostickycurves){
			minpoint=GetNearestCurveAndSpawnPoint(pt); // function not implemented yet
		}
		if(minpoint==-1){
			minpoint=CreatePoint(pt);
		}
		return minpoint;
	}
	
	function ProcessFirstPoint(pointindex){
		if(curvetype!=POINT){
			SelectPoint(pointindex);
			clickindex=pointindex;
			clicked=true;
		}
	}
	
	function ProcessSecondPoint(newpointindex,oldpointindex){
		clicked=false;
		var curve;
		if(curvetype==COMPASS){
			HideTempCircle();
			curve=new Circle(pointarray[oldpointindex],Distance(pointarray[oldpointindex],pointarray[newpointindex]));
		}
		else if(curvetype==STRAIGHTEDGE){
			HideTempLine();
			curve=ConstructLine(pointarray[oldpointindex],pointarray[newpointindex]);
		}
		CreateAllIntersections(curve);
		CreateCurve(curve);
		DeselectPoint(oldpointindex);
	}
	
	function CorrectPoint(p){
		p.y-=$("#header").height();
		p.x-=1;
		return p;
	}
	
	//levels support start
	var FREEPLAY=0;
	var CHALLENGE=1;
	var gamemode=FREEPLAY;
	$("#freeplay").css("background-color","#FD6");
	$("#freeplay").css("font-weight","bold");
	$("#freeplay").css("border-color","#F00");
	var levellist=new Array();
	var currentset=-1;
	var currentlevel=-1;
	var selectedcurves=new Array();
	var selectedpoints=new Array();
	
	var levelselectdiv=$('<div id="levelselect"><div id="levelheader">Level Select</div><hr class="hr"><div id="fileopener">Load level set: <input type="file" id="fileinput" /><br />or URL: <input type="text" id="urlinput" /></div></div>');
	var Initialise=function(){}
	var AutoCheck=function(curves,points){return false;}
	var ManualCheck=function(curves,points){return false;}
	
	var librarydone=0;
	
	function LoadLevel(e){
		var temparr=this.getAttribute('id').split('k');
		currentset=+temparr[1];
		currentlevel=+temparr[2];
		Initialise=levellist[currentset][currentlevel][3];
		AutoCheck=levellist[currentset][currentlevel][4];
		ManualCheck=levellist[currentset][currentlevel][5];
		ClearAllObjects();
		selectedcurves=new Array();
		selectedpoints=new Array();
		$(".hideable").css('display','block');
		if(librarydone!=2){
			if(librarydone==0){
				alert("Error!");
				HideLevels();
				Initialise();
			}
			else{
				var callback=function(){
					if(librarydone!=2){
						setTimeout(callback,100);
					}
					else{
						HideLevels();
						Initialise();
					}
				}
				setTimeout(callback,100);
			}
		}
		else{
			HideLevels();
			Initialise();
		}
	}
	
	function AddLevels(level_set,set_id){
		var level_div=document.createElement('div');
		level_div.setAttribute('id','levelset'+set_id);
		level_div.setAttribute('class','levelset');
		document.getElementById('levelselect').appendChild(level_div);
		var level_table=document.createElement('table');
		level_table.setAttribute('class','leveltable');
		var num_levels=level_set.length-1;
		var curr_row=document.createElement('tr');
		var level_header=document.createElement('td');
		level_header.setAttribute('class','leveltitle');
		level_header.setAttribute('colspan','10');
		var level_title=document.createTextNode(level_set[0]);
		level_header.appendChild(level_title);
		curr_row.appendChild(level_header);
		level_table.appendChild(curr_row);
		level_div.appendChild(level_table);
		for(var i=0;i<num_levels;i++){
			if(i%10==0){
				curr_row=document.createElement('tr');
				level_table.appendChild(curr_row);
			}
			var curr_cell=document.createElement('td');
			curr_cell.setAttribute('class','leveltd');
			var curr_div=document.createElement('div');
			curr_div.setAttribute('id','levelk'+set_id+'k'+(i+1));
			curr_div.setAttribute('class','levelbutton');
			curr_div.setAttribute('title',level_set[i+1][0]);
			var curr_number=document.createTextNode(i+1);
			curr_div.appendChild(curr_number);
			curr_cell.appendChild(curr_div);
			curr_row.appendChild(curr_cell);
			$('#levelk'+set_id+'k'+(i+1)).click(LoadLevel);
		}
	}
	
	function DownloadFile(filename,loadcallback){
		var request=new XMLHttpRequest();
		request.onload=function(){
			loadcallback(this.responseText);
		}
		request.open("GET",filename);
		request.send();
	}
	
	var globaleval = {
    	eval: eval
	};

	function StartLevels(){
		$("body").append(levelselectdiv);
		$("#fileinput").change(function(e){
            var myfile=e.target.files[0];
			if(myfile){
				var file_reader=new FileReader();
				file_reader.onload=function(e){
					var file_contents=e.target.result;
					var level_set=new Array();
					eval(file_contents);
					if(level_set&&level_set.length>1){
						levellist.push(level_set);
						AddLevels(level_set,levellist.length-1);
					}
					else{
						alert("File corrupt!");
					}
				}
				file_reader.readAsText(myfile);
			}
			else{
				alert("Failed to load file!");
			}
        });
		if(librarydone==0){
			librarydone=1;
			DownloadFile("levels-library.js",function(contents){globaleval.eval(contents);librarydone=2;});
		}
	}
	
	function HideLevels(){
		$("#levelselect").remove();
	}
	
	function GetNearestCurve(p){
		var minindex=-1;
		var minvalue=100000000;
		$.each(curvearray,function(k,v){
			if(v.type==CIRCLE){
				var tmpline=new Line(p,v.centre);
				var tmppoints=IntersectCL(v,tmpline);
				$.each(tmppoints,function(index,location){
					var dist=Distance(p,location);
					if(dist<minvalue){
						minvalue=dist;
						minindex=k;
					}
				});
			}
			else{
				//Not yet implemented
				var x1=v.p1.x;
				var y1=v.p1.y;
				var x2=v.p2.x;
				var y2=v.p2.y;
				var x3=p.x;
				var y3=p.y;
				var xx=x2-x1;
				var yy=y2-y1;
				var u=((x3-x1)*xx+(y3-y1)*yy)/(xx*xx+yy*yy);
				var tmppoint=new Point(x1+u*xx,y1+u*yy);
				var dist=Distance(p,tmppoint);
				if(dist<minvalue){
					minvalue=dist;
					minindex=k;
				}
			}
		});
		if(minvalue>stickylimit)return -1;
		else{
			return minindex;
		}
	}
	
	function CreateCurveArray(curves){
		var ret=new Array();
		$.each(curves,function(k,v){
			if(v){
				ret.push(curvearray[k]);
			}
		});
		return ret;
	}
	
	function CreatePointArray(points){
		var ret=new Array();
		$.each(points,function(k,v){
			if(v){
				ret.push(pointarray[k]);
			}
		});
		return ret;
	}
	
	function ProcessSelection(pt){
		var minpoint=-1;
		if(!nostickypoints){
			minpoint=GetNearestPoint(pt);
			if(minpoint!=-1){
				selectedpoints[minpoint]=true;
			}
		}
		if(minpoint==-1&&!nostickycurves){
			minpoint=GetNearestCurve(pt);
			if(minpoint!=-1){
				selectedcurves[minpoint]=true;
			}
		}
		if(minpoint!=-1){
			if(AutoCheck(CreateCurveArray(selectedcurves),CreatePointArray(selectedpoints),curvearray,pointarray)){
				alert("Win");
			}
			else{
				alert("not yet");
			}
		}
	}
	
	//levels support end
	
	$("#mainsvg").click(function(e){
		if(curvetype==SELECTOR&&gamemode==CHALLENGE){
			var pt=CorrectPoint(new Point(e.pageX,e.pageY));
			ProcessSelection(pt);
		}
		else if(drag==false){
			var pt=CorrectPoint(new Point(e.pageX,e.pageY));
			var pointindex=GetClosestAndSpawnPoint(pt);
			if(clicked==false){
				ProcessFirstPoint(pointindex);
			}
			else{
				ProcessSecondPoint(pointindex,clickindex);
			}
		}
	});
	
	$("#mainsvg").mousedown(function(e){
		if(drag==true&&curvetype!=SELECTOR){
			var pt=CorrectPoint(new Point(e.pageX,e.pageY));
			var pointindex=GetClosestAndSpawnPoint(pt);
			ProcessFirstPoint(pointindex);
		}
	});
	
	$("#mainsvg").mouseup(function(e){
        if(drag==true&&curvetype!=SELECTOR){
			var pt=CorrectPoint(new Point(e.pageX,e.pageY));
			var pointindex=GetClosestAndSpawnPoint(pt);
			if(clicked==true){
				ProcessSecondPoint(pointindex,clickindex);
			}
		}
    });
	
	$("#mainsvg").mousemove(function(e){
		if(clicked==true){
			var pt=CorrectPoint(new Point(e.pageX,e.pageY));
			if(curvetype==COMPASS){
				SetTempCircle(new Circle(pointarray[clickindex],Distance(pt,pointarray[clickindex])));
			}
			else if(curvetype==STRAIGHTEDGE){
				SetTempLine(ConstructLine(pointarray[clickindex],pt));
			}
		}
	});
	
	$("#compass").click(function(){
		$(".sidebutton").css("background-color","#FF0");
		$(".sidebutton").css("font-weight","normal");
		HideTempCircle();
		HideTempLine();
		clicked=false;
		if(curvetype==COMPASS)curvetype=POINT;
		else{
			curvetype=COMPASS;
			$(this).css("background-color","#FC0");
			$(this).css("font-weight","bold");
		}
	});
	
	$("#straightedge").click(function(){
		$(".sidebutton").css("background-color","#FF0");
		$(".sidebutton").css("font-weight","normal");
		HideTempCircle();
		HideTempLine();
		clicked=false;
		if(curvetype==STRAIGHTEDGE)curvetype=POINT;
		else{
			curvetype=STRAIGHTEDGE;
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
	
	function ClearAllObjects(){
		clicked=false;
		$("#mainsvg").empty();
		pointarray.length=0;
		curvearray.length=0;
		document.getElementById('mainsvg').appendChild(tempcircle);
		document.getElementById('mainsvg').appendChild(templine);
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
		stickylimit=$(this).val();
	});
	
	$("#drag").click(function(e){
        drag=$(this).is(":checked");
    });
	
	$("#clearall").click(function(e){
        ClearAllObjects();
    });
	
	$("#clearall").mouseenter(function(e){
        $(this).css('background-color','#5F3');
    });
	
	$("#clearall").mouseleave(function(e){
        $(this).css('background-color','#AF9');
    });
	
	$("#freeplay").click(function(e){
		if(gamemode!=FREEPLAY){
			$(".gamemode").css("background-color","#FF9");
			$(".gamemode").css("font-weight","normal");
			$(".gamemode").css("border-color","transparent");
			gamemode=FREEPLAY;
			$(this).css("background-color","#FD6");
			$(this).css("font-weight","bold");
			$(this).css("border-color","#F00");
		}
		HideLevels();
		if(curvetype==SELECTOR){
			$("#selector").click();
		}
    });
	
	$("#challenge").click(function(e){
		if(gamemode!=CHALLENGE){
			$(".gamemode").css("background-color","#FF9");
			$(".gamemode").css("font-weight","normal");
			$(".gamemode").css("border-color","transparent");
			gamemode=CHALLENGE;
			$(this).css("background-color","#FD6");
			$(this).css("font-weight","bold");
			$(this).css("border-color","#F00");
		}
		StartLevels();
    });
	
	$("#freeplay").mouseenter(function(e){
        if(gamemode!=FREEPLAY){
			$(this).css("background-color","#FD6");
		}
    });
	
	$("#freeplay").mouseleave(function(e){
        if(gamemode!=FREEPLAY){
			$(this).css("background-color","#FF9");
		}
    });
	
	$("#challenge").mouseenter(function(e){
        if(gamemode!=CHALLENGE){
			$(this).css("background-color","#FD6");
		}
    });
	
	$("#challenge").mouseleave(function(e){
        if(gamemode!=CHALLENGE){
			$(this).css("background-color","#FF9");
		}
    });
	
	$("#selector").click(function(e){
		$(".sidebutton").css("background-color","#FF0");
		$(".sidebutton").css("font-weight","normal");
		HideTempCircle();
		HideTempLine();
		clicked=false;
		if(curvetype==SELECTOR)curvetype=POINT;
		else{
			curvetype=SELECTOR;
			$(this).css("background-color","#FC0");
			$(this).css("font-weight","bold");
		}
    });
	
	
	
	
	
	
	
	//other library functions
	
	function Intersections(c1,c2){
		var ret=new Array();
		if(c1.type==CIRCLE&&c2.type==CIRCLE){
			var x1=c1.centre.x;
			var y1=c1.centre.y;
			var r1=c1.radius;
			var x2=c2.centre.x;
			var y2=c2.centre.y;
			var r2=c2.radius;
			var d=(x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
			var dcr=((r1+r2)*(r1+r2)-d)*(d-(r1-r2)*(r1-r2));
			if(dcr>EPSILON){
				dcr=Math.sqrt(dcr);
				var xf=(x2+x1)+(x2-x1)*(r1*r1-r2*r2)/d;
				var xb=(y2-y1)*dcr/d;
				var yf=(y2+y1)+(y2-y1)*(r1*r1-r2*r2)/d;
				var yb=(x2-x1)*dcr/d;
				ret.push(new Point((xf+xb)/2,(yf-yb)/2));
				ret.push(new Point((xf-xb)/2,(yf+yb)/2));
			}
			else if(dcr>-EPSILON){
				var xf=(x2+x1)+(x2-x1)*(r1*r1-r2*r2)/d;
				var yf=(y2+y1)+(y2-y1)*(r1*r1-r2*r2)/d;
				ret.push(new Point(xf/2,yf/2));
			}
		}
		else if(c1.type==LINE&&c2.type==LINE){
			var x1=c1.p1.x;
			var y1=c1.p1.y;
			var x2=c1.p2.x;
			var y2=c1.p2.y;
			var x3=c2.p1.x;
			var y3=c2.p1.y;
			var x4=c2.p2.x;
			var y4=c2.p2.y;
			var x5;
			var y5;
			var k1=(x2-x1)/(y2-y1);
			var k2=(x4-x3)/(y4-y3);
			if(y2-y1!=0&&y4-y3!=0){
				if(Math.abs(k1-k2)>=EPSILON){
					y5=(x3+k1*y1-x1-k2*y3)/(k1-k2);
					x5=x1+k1*(y5-y1);
					ret.push(new Point(x5,y5));
				}
			}
			else if(y4-y3!=0){
				y5=y1;
				x5=x3+k2*(y5-y3);
				ret.push(new Point(x5,y5));
			}
			else if(y2-y1!=0){
				y5=y3;
				x5=x1+k1*(y5-y1);
				ret.push(new Point(x5,y5));
			}
		}
		else{
			if(c1.type==LINE&&c2.type==CIRCLE){
				var temp=c2;
				c2=c1;
				c1=temp;
			}
			var x1=c1.centre.x;
			var y1=c1.centre.y;
			var r=c1.radius;
			var x2=c2.p1.x;
			var y2=c2.p1.y;
			var x3=c2.p2.x;
			var y3=c2.p2.y;
			if(y3-y2!=0){
				var k1=(x3-x2)/(y3-y2);
				var k2=x2-x1-k1*y2;
				var roots=SolveQuadratic(k1*k1+1,2*(k1*k2-y1),k2*k2+y1*y1-r*r);
				$.each(roots,function(index,value){
					ret.push(new Point(k1*value-k1*y2+x2,value));
				});
			}
		}
		return ret;
	}

});