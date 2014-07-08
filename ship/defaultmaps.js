// JavaScript Document
var MapList=[];
var LoadMap=function(urlstring,width,height){
	var jqelem=$("#mapchoosingarea");
	var children=jqelem.children(".w"+width+"h"+height).length;
	if(children<=0){
		jqelem.append('<div class="w'+width+'h'+height+'"><div class="titlebutton sizelabel">'+width+'&times;'+height+'</div><div class="mappreviewbox"></div></div>');
	}
	var jqpreviewbox=jqelem.children(".w"+width+"h"+height).children(".mappreviewbox").filter(":first");
	var mapindex=MapList.length;
	MapList[length]=null;
	jqpreviewbox.append('<div class="svgpreviewwrapper" id="mapindex'+mapindex+'"><svg></svg></div>');
	var svg=jqpreviewbox.children("#mapindex"+mapindex).get(0).firstChild;
	var DownloadMap=function(){
		$.ajax(urlstring,{dataType:"text").done(function(reply){
			var div=document.createElement("div");
			div.innerHTML=reply;
			MapRenderer.RenderStaticMap(div.firstChild,svg);
		}).fail(function(){
			setTimeout(DownloadMap,1000);
		});
	}
	DownloadMap();
}
var LoadDefaultMaps=function(){
	LoadMap("test.html",1366,768);
}