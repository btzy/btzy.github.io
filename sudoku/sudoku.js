$(document).ready(function(e) {
    var BuildEditGrid=function(id){
		$("#"+id).addClass("sudokutable");
		var htmlstring="";
		for(var i=0;i<9;++i){
			htmlstring+="<tr>";
			for(var j=0;j<9;++j){
				htmlstring+='<td><input id="textbox'+i+j+'" type="text" /></td>';
			}
			htmlstring+="</tr>";
		}
		$("#"+id).html(htmlstring);
	}
	var grid=new Array(9);
	var ResetSolutionSpace=function(){
		$("#solutionsdiv").html("");
		$("#numsolutiondiv").html("");
	}
	var AddSolution=function(){
		var htmlstring='<table class="sudokutable">';
		for(var i=0;i<9;++i){
			htmlstring+="<tr>";
			for(var j=0;j<9;++j){
				htmlstring+="<td>"+grid[i][j]+"</td>";
			}
			htmlstring+="</tr>";
		}
		htmlstring+="</table>";
		$("#solutionsdiv").append(htmlstring);
	}
	var UpdateNum=function(num){
		$("#numsolutiondiv").html("Found "+num+" solution"+((num==1)?"":"s")+" in total.");
	}
	var getcubeindex=function(x,y){
		return Math.floor(x/3)*3+Math.floor(y/3);
	}
	var horexist;
	var vertexist;
	var cubeexist;
	var Walk=function(x,y,numsolutions){
		var sln=numsolutions;
		if(x>=9){
			AddSolution();
			return 1;
		}
		if(y>=9){
			return Walk(x+1,0,numsolutions);
		}
		if(grid[x][y]!=0){
			return Walk(x,y+1,numsolutions);
		}
		for(var v=1;v<=9;++v){
			if(!horexist[x][v]&&!vertexist[y][v]&&!cubeexist[getcubeindex(x,y)][v]){
				grid[x][y]=v;
				horexist[x][v]=true;
				vertexist[y][v]=true;
				cubeexist[getcubeindex(x,y)][v]=true;
				numsolutions-=Walk(x,y+1,numsolutions);
				grid[x][y]=0;
				horexist[x][v]=false;
				vertexist[y][v]=false;
				cubeexist[getcubeindex(x,y)][v]=false;
			}
			if(numsolutions<=0)break;
		}
		return sln-numsolutions;
	}
	var SolveSudoku=function(numsolutions){
		ResetSolutionSpace();
		horexist=new Array(9);
		vertexist=new Array(9);
		cubeexist=new Array(9);
		for(var i=0;i<9;++i){
			horexist[i]=new Array(10);
			vertexist[i]=new Array(10);
			cubeexist[i]=new Array(10);
			for(var j=1;j<=9;++j){
				horexist[i][j]=false;
				vertexist[i][j]=false;
				cubeexist[i][j]=false;
			}
		}
		for(var i=0;i<9;++i){
			for(var j=0;j<9;++j){
				if(grid[i][j]!=0){
					horexist[i][grid[i][j]]=true;
					vertexist[j][grid[i][j]]=true;
					cubeexist[getcubeindex(i,j)][grid[i][j]]=true;
				}
			}
		}
		var sln=Walk(0,0,numsolutions);
		UpdateNum(sln);
	}
	for(var i=0;i<9;++i){
		grid[i]=new Array(9);
		for(var j=0;j<9;++j){
			grid[i][j]=0;
		}
	}
	BuildEditGrid("edittable");
	$("#edittable input:text").on("input propertychange",function(){
		var x=parseInt($(this).attr("id").substr(7,1));
		var y=parseInt($(this).attr("id").substr(8,1));
		var tmpstr=$(this).val();
		var tmpnum=parseInt(tmpstr);
		if(tmpstr=="")tmpnum=0;
		if((tmpnum==0&&tmpstr=="")||(tmpstr==tmpnum&&tmpnum>=1&&tmpnum<=9)){
			grid[x][y]=tmpnum;
			if(tmpnum!=0){
				if(y>=8&&x<8){
					$("#textbox"+(x+1)+0).focus();
				}
				else if(y<8){
					$("#textbox"+x+(y+1)).focus();
				}
			}
		}
		else{
			$(this).val((grid[x][y]==0)?"":grid[x][y]);
		}
	});
	$("#edittable input:text").keydown(function(e) {
        var x=parseInt($(this).attr("id").substr(7,1));
		var y=parseInt($(this).attr("id").substr(8,1));
		switch(e.which){
			case 37: //left
			if(y>0){
				$("#textbox"+x+(y-1)).focus();
			}
			e.preventDefault();
			break;
			case 38: //up
			if(x>0){
				$("#textbox"+(x-1)+y).focus();
			}
			e.preventDefault();
			break;
			case 39: //right
			if(y<8){
				$("#textbox"+x+(y+1)).focus();
			}
			e.preventDefault();
			break;
			case 40: //down
			if(x<8){
				$("#textbox"+(x+1)+y).focus();
			}
			e.preventDefault();
			break;
		}
    });
	$("#onesolution").click(function(e) {
        SolveSudoku(1);
    });
	$("#allsolution").click(function(e) {
        SolveSudoku(1000000);
    });
});