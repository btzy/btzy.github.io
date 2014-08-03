function BoardManager(){
	
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
		content+='</pattern></defs>';
		// for debugging:
		content+='<rect fill="url(#originalboard)" x="0" y="0" width="'+size.X+'" height="'+size.Y+'" transform="scale(50)" />';
		SvgElement.innerHTML+=content;
	}
}