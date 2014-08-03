$(document).ready(function(e) {
    var board_manager=new BoardManager();
	var snake_manager=new SnakeManager();
	snake_manager.OnInitialiseBoard=board_manager.InitialiseBoard;
	board_manager.Start(document.getElementById("mainsvg"));
	snake_manager.Start({Grid:["01110","11011","11111"],Snake:[new Point(1,1),new Point(1,2)]});
	//snake_manager.Start(new Point(5,3),[[0,1,1,1,0],[1,1,0,1,1],[1,1,1,1,1]]);
});