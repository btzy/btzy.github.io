$(document).ready(function(e){
    /*$("#maindiv").width($(document.body).width());
	$("#maindiv").height($(document.body).height());*/
	
	// Create the managers:
	var board_manager=new BoardManager();
	var input_manager=new InputManager();
	var snake_manager=new SnakeManager();
	
	// Attach event handlers:
	input_manager.OnStep=snake_manager.Input;
	snake_manager.OnReportUsability=input_manager.ReportUsability;
	snake_manager.OnGameOver=input_manager.GameOver;
	snake_manager.OnInitialiseBoard=board_manager.InitialiseBoard;
	snake_manager.OnUpdateBoard=board_manager.UpdateBoard;
	
	// Start managers:
	board_manager.Start(document.getElementById("mainsvg"));
	/*snake_manager.Start({Grid:["01110","11011","11111"],Snake:[new Point(1,2),new Point(1,1)]});*/
	snake_manager.Start({Grid:["01110","11011","11111"],Snake:[new Point(0,2),new Point(1,2),new Point(1,1)]});
	input_manager.Start(false);
	//snake_manager.Start(new Point(5,3),[[0,1,1,1,0],[1,1,0,1,1],[1,1,1,1,1]]);
	
	// adjusting the aspect ratio of the svg:
	var Resize=function(){
		var height=$("#mainwrapper").height();
		var width=$("#mainwrapper").width();
		var left=0;
		var top=0;
		var max_ratio=16/9;
		if(height>width*max_ratio){
			top=(height-width*max_ratio)/2;
			height=width*max_ratio;
		}
		else if(width>height*max_ratio){
			left=(width-height*max_ratio)/2;
			width=height*max_ratio;
		}
		/*$("#svgbox").height(height);
		$("#svgbox").width(width);*/
		$("#svgbox").css({"height":height+"px","width":width+"px","top":top+"px","left":left+"px"});
		alert($("#svgbox").height()+" "+$("#svgbox").width()+" "+$("svg").height()+" "+$("svg").width()+"\n"+$("#svgbox").offset().top+" "+$("#svgbox").offset().left);
	}
	$(window).resize(Resize);
	Resize();
});