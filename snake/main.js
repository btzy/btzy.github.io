$(document).ready(function(e){
    $("#maindiv").width($(document.body).width());
	$("#maindiv").height($(document.body).height());
	
	// Create the managers:
	var board_manager=new BoardManager();
	var input_manager=new InputManager();
	var snake_manager=new SnakeManager();
	
	// Attach event handlers:
	input_manager.OnStep=snake_manager.Input;
	snake_manager.OnReportUsability=input_manager.ReportUsability;
	snake_manager.OnInitialiseBoard=board_manager.InitialiseBoard;
	
	// Start managers:
	board_manager.Start(document.getElementById("mainsvg"));
	snake_manager.Start({Grid:["01110","11011","11111"],Snake:[new Point(1,2),new Point(1,1)]});
	input_manager.Start(false);
	//snake_manager.Start(new Point(5,3),[[0,1,1,1,0],[1,1,0,1,1],[1,1,1,1,1]]);
});