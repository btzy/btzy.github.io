$(document).ready(function(e){
	var CheckerObject=null;
	var Post=function(messageobject){
		window.parent.postMessage(JSON.stringify(messageobject),"*");
	}
	window.addEventListener("message",function(e){
		var mainWindow=e.source;
		var data=JSON.parse(e.data);
		var Post=function(messageobject){
			mainWindow.postMessage(JSON.stringify(messageobject),e.origin);
		}
		if(!(data instanceof Array)||data.length!=2){
			Post(["error","Wrong array size!"]);
		}
		if(data[0]==="init"){
			try{
				CheckerObject=(new Function("return ("+data[1]+");"))();
				if(!(CheckerObject.Checker instanceof Array)){
					CheckerObject.Checker=[CheckerObject.Checker];
				}
				Post(["init",{}]);
			}
			catch(ex){
				Post(["error","Cannot parse checker at 'init':\n"+ex.message]);
			}
		}
		else if(data[0]==="data"){
			try{
				Post(["data",{Title:CheckerObject.Title,UniqueId:CheckerObject.UniqueId,Count:CheckerObject.Checker.length}]);
			}
			catch(ex){
				Post(["error","Cannot parse checker at 'data':\n"+ex.message]);
			}
		}
		else if(data[0]==="start"){
			try{
				var index=data[1][0];
				DynamicSizer.Init(data[1][1],data[1][2]);
				var startdata=CheckerObject.Checker[index].Start();
				Post(["start",[["CheckPoint" in CheckerObject.Checker[index],"CheckCurve" in CheckerObject.Checker[index],"CheckAll" in CheckerObject.Checker[index]],startdata]]);
			}
			catch(ex){
				Post(["error","Cannot parse checker at 'start':\n"+ex.message]);
			}
		}
		else if(data[0]==="point"){
			try{
				var index=data[1][0];
				Post(["check",CheckerObject.Checker[index].CheckPoint(data[1][1])]);
			}
			catch(ex){
				Post(["error","Cannot parse checker at 'point':\n"+ex.message]);
			}
		}
		else if(data[0]==="curve"){
			try{
				var index=data[1][0];
				Post(["check",CheckerObject.Checker[index].CheckCurve(data[1][1])]);
			}
			catch(ex){
				Post(["error","Cannot parse checker at 'curve':\n"+ex.message]);
			}
		}
		else if(data[0]==="all"){
			try{
				var index=data[1][0];
				Post(["check",CheckerObject.Checker[index].CheckAll(data[1][1],data[1][2])]); // pointarray,curvearray
			}
			catch(ex){
				Post(["error","Cannot parse checker at 'all':\n"+ex.message]);
			}
		}
		else{
			Post(["error","Unknown command '"+data[0]+"'."]);
		}
	});
	Post(["load",{}]);
});