function CheckerHandler(sandbox_id,checkercodestring,initcallback){
	$("#"+sandbox_id).remove();
	var frame=null;
	var Post=null;
	var _datacallback=null;
	var _startcallback=null;
	this.OnWin=null;
	var that=this;
	var Listener=function(e){
      // Sandboxed iframes which lack the 'allow-same-origin'
      // header have "null" rather than a valid origin. This means you still
      // have to be careful about accepting data via the messaging API you
      // create. Check that source, and validate those inputs!
        if (e.origin === "null" && e.source === frame.contentWindow){
            var data=JSON.parse(e.data);
			if(!(data instanceof Array)||data.length!=2){
				alert("Error in received data!");
				// stop checker!
			}
			if(data[0]==="load"){
				Post(["init",checkercodestring]);
			}
			else if(data[0]==="init"){
				if(initcallback!==null)initcallback(data[1]);
			}
			else if(data[0]==="data"){
				if(_datacallback!==null)_datacallback(data[1]); //data[1] is an object with Title,UniqueID,Count
			}
			else if(data[0]==="start"){
				if(_startcallback!==null)_startcallback(data[1]);
			}
			else if(data[0]==="check"){
				if(data[1]!==false&&that.OnWin!==null)that.OnWin(data[1][0],data[1][1]); // selected points array, selected curve array. Restart the checker after receiving this event.
			}
			else if(data[0]==="error"){
				alert(data[1]);
			}
		}
    }
	window.addEventListener("message",Listener);
	// create the iframe and load the checker:
	var sandbox=$('<iframe sandbox="allow-scripts" class="sandbox" id="'+sandbox_id+'" src="checker.html"></iframe>');
	$("body").append(sandbox);
	frame=document.getElementById(sandbox_id);
	Post=function(messageobject){
		frame.contentWindow.postMessage(JSON.stringify(messageobject),"*");
	}
	var that=this;
	this.GetData=function(datacallback){
		_datacallback=datacallback;
		Post(["data",{}]);
	}
	var _index;
	this.Start=function(index,startcallback){
		_startcallback=startcallback;
		_index=index;
		Post(["start",[index,$("#mainsvg").parent().width(),$("#mainsvg").parent().height()]]);
	}
	this.CheckPoint=function(point){
		Post(["point",[_index,point]]);
	}
	this.CheckCurve=function(curve){
		Post(["curve",[_index,curve]]);
	}
	this.CheckAll=function(pointarray,curvearray){
		Post(["all",[_index,pointarray,curvearray]]);
	}
	this.Destroy=function(){
		window.removeEventListener("message",Listener);
		$("#"+sandbox_id).remove();
		frame=null;
		Post=null;
	}
}
/*function CheckerHandler(checkercodestring){
	this._Checker=null;
	this._CheckerCodeString=checkercodestring;
	this.OnStarted=null;
	this.OnLevelComplete=null;
	this.OnError=null;
	this._CheckerContinuable=false;
	//this._Checker.postMessage(JSON.stringify(["init",checkercodestring]));
	var that=this;
}
CheckerHandler.prototype.Start=function(index){
	if(this._Checker===null){
		this._Checker=new Worker("checker.js");
		var that=this;
		this._Checker.onmessage=function(e){
			var message=JSON.parse(e.data);
			if(!Array.isArray(message)||message.length!==2){
				if(that.OnError!==null)that.OnError();
			}
			else if(message[0]==="init"){
				that._CheckerContinuable=message[1];
			}
			else if(message[0]==="start"){
				if(that.OnStarted!==null)this.OnStarted(message[1]);
			}
			else if(message[0]==="win"){
				if(!that._CheckerContinuable){
					that._Checker.terminate();
					that._Checker=null;
				}
				if(that.OnLevelComplete!==null)that.OnLevelComplete(message[1]);
			}
			else if(message[0]==="error"){
				if(that.OnError!==null)that.OnError(message[1]);
			}
			else{
				if(that.OnError!==null)that.OnError();
			}
		}
		this._Checker.postMessage(JSON.stringify(["init",this._CheckerCodeString]));
	}
	this._Checker.postMessage(JSON.stringify(["start",index]));
}
CheckerHandler.prototype.NewPoint=function(point){
	this._Checker.postMessage(JSON.stringify(["point",point]));
}
CheckerHandler.prototype.NewCurve=function(curve){
	this._Checker.postMessage(JSON.stringify(["curve",curve]));
}
CheckerHandler.prototype.Check=function(curvearray,pointarray){
	this._Checker.postMessage(JSON.stringify(["check",[curvearray,pointarray]]));
}
CheckerHandler.prototype.Kill=function(){
	this._Checker.terminate();
	this._Checker=null;
}*/