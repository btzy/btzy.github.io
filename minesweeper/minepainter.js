function NormalPainter(cellclicked){
	this.CellClicked=cellclicked;
}
NormalPainter.prototype.Height=0;
NormalPainter.prototype.Width=0;
NormalPainter.prototype.SquareSize=0;
NormalPainter.prototype.Grid=null; // -2:closed ; -3:bomb ; -4:question
NormalPainter.prototype.ResetGrid=function(height,width,windowheight,windowwidth){
	var htmlstring="";
	for(var i=0;i<height;++i){
		htmlstring+="<tr>";
		for(var j=0;j<width;++j){
			htmlstring+='<td id="cell_'+i+'_'+j+'" class="cellclosed"><div class="blocker"></div><div class="number"></div></td>';
		}
		htmlstring+="<\tr>";
	}
	this.Grid=new Array(height);
	for(var i=0;i<height;++i){
		this.Grid[i]=new Array(width);
		for(var j=0;j<width;++j){
			this.Grid[i][j]=-2;
		}
	}
	$("#minecontainer").find("table").html(htmlstring);
	var val=Math.max(Math.min(Math.min((windowwidth-100-20)/width,(windowheight-100-20)/height)-4,40),20);
	this.SquareSize=val;
	$("#minecontainer").find("td").css({width:val+4,height:val+4});
	$("#minecontainer").find("td").find(".blocker").css({width:val,height:val});
	$("#minecontainer").find("td").find(".number").css({width:val,height:val});
	var cellclicked=this.CellClicked;
	var selectedcell=new Array(-1,-1);
	$(".cellclosed").mousedown((function(painter){return function(e) {
        switch(e.which){
		case 1: // Left click
			var comp=$(this).attr("id").split("_");
			if(painter.Grid[parseInt(comp[1])][parseInt(comp[2])]!=-3){
				selectedcell=new Array(parseInt(comp[1]),parseInt(comp[2]));
				painter.Select(parseInt(comp[1]),parseInt(comp[2]));
			}
			break;
		}
		e.preventDefault();
    };})(this));
	$(".cellclosed").mouseup((function(painter){return function(e) {
        var comp=$(this).attr("id").split("_");
		var x=parseInt(comp[1]);
		var y=parseInt(comp[2]);
		switch(e.which){
		case 1: // Left click
			if(selectedcell[0]==x&&selectedcell[1]==y){
				cellclicked(x,y);
				selectedcell=new Array(-1,-1);
			}
			break;
		case 3: // Right click
			var tmpmap={"-2":-3,"-3":-4,"-4":-2};
			painter.Paint(x,y,painter.Grid[x][y]=tmpmap[""+painter.Grid[x][y]]);
			break;
		}
		e.preventDefault();
	};})(this));
	$(".cellclosed").mouseout((function(painter){return function(e) {
        switch(e.which){
		case 1: // Left click
			var comp=$(this).attr("id").split("_");
			if(selectedcell[0]==parseInt(comp[1])&&selectedcell[1]==parseInt(comp[2])){
				painter.Deselect(parseInt(comp[1]),parseInt(comp[2]));
				selectedcell=new Array(-1,-1);
			}
			break;
		}
    };})(this));
	$(".cellclosed").children().bind("contextmenu", function(){
		return false;
	});
	this.Height=height;
	this.Width=width;
}
NormalPainter.prototype.Paint=function(top,left,value){ // -3=mark bomb, -4=mark question, -1=bomb, -2=closed
	if(value>=-1){
		$("#cell_"+top+"_"+left).removeClass();
		$("#cell_"+top+"_"+left).addClass("cellopened");
		if($("#cell_"+top+"_"+left).find(".blocker").width()==0){
			$("#cell_"+top+"_"+left).find(".blocker").stop(true,false).css("display","none");
		}
		else{
			$("#cell_"+top+"_"+left).find(".blocker").stop(true,false).animate({width:0,height:0,left:this.SquareSize/2,top:this.SquareSize/2},200,"swing",function(){$(this).css("display","none");});
		}
		if(value>=0){
			$("#cell_"+top+"_"+left).addClass("cell"+value);
			$("#cell_"+top+"_"+left).find(".number").html(value);
		}
		else{
			//sth
		}
		if(value==0){
			for(var i=top-1;i<=top+1;++i){
				for(var j=left-1;j<=left+1;++j){
					if(i>=0&&j>=0&&i<this.Height&&j<this.Width&&$("#cell_"+i+"_"+j).hasClass("cellclosed")){
						setTimeout((function(i,j,painter){
							return function(){
								if($("#cell_"+i+"_"+j).hasClass("cellclosed")){
									painter.CellClicked(i,j);
								}
							}
						})(i,j,this),100);
					}
				}
			}
		}
	}
	else{
		if(value==-2){
			$("#cell_"+top+"_"+left).find(".blocker").html("");
		}
		else if(value==-3){
			$("#cell_"+top+"_"+left).find(".blocker").html('<img src="flag.png" style="width:'+this.SquareSize/2+'px;height:'+this.SquareSize/2+'px;padding:'+this.SquareSize/4+'px;" />');
		}
		else if(value==-4){
			$("#cell_"+top+"_"+left).find(".blocker").html('<span style="color:#FFF">?</span>');
		}
	}
}
NormalPainter.prototype.Select=function(top,left){
	if($("#cell_"+top+"_"+left).find(".blocker").width()>0){
		$("#cell_"+top+"_"+left).find(".blocker").stop(true,false).animate({width:this.SquareSize*2/3,height:this.SquareSize*2/3,left:this.SquareSize/6,top:this.SquareSize/6},100);
	}
}
NormalPainter.prototype.Deselect=function(top,left){
	if($("#cell_"+top+"_"+left).find(".blocker").width()>0&&$("#cell_"+top+"_"+left).find(".blocker").width()<this.SquareSize){
		$("#cell_"+top+"_"+left).find(".blocker").stop(true,false).animate({width:this.SquareSize,height:this.SquareSize,left:0,top:0},100);
	}
}
NormalPainter.prototype.CellClicked=null;