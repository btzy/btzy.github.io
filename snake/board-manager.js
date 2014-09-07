function BoardManager(){
	// Private Variables:
	var SvgElement=null;
	var SvgPatternElement=null;
	var SnakeHeadElement=null;
	var tick_time=500;
	var svg_ns="http://www.w3.org/2000/svg";
	var current_direction=null;
	var Size=null;
	var SvgDisplayTranslateData=null;
	var SvgDisplayNode=null;
	
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
	var SpawnSnakeSegment=function(id,point,direction){
		var g_node=document.createElementNS(svg_ns,"g");
		g_node.setAttribute("id",id);
		var new_element=document.createElementNS(svg_ns,"line");
		new_element.setAttribute("transform","translate("+(point.X+0.5)+" "+(point.Y+0.5)+") rotate("+direction+")");
		new_element.setAttribute("x1","1");
		new_element.setAttribute("y1","0");
		new_element.setAttribute("x2","1");
		new_element.setAttribute("y2","0");
		new_element.setAttribute("stroke","deepskyblue");
		new_element.setAttribute("stroke-width","0.7");
		new_element.setAttribute("stroke-linecap","round");
		g_node.appendChild(new_element);
		if(direction==0&&point.X==Size.X-1){
			var new_element=document.createElementNS(svg_ns,"line");
			new_element.setAttribute("transform","translate("+(-0.5)+" "+(point.Y+0.5)+") rotate("+direction+")");
			new_element.setAttribute("x1","1");
			new_element.setAttribute("y1","0");
			new_element.setAttribute("x2","1");
			new_element.setAttribute("y2","0");
			new_element.setAttribute("stroke","deepskyblue");
			new_element.setAttribute("stroke-width","0.7");
			new_element.setAttribute("stroke-linecap","round");
			g_node.appendChild(new_element);
		}
		else if(direction==90&&point.Y==Size.Y-1){
			var new_element=document.createElementNS(svg_ns,"line");
			new_element.setAttribute("transform","translate("+(point.X+0.5)+" "+(-0.5)+") rotate("+direction+")");
			new_element.setAttribute("x1","1");
			new_element.setAttribute("y1","0");
			new_element.setAttribute("x2","1");
			new_element.setAttribute("y2","0");
			new_element.setAttribute("stroke","deepskyblue");
			new_element.setAttribute("stroke-width","0.7");
			new_element.setAttribute("stroke-linecap","round");
			g_node.appendChild(new_element);
		}
		else if(direction==180&&point.X==0){
			var new_element=document.createElementNS(svg_ns,"line");
			new_element.setAttribute("transform","translate("+(Size.X+0.5)+" "+(point.Y+0.5)+") rotate("+direction+")");
			new_element.setAttribute("x1","1");
			new_element.setAttribute("y1","0");
			new_element.setAttribute("x2","1");
			new_element.setAttribute("y2","0");
			new_element.setAttribute("stroke","deepskyblue");
			new_element.setAttribute("stroke-width","0.7");
			new_element.setAttribute("stroke-linecap","round");
			g_node.appendChild(new_element);
		}
		else if(direction==270&&point.Y==0){
			var new_element=document.createElementNS(svg_ns,"line");
			new_element.setAttribute("transform","translate("+(point.X+0.5)+" "+(Size.Y+0.5)+") rotate("+direction+")");
			new_element.setAttribute("x1","1");
			new_element.setAttribute("y1","0");
			new_element.setAttribute("x2","1");
			new_element.setAttribute("y2","0");
			new_element.setAttribute("stroke","deepskyblue");
			new_element.setAttribute("stroke-width","0.7");
			new_element.setAttribute("stroke-linecap","round");
			g_node.appendChild(new_element);
		}
		return g_node;
	}
	
	// Public Methods:
	this.Start=function(svg){
		//build the svg here:
		SvgElement=svg;
		// Clear the SvgElement:
		while(SvgElement.firstChild){
			SvgElement.removeChild(SvgElement.firstChild);
		}
	}
	this.InitialiseBoard=function(size,grid,snake,portals,apple){ // readonly data!
		Size=new Point(size.X,size.Y);
		// Clear the SvgElement:
		while(SvgElement.firstChild){
			SvgElement.removeChild(SvgElement.firstChild);
		}
		// Create 'defs' element:
		var defs_node=document.createElementNS(svg_ns,"defs");
		// Create 'snakehead' pattern:
		var snakehead_node=document.createElementNS(svg_ns,"pattern");
		snakehead_node.setAttribute("id","snakehead-pattern");
		snakehead_node.setAttribute("width","1");
		snakehead_node.setAttribute("height","1");
		
		var snakehead_g_node=document.createElementNS(svg_ns,"g");
		snakehead_g_node.setAttribute("transform","translate(0.5 0.5)");
		var polyline_node=document.createElementNS(svg_ns,"polyline");
		polyline_node.setAttribute("points","0.6,0.15 0.45,0 0.35,0 0.45,0 0.6,-0.15");
		polyline_node.setAttribute("fill","none");
		polyline_node.setAttribute("stroke","firebrick");
		polyline_node.setAttribute("stroke-width","0.05");
		polyline_node.setAttribute("stroke-linecap","round");
		polyline_node.setAttribute("stroke-linejoin","round");
		snakehead_g_node.appendChild(polyline_node);
		var circle_node_head=document.createElementNS(svg_ns,"circle");
		circle_node_head.setAttribute("cx","0");
		circle_node_head.setAttribute("cy","0");
		circle_node_head.setAttribute("r","0.35");
		circle_node_head.setAttribute("fill","deepskyblue");
		snakehead_g_node.appendChild(circle_node_head);
		var circle_node_left=document.createElementNS(svg_ns,"circle");
		circle_node_left.setAttribute("cx","0.1");
		circle_node_left.setAttribute("cy","-0.15");
		circle_node_left.setAttribute("r","0.05");
		circle_node_left.setAttribute("fill","black");
		snakehead_g_node.appendChild(circle_node_left);
		var circle_node_right=document.createElementNS(svg_ns,"circle");
		circle_node_right.setAttribute("cx","0.1");
		circle_node_right.setAttribute("cy","0.15");
		circle_node_right.setAttribute("r","0.05");
		circle_node_right.setAttribute("fill","black");
		snakehead_g_node.appendChild(circle_node_right);
		snakehead_node.appendChild(snakehead_g_node);
		defs_node.appendChild(snakehead_node);
		
		// Create 'pattern' element:
		var pattern_node=document.createElementNS(svg_ns,"pattern");
		SvgPatternElement=pattern_node;
		pattern_node.setAttribute("id","originalboard");
		pattern_node.setAttribute("width","1");
		pattern_node.setAttribute("height","1");
		// Create vertical grid lines:
		for(var i=0;i<=size.X;++i){
			var line_node=document.createElementNS(svg_ns,"line");
			line_node.setAttribute("x1",i.toString());
			line_node.setAttribute("x2",i.toString());
			line_node.setAttribute("y1","0");
			line_node.setAttribute("y2",size.Y.toString());
			line_node.setAttribute("stroke","lightgrey");
			line_node.setAttribute("stroke-width","0.05");
			pattern_node.appendChild(line_node);
		}
		// Create horizontal grid lines:
		for(var i=0;i<=size.Y;++i){
			var line_node=document.createElementNS(svg_ns,"line");
			line_node.setAttribute("y1",i.toString());
			line_node.setAttribute("y2",i.toString());
			line_node.setAttribute("x1","0");
			line_node.setAttribute("x2",size.X.toString());
			line_node.setAttribute("stroke","lightgrey");
			line_node.setAttribute("stroke-width","0.05");
			pattern_node.appendChild(line_node);
		}
		// Create wall blocks
		for(var i=0;i<=size.X;++i){
			for(var j=0;j<size.Y;++j){
				if(grid[j][i]==0){
					var rect_node=document.createElementNS(svg_ns,"rect");
					rect_node.setAttribute("x",i.toString());
					rect_node.setAttribute("y",j.toString());
					rect_node.setAttribute("width","1");
					rect_node.setAttribute("height","1");
					rect_node.setAttribute("fill","grey");
					pattern_node.appendChild(rect_node);
				}
			}
		}
		// Create apples:
		var g_node_apple=document.createElementNS(svg_ns,"g");
		// Create snake segments:
		for(var i=1;i<snake.length;++i){
			var g_node=SpawnSnakeSegment(snake[i].Id,snake[i].Point,GetOrthogonalDegreeAngle(snake[i].Point,snake[i-1].Point));
			for(var j=0;j<g_node.childNodes.length;++j){
				g_node.childNodes[j].setAttribute("x1",(0).toString());
			}
			pattern_node.appendChild(g_node);
			/*var line_node=document.createElementNS(svg_ns,"line");
			line_node.setAttribute("transform","translate("+(snake[i].Point.X+0.5)+" "+(snake[i].Point.Y+0.5)+") rotate("+GetOrthogonalDegreeAngle(snake[i].Point,snake[i-1].Point)+")");
			line_node.setAttribute("id",snake[i].Id);
			line_node.setAttribute("x1","0");
			line_node.setAttribute("y1","0");
			line_node.setAttribute("x2","1");
			line_node.setAttribute("y2","0");
			line_node.setAttribute("stroke","deepskyblue");
			line_node.setAttribute("stroke-width","0.7");
			line_node.setAttribute("stroke-linecap","round");
			pattern_node.appendChild(line_node);*/
		}
		// Create snake head art:
		/*var g_node=document.createElementNS(svg_ns,"g");
		current_direction=GetOrthogonalDegreeAngle(snake[snake.length-2].Point,snake[snake.length-1].Point);
		g_node.setAttribute("transform","translate("+(snake[snake.length-1].Point.X+0.5)+" "+(snake[snake.length-1].Point.Y+0.5)+") rotate("+current_direction+")");
		g_node.setAttribute("id","snakehead");
		var polyline_node=document.createElementNS(svg_ns,"polyline");
		polyline_node.setAttribute("points","0.6,0.15 0.45,0 0.35,0 0.45,0 0.6,-0.15");
		polyline_node.setAttribute("fill","none");
		polyline_node.setAttribute("stroke","firebrick");
		polyline_node.setAttribute("stroke-width","0.05");
		polyline_node.setAttribute("stroke-linecap","round");
		polyline_node.setAttribute("stroke-linejoin","round");
		g_node.appendChild(polyline_node);
		var circle_node_head=document.createElementNS(svg_ns,"circle");
		circle_node_head.setAttribute("cx","0");
		circle_node_head.setAttribute("cy","0");
		circle_node_head.setAttribute("r","0.35");
		circle_node_head.setAttribute("fill","deepskyblue");
		g_node.appendChild(circle_node_head);
		var circle_node_left=document.createElementNS(svg_ns,"circle");
		circle_node_left.setAttribute("cx","0.1");
		circle_node_left.setAttribute("cy","-0.15");
		circle_node_left.setAttribute("r","0.05");
		circle_node_left.setAttribute("fill","black");
		g_node.appendChild(circle_node_left);
		var circle_node_right=document.createElementNS(svg_ns,"circle");
		circle_node_right.setAttribute("cx","0.1");
		circle_node_right.setAttribute("cy","0.15");
		circle_node_right.setAttribute("r","0.05");
		circle_node_right.setAttribute("fill","black");
		g_node.appendChild(circle_node_right);
		pattern_node.appendChild(g_node);
		SnakeHeadElement=g_node;*/
		var snakehead_group=document.createElementNS(svg_ns,"g");
		snakehead_group.setAttribute("id","snakehead-display");
		current_direction=GetOrthogonalDegreeAngle(snake[snake.length-2].Point,snake[snake.length-1].Point);
		var snakehead_rect=document.createElementNS(svg_ns,"rect");
		snakehead_rect.setAttribute("x","-0.5");
		snakehead_rect.setAttribute("y","-0.5");
		snakehead_rect.setAttribute("width","1.2");
		snakehead_rect.setAttribute("height","1");
		snakehead_rect.setAttribute("fill","url(#snakehead-pattern)");
		snakehead_rect.setAttribute("transform","translate("+(snake[snake.length-1].Point.X+0.5)+" "+(snake[snake.length-1].Point.Y+0.5)+") rotate("+current_direction+")");
		snakehead_group.appendChild(snakehead_rect);
		pattern_node.appendChild(snakehead_group);
		
		defs_node.appendChild(pattern_node);
		SvgElement.appendChild(defs_node);
		
		// print the actual figure to the svg:
		var g_node_transformer=document.createElementNS(svg_ns,"g");
		SvgDisplayTranslateData="scale("+(1/Math.max(size.X,size.Y))+") ";
		SvgDisplayNode=g_node_transformer;
		g_node_transformer.setAttribute("transform",SvgDisplayTranslateData+"translate("+(-snake[snake.length-1].Point.X-0.5)+" "+(-snake[snake.length-1].Point.Y-0.5)+")");
		for(var x=-1;x<2;++x){
			for(var y=-1;y<2;++y){
				var rect_node=document.createElementNS(svg_ns,"rect");
				rect_node.setAttribute("x",(size.X*x).toString());
				rect_node.setAttribute("y",(size.Y*y).toString());
				rect_node.setAttribute("width",size.X.toString());
				rect_node.setAttribute("height",size.Y.toString());
				rect_node.setAttribute("fill","url(#originalboard)");
				g_node_transformer.appendChild(rect_node);
			}
		}
		SvgElement.appendChild(g_node_transformer);
		previous_direction=current_direction;
	}
	this.UpdateBoard=function(new_segment_data,old_segment_id,apple){ // new_segment_data={Id,Point,Direction}, old_segment_id=string or null
		// do the "remove" animation:
		if(old_segment_id!==null){
			var old_element=document.getElementById(old_segment_id);
			$({a:0}).animate({a:1},{duration:tick_time,easing:"linear",step:function(val){
				for(var i=0;i<old_element.childNodes.length;++i){
					old_element.childNodes[i].setAttribute("x2",(1-val).toString());
				}
				//old_element.setAttribute("x2",(1-val).toString());
			},complete:function(){
				old_element.parentNode.removeChild(old_element);
			}});
		}
		// do the "add" animation:
		if(new_segment_data!==null){
			previous_direction=current_direction;
			if(new_segment_data.Direction!==null){
				current_direction=new_segment_data.Direction%4*90;
				// TODO: rotate frame
			}
			/*var g_node=document.createElementNS(svg_ns,"g");
			g_node.setAttribute("id",new_segment_data.Id);
			var new_element=document.createElementNS(svg_ns,"line");
			new_element.setAttribute("transform","translate("+(new_segment_data.Point.X+0.5)+" "+(new_segment_data.Point.Y+0.5)+") rotate("+current_direction+")");
			new_element.setAttribute("x1","1");
			new_element.setAttribute("y1","0");
			new_element.setAttribute("x2","1");
			new_element.setAttribute("y2","0");
			new_element.setAttribute("stroke","deepskyblue");
			new_element.setAttribute("stroke-width","0.7");
			new_element.setAttribute("stroke-linecap","round");
			g_node.appendChild(new_element);
			if(current_direction==0&&new_segment_data.Point.X==size.X-1){
				var new_element=document.createElementNS(svg_ns,"line");
				new_element.setAttribute("transform","translate("+(-0.5)+" "+(new_segment_data.Point.Y+0.5)+") rotate("+current_direction+")");
				new_element.setAttribute("x1","1");
				new_element.setAttribute("y1","0");
				new_element.setAttribute("x2","1");
				new_element.setAttribute("y2","0");
				new_element.setAttribute("stroke","deepskyblue");
				new_element.setAttribute("stroke-width","0.7");
				new_element.setAttribute("stroke-linecap","round");
				g_node.appendChild(new_element);
			}*/
			var g_node=SpawnSnakeSegment(new_segment_data.Id,new_segment_data.Point,(current_direction+180)%360);
			SvgPatternElement.appendChild(g_node);
			
			var snakehead_element=document.getElementById("snakehead-display");
			snakehead_element.parentNode.removeChild(snakehead_element);
			
			snakehead_element=document.createElementNS(svg_ns,"g");
			snakehead_element.setAttribute("id","snakehead-display");
			var global_translate_data=[];
			var snakehead_rect=document.createElementNS(svg_ns,"rect");
			snakehead_rect.setAttribute("x","-0.5");
			snakehead_rect.setAttribute("y","-0.5");
			snakehead_rect.setAttribute("width","1.2");
			snakehead_rect.setAttribute("height","1");
			snakehead_rect.setAttribute("fill","url(#snakehead-pattern)");
			global_translate_data[0]="translate("+(new_segment_data.Point.X+0.5)+" "+(new_segment_data.Point.Y+0.5)+") rotate("+current_direction+") ";
			snakehead_rect.setAttribute("transform",global_translate_data[0]+"translate(-1 0)");
			
			// 2nd snakehead rect:
			var snakehead_second_rect=snakehead_rect.cloneNode(true);
			if(current_direction%180==0){
				if(new_segment_data.Point.X+0.5<Size.X/2){
					global_translate_data[1]="translate("+(new_segment_data.Point.X+0.5+Size.X)+" "+(new_segment_data.Point.Y+0.5)+") rotate("+current_direction+") ";
				}
				else{
					global_translate_data[1]="translate("+(new_segment_data.Point.X+0.5-Size.X)+" "+(new_segment_data.Point.Y+0.5)+") rotate("+current_direction+") ";
				}
			}
			else{
				if(new_segment_data.Point.Y+0.5<Size.Y/2){
					global_translate_data[1]="translate("+(new_segment_data.Point.X+0.5)+" "+(new_segment_data.Point.Y+0.5+Size.Y)+") rotate("+current_direction+") ";
				}
				else{
					global_translate_data[1]="translate("+(new_segment_data.Point.X+0.5)+" "+(new_segment_data.Point.Y+0.5-Size.Y)+") rotate("+current_direction+") ";
				}
			}
			snakehead_second_rect.setAttribute("transform",global_translate_data[1]+"translate(-1 0)");
			
			snakehead_element.appendChild(snakehead_rect);
			snakehead_element.appendChild(snakehead_second_rect);
			SvgPatternElement.appendChild(snakehead_element);
			
			$({a:0}).animate({a:1},{duration:tick_time,easing:"linear",step:function(val){
				for(var i=0;i<g_node.childNodes.length;++i){
					g_node.childNodes[i].setAttribute("x1",(1-val).toString());
				}
				for(var i=0;i<snakehead_element.childNodes.length;++i){
					snakehead_element.childNodes[i].setAttribute("transform",global_translate_data[i]+"translate("+(val-1)+" 0)");
				}
				var rotate=((previous_direction-current_direction+360)%360==90?90:(previous_direction-current_direction+360)%360==270?-90:0)*(val-1);
				SvgDisplayNode.setAttribute("transform",SvgDisplayTranslateData+"rotate("+(270+rotate)+") translate("+(1-val)+" 0) rotate("+(-current_direction)+") translate("+(-new_segment_data.Point.X-0.5)+" "+(-new_segment_data.Point.Y-0.5)+")");
			}});
		}
	}
}