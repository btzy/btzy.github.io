$(document).ready(function(e) {
    //MinesweeperPainter();
	//MinesweeperMechanics();
	//preloader
	var img_flag=new Image(48,48);
	img_flag.src="flag.png";
	//real code
	var windowheight=0,windowwidth=0;
	var height=9,width=9,mines=10;
	(function(){
		windowheight=$(window).height();
		windowwidth=$(window).width();
		$("#bodywrapper").css({"height":windowheight+"px","width":windowwidth+"px"});
		$("#content").css({"height":windowheight+"px","width":windowwidth*2+"px"});
		$("#mainframe").css({"height":windowheight+"px","width":windowwidth+"px","left":0+"px"});
		$("#mineframe").css({"height":windowheight+"px","width":windowwidth+"px","left":windowwidth+"px"});
	})();
	var DisplayTypeInputs=function(){
		$("#typeheight").val((height>0)?height:"");
		$("#typewidth").val((width>0)?width:"");
		$("#typemines").val((mines>0)?mines:"");
	}
	var TypeInputClickHandler=function(selector,h,w,m){
		var args=arguments.length;
		return function(e) {
			$(".typebutton").each(function(index, element) {
				$(element).css({"border-color":$(element).css("background-color")});
			});
			$(selector).css({"border-color":"#600"});
			if(args>1){
				height=h;
				width=w;
				mines=m;
				DisplayTypeInputs();
			}
		};
	}
	$("#easy").click(TypeInputClickHandler("#easy",9,9,10));
	$("#medium").click(TypeInputClickHandler("#medium",16,16,40));
	$("#hard").click(TypeInputClickHandler("#hard",16,30,99));
	$("#custom").click(TypeInputClickHandler("#custom"));
	$("#typeheight").on("input propertychange",function(){
		var tmpstr=$(this).val();
		if(tmpstr=="")tmpstr="0";
		var tmpnum=parseInt(tmpstr);
		if(tmpnum==tmpstr&&tmpnum<1000&&tmpnum>=0){
			height=tmpnum;
		}
		else{
			$(this).val((height>0)?height:"");
		}
	});
	$("#typewidth").on("input propertychange",function(){
		var tmpstr=$(this).val();
		if(tmpstr=="")tmpstr="0";
		var tmpnum=parseInt(tmpstr);
		if(tmpnum==tmpstr&&tmpnum<1000&&tmpnum>=0){
			width=tmpnum;
		}
		else{
			$(this).val((width>0)?width:"");
		}
	});
	$("#typemines").on("input propertychange",function(){
		var tmpstr=$(this).val();
		if(tmpstr=="")tmpstr="0";
		var tmpnum=parseInt(tmpstr);
		if(tmpnum==tmpstr&&tmpnum<1000000&&tmpnum>=0){
			mines=tmpnum;
		}
		else{
			$(this).val((mines>0)?mines:"");
		}
	});
	$("#start").click(function(e) {
		if(mines>=height*width){
			alert("Too many mines!\nnumber of mines \u2265 width \u00d7 height");
			return;
		}
		$("#content").stop(true,false).animate({left:-windowwidth},1000);
		SetupGame();
    });
	var startstep=0,startmode=0;
	$("#start").mouseover(function(e) {
        $("#startqueuer").stop(true,false).animate({"left":150},{easing:"linear",duration:(150-parseInt($("#startqueuer").css("left"),10))*4,step:function(now,fx){
			$("#start").css("background","linear-gradient(to left,#F00 "+(now-50)+"%,#00F "+(now)+"%)");
		},always:function(){
			startmode=startstep;
		}});
    });
	$("#start").mouseleave(function(e) {
        $("#startqueuer").stop(true,false).animate({"left":0},{easing:"linear",duration:parseInt($("#startqueuer").css("left"),10)*4,step:function(now,fx){
			$("#start").css("background","linear-gradient(to left,#F00 "+(now-50)+"%,#00F "+(now)+"%)");
		},always:function(){
			startmode=startstep;
		}});
    });
	var minesweeper;
	var minepainter;
	var SetupGame=function(){
		minesweeper=new MinesweeperGame(height,width,mines);
		minepainter=new NormalPainter(CellClickedCallback);
		minepainter.ResetGrid(height,width,windowheight,windowwidth);
	}
	var CellClickedCallback=function(top,left){
		minepainter.Paint(top,left,minesweeper.Step(top,left));
	}
});