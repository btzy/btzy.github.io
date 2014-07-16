// JavaScript Document
MapRenderer={};
MapRenderer.Init=function(donecallback){
	if(!MapRenderer.Ready){
		var DownloadPatterns=function(){
			$.ajax("grassland.svg",{dataType:"text"}).done(function(reply){
				var div=document.createElement("div");
				div.innerHTML=reply;
				var dataelements=div.firstChild.childNodes;
				//var dataelements=reply.getElementsByTagNameNS("http://www.w3.org/2000/svg","svg").childNodes;
				var landpattern=document.createElementNS("http://www.w3.org/2000/svg","pattern");
				landpattern.setAttributeNS("http://www.w3.org/2000/svg","id","landpattern");
				landpattern.setAttributeNS("http://www.w3.org/2000/svg","width","100");
				landpattern.setAttributeNS("http://www.w3.org/2000/svg","height","100");
				landpattern.setAttributeNS("http://www.w3.org/2000/svg","patternUnits","userSpaceOnUse");
				for(dataelement in dataelements){
					landpattern.appendChild(dataelements[dataelement].cloneNode(true));
				}
				div=null;
				MapRenderer._LandPattern=landpattern;
				if(MapRenderer._SeaPattern!==null){
					MapRenderer.Ready=true;
					donecallback();
				}
			}).fail(function(){
				setTimeout(DownloadPatterns,1000);
			});
		}
		DownloadPatterns();
	}
}
MapRenderer.Ready=false;
MapRenderer._LandPattern=null;
MapRenderer._SeaPattern=null;
// returns [landdata,portdata];
MapRenderer.RenderStaticMap=function(map,svg){
	while(svg.firstChild){svg.removeChild(svg.firstChild);}
	var defs=document.createElementNS("http://www.w3.org/2000/svg","defs");
	defs.appendChild(MapRenderer._LandPattern.cloneNode(true));
	svg.appendChild(defs);
	var mapclone=map.cloneNode(true);
	var landnodes=mapclone.getElementsByClassName("land");
	for(landelement in landnodes){
		var clonednode=landelement.cloneNode(true);
		mapclone.removeChild(landelement);
		clonednode.setAttributeNS("http://www.w3.org/2000/svg","fill","url(#landpattern)");
		svg.appendChild(clonednode);
	}
	while(mapclone.firstChild){
		svg.appendChild(mapclone.firstChild.cloneNode(true));
		mapclone.removeChild(mapclone.firstChild);
	}
}
/*MapRenderer.StartGame=function(map,svg,fullscreen,pointerlock){
}*/