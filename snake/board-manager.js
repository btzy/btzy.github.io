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
	var tick_time=500;
	var svg_ns="http://www.w3.org/2000/svg";
	
	// Public Methods:
	this.Start=function(svg){
		//build the svg here:
		SvgElement=svg;
		// Clear the SvgElement:
		while(SvgElement.firstChild){
			SvgElement.removeChild(SvgElement.firstChild);
		}
	}
	this.InitialiseBoard=function(size,grid,snake,portals){ // readonly data!
		// Clear the SvgElement:
		while(SvgElement.firstChild){
			SvgElement.removeChild(SvgElement.firstChild);
		}
		// Create 'defs' element:
		var defs_node=document.createElementNS(svg_ns,"defs");
		// Create 'pattern' element:
		var pattern_node=document.createElementNS(svg_ns,"pattern");
		pattern_node.setAttributeNS(svg_ns,"id","originalboard");
		pattern_node.setAttributeNS(svg_ns,"width","1");
		pattern_node.setAttributeNS(svg_ns,"height","1");
		// Create vertical grid lines:
		for(var i=0;i<=size.X;++i){
			var line_node=document.createElementNS(svg_ns,"line");
			line_node.setAttributeNS(svg_ns,"x1",i.toString());
			line_node.setAttributeNS(svg_ns,"x2",i.toString());
			line_node.setAttributeNS(svg_ns,"y1","0");
			line_node.setAttributeNS(svg_ns,"y2",size.Y.toString());
			line_node.setAttributeNS(svg_ns,"stroke","lightgrey");
			line_node.setAttributeNS(svg_ns,"stroke-width","0.05");
			pattern_node.appendChild(line_node);
		}
		// Create horizontal grid lines:
		for(var i=0;i<=size.Y;++i){
			var line_node=document.createElementNS(svg_ns,"line");
			line_node.setAttributeNS(svg_ns,"y1",i.toString());
			line_node.setAttributeNS(svg_ns,"y2",i.toString());
			line_node.setAttributeNS(svg_ns,"x1","0");
			line_node.setAttributeNS(svg_ns,"x2",size.X.toString());
			line_node.setAttributeNS(svg_ns,"stroke","lightgrey");
			line_node.setAttributeNS(svg_ns,"stroke-width","0.05");
			pattern_node.appendChild(line_node);
		}
		// Create wall blocks
		for(var i=0;i<=size.X;++i){
			for(var j=0;j<size.Y;++j){
				if(grid[j][i]==0){
					var rect_node=document.createElementNS(svg_ns,"rect");
					rect_node.setAttributeNS(svg_ns,"x",i.toString());
					rect_node.setAttributeNS(svg_ns,"y",j.toString());
					rect_node.setAttributeNS(svg_ns,"width","1");
					rect_node.setAttributeNS(svg_ns,"height","1");
					rect_node.setAttributeNS(svg_ns,"fill","grey");
					pattern_node.appendChild(rect_node);
				}
			}
		}
		// Create snake segments:
		for(var i=1;i<snake.length;++i){
			var line_node=document.createElementNS(svg_ns,"line");
			line_node.setAttributeNS(svg_ns,"transform","translate("+(snake[i].Point.X+0.5)+" "+(snake[i].Point.Y+0.5)+") rotate("+GetOrthogonalDegreeAngle(snake[i].Point,snake[i-1].Point)+")");
			line_node.setAttributeNS(svg_ns,"id",snake[i].Id.toString());
			line_node.setAttributeNS(svg_ns,"x1","0");
			line_node.setAttributeNS(svg_ns,"y1","0");
			line_node.setAttributeNS(svg_ns,"x2","1");
			line_node.setAttributeNS(svg_ns,"y2","0");
			line_node.setAttributeNS(svg_ns,"stroke","deepskyblue");
			line_node.setAttributeNS(svg_ns,"stroke-width","0.7");
			line_node.setAttributeNS(svg_ns,"stroke-linecap","round");
			pattern_node.appendChild(line_node);
		}
		// Create snake head art:
		var g_node=document.createElementNS(svg_ns,"g");
		g_node.setAttributeNS(svg_ns,"transform","translate("+(snake[snake.length-1].Point.X+0.5)+" "+(snake[snake.length-1].Point.Y+0.5)+") rotate("+GetOrthogonalDegreeAngle(snake[snake.length-2].Point,snake[snake.length-1].Point)+")");
		g_node.setAttributeNS(svg_ns,"id","snakehead");
		var polyline_node=document.createElementNS(svg_ns,"polyline");
		polyline_node.setAttributeNS(svg_ns,"points","0.6,0.15 0.45,0 0.35,0 0.45,0 0.6,-0.15");
		polyline_node.setAttributeNS(svg_ns,"fill","none");
		polyline_node.setAttributeNS(svg_ns,"stroke","firebrick");
		polyline_node.setAttributeNS(svg_ns,"stroke-width","0.05");
		polyline_node.setAttributeNS(svg_ns,"stroke-linecap","round");
		polyline_node.setAttributeNS(svg_ns,"stroke-linejoin","round");
		g_node.appendChild(polyline_node);
		var circle_node_head=document.createElementNS(svg_ns,"circle");
		circle_node_head.setAttributeNS(svg_ns,"cx","0");
		circle_node_head.setAttributeNS(svg_ns,"cy","0");
		circle_node_head.setAttributeNS(svg_ns,"r","0.35");
		circle_node_head.setAttributeNS(svg_ns,"fill","deepskyblue");
		g_node.appendChild(circle_node_head);
		var circle_node_left=document.createElementNS(svg_ns,"circle");
		circle_node_left.setAttributeNS(svg_ns,"cx","0.1");
		circle_node_left.setAttributeNS(svg_ns,"cy","-0.15");
		circle_node_left.setAttributeNS(svg_ns,"r","0.05");
		circle_node_left.setAttributeNS(svg_ns,"fill","black");
		g_node.appendChild(circle_node_left);
		var circle_node_right=document.createElementNS(svg_ns,"circle");
		circle_node_right.setAttributeNS(svg_ns,"cx","0.1");
		circle_node_right.setAttributeNS(svg_ns,"cy","0.15");
		circle_node_right.setAttributeNS(svg_ns,"r","0.05");
		circle_node_right.setAttributeNS(svg_ns,"fill","black");
		g_node.appendChild(circle_node_right);
		pattern_node.appendChild(g_node);
		defs_node.appendChild(pattern_node);
		SvgElement.appendChild(defs_node);
		
		// print to the svg:
		content+='<g transform="scale('+(1/Math.max(size.X,size.Y))+')"><rect fill="url(#originalboard)" x="'+size.X*(-1.5)+'" y="'+size.Y*(-1.5)+'" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X*(-1.5)+'" y="'+size.Y*(-0.5)+'" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X*(-1.5)+'" y="'+size.Y*(0.5)+'" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X*(-0.5)+'" y="'+size.Y*(-1.5)+'" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X*(-0.5)+'" y="'+size.Y*(-0.5)+'" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X*(-0.5)+'" y="'+size.Y*(0.5)+'" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X*(0.5)+'" y="'+size.Y*(-1.5)+'" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X*(0.5)+'" y="'+size.Y*(-0.5)+'" width="'+size.X+'" height="'+size.Y+'" /><rect fill="url(#originalboard)" x="'+size.X*(0.5)+'" y="'+size.Y*(0.5)+'" width="'+size.X+'" height="'+size.Y+'" /></g>';
		SvgElement.innerHTML+=content;
	}
	this.UpdateBoard=function(new_segment_data,old_segment_id){ // new_segment_data={Id,Point,direction}, old_segment_id=string or null
		// do the "remove" animation:
		if(old_segment_id!==null){
			var old_element=document.getElementById(old_segment_id);
			$({a:0}).animate({a:1},{duration:tick_time,easing:"linear",step:function(val){
				old_element.setAttributeNS(svg_ns,"x2",a.toString());
			},complete:function(){
				old_element.parentNode.removeChild(old_element);
			}});
		}
		// do the "add" animation:
		// TODO
	}
}