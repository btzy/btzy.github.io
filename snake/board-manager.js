function BoardManager(){
	// Private Functions:
	var GetOrthogonalDegreeAngle=function(from_point,to_point){
		var dx=to_point.X-from_point.X;
		var dy=to_point.Y-from_point.Y;
		if(Math.abs(dx)>Math.abs(dy)){
			return dx>0?0:180;
		}
		else{
			return dy>0?90:270;
		}
	}
	
	// Private Variables:
	var SvgElement=null;
	
	// Public Methods:
	this.Start=function(svg){
		//build the svg here:
		SvgElement=svg;
		SvgElement.innerHTML="";
	}
	this.InitialiseBoard=function(size,grid,snake,portals){ // readonly data!
		SvgElement.innerHTML="";
		var content='<defs><pattern id="originalboard" width="1" height="1">';
		for(var i=0;i<=size.X;++i){
			content+='<line x1="'+i+'" x2="'+i+'" y1="0" y2="'+size.Y+'" stroke="lightgrey" stroke-width="0.05" />';
		}
		for(var i=0;i<=size.Y;++i){
			content+='<line y1="'+i+'" y2="'+i+'" x1="0" x2="'+size.X+'" stroke="lightgrey" stroke-width="0.05" />';
		}
		for(var i=0;i<=size.X;++i){
			for(var j=0;j<size.Y;++j){
				if(grid[j][i]==0){
					content+='<rect x="'+i+'" y="'+j+'" width="1" height="1" fill="grey" />';
				}
			}
		}
		for(var i=1;i<snake.length;++i){
			content+='<line transform="translate('+(snake[i].Point.X+0.5)+' '+(snake[i].Point.Y+0.5)+') rotate('+GetOrthogonalDegreeAngle(snake[i].Point,snake[i-1].Point)+')" id="'+snake[i].Id+'" x1="0" y1="0" x2="1" y2="0" stroke="deepskyblue" stroke-width="0.7" stroke-linecap="round"/>';
		}
		// snake head:
		content+='<g id="snakehead" transform="translate('+(snake[snake.length-1].Point.X+0.5)+' '+(snake[snake.length-1].Point.Y+0.5)+') rotate('+GetOrthogonalDegreeAngle(snake[snake.length-2].Point,snake[snake.length-1].Point)+')"><polyline points="0.6,0.15 0.45,0 0.35,0 0.45,0 0.6,-0.15" fill="none" stroke="firebrick" stroke-width="0.05" stroke-linecap="round" stroke-linejoin="round" /><circle cx="0" cy="0" r="0.35" fill="deepskyblue" /><circle cx="0.1" cy="-0.15" r="0.05" fill="black" /><circle cx="0.1" cy="0.15" r="0.05" fill="black" /></g>';
		content+='</pattern></defs>';
		// for debugging:
		content+='<g transform="scale(50)"><rect fill="url(#originalboard)" x="0" y="0" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X+'" y="'+size.Y+'" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X*2+'" y="'+size.Y*2+'" width="'+size.X+'" height="'+size.Y+'" /></g>';
		SvgElement.innerHTML+=content;
	}
	this.UpdateBoard=function(/*params*/){
		// TODO
	}
}