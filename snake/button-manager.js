// JavaScript Document
function InputManager(){
	// Events:
	this.OnStep=null;
	var that=this;
	
	// Private Variables:
	var Queue=null;
	var timer=null;
	var tick_time=500;
	
	// Private Methods:
	var Step=function(){
		if(Queue.length>0){
			that.OnStep(Queue.shift());
		}
		else{
			that.OnStep(38);
		}
	}
	var TryStartGame=function(){
		if(timer!==null)return;
		timer=setInterval(Step,tick_time);
		Step();
	}
	
	// Public Methods:
	this.Start=function(use_touch){
		Queue=[]; // first element is the next step
		if(use_touch){
			// TODO: touch support
		}
		else{
			$(document.body).keydown(function(e){
                if(e.which==37){ // left
					Queue.push(37);
					$("#sidegroundedbox").prepend('<div class="arrow arrow-left"></div>');
					TryStartGame();
				}
				else if(e.which==39){ // right
					Queue.push(39);
					$("#sidegroundedbox").prepend('<div class="arrow arrow-right"></div>');
					TryStartGame();
				}
				else if(e.which==38||e.which==32){ // up or space
					TryStartGame();
				}
            });
		}
	}
	this.ReportUsability=function(is_used,key){
		if(key==37||key==39){
			if(is_used){
				$("#sidegroundedbox > div:not(.removing)").last().addClass("removing").css({"background-color":"#9F9","color":"#060"}).animate({opacity:0},200,"linear",function(){
					$(this).slideUp(100,"swing",function(){
						$(this).remove();
					});
				});
			}
			else{
				$("#sidegroundedbox > div:not(.removing)").last().addClass("removing").css({"background-color":"#F99","color":"#600"}).animate({opacity:0},200,"linear",function(){
					$(this).slideUp(100,"swing",function(){
						$(this).remove();
					});
				});
				Step();
			}
		}
	}
	this.GameOver=function(message){
		clearInterval(timer);
		timer=null;
		// TODO: Display the message.
	}
}