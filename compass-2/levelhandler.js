function LevelHandler(){
	this.OnStartLevel=null; //codestring,index
	this._LevelData=[]; // index->{Code,Title,Count,Storage}
	// put in default level data here
	var that=this;
	var currleveluid=0;
	var currlevelindex=0;
	var loadleveluid=0;
	var LoadLevel=function(levelcodestring,onsuccess){
		var checker=new CheckerHandler("loader"+(loadleveluid++),levelcodestring,function(){
			checker.GetData(function(data){
				if(!(data.UniqueId in that._LevelData)||confirm("Level with the same ID is already loaded. Overwrite?")){
					var storagestring=localStorage.getItem("l_"+data.UniqueId);
					if(storagestring===null){
						storagestring=new Array(data.Count+1).join("0");
					}
					else if(storagestring.length<data.Count){
						storagestring+=new Array(data.Count-storagestring.length+1).join("0");
					}
					that._LevelData[data.UniqueId]={Code:levelcodestring,Title:data.Title,Count:data.Count,Storage:storagestring};
					checker.Destroy();
					checker=null;
					onsuccess();
				}
			});
		});
	}
	$(document).keydown(function(e) {
        if($("#levelsalert").css("display")=="block"&&e.keyCode==27){
			$("#levelsalert").css("display","none");
		}
    });
	var filefunction=function(e){
        $("#fileinputfakebutton").html("Loading...");
		for(var i=0;i<e.target.files.length;++i){
			var currfile=e.target.files[i];
			if(currfile){
				var reader=new FileReader();
				reader.onload=function(e){
					var data=e.target.result;
					LoadLevel(data,RepaintLevelSelector); // verify that id is different before adding!
				};
				reader.readAsText(currfile);
			}
			else{
				alert("Failed to load file "+(i+1)+" of "+e.target.files.length+"!");
			}
		}
		$("#fileinput").replaceWith($("#fileinput").clone());
		$("#fileinputfakebutton").html("Select file");
		document.getElementById("fileinput").addEventListener("change",filefunction,false);
    }
	document.getElementById("fileinput").addEventListener("change",filefunction,false);
	
	$("#urlloadbutton").click(function(e) {
        $(this).html("Downloading...");
		$.post("link.php",{"link":$("#urlinput").val().trim().replace(" ","%20")},function(reply){
			if(reply!="-"){
				LoadLevel(reply,RepaintLevelSelector);
				$("#urlinput").val("");
			}
			else{
				alert("Error downloading file.");
			}
		}).fail(function(){
			alert("An internet connection cannot be established. Please check your internet connection and try again.");
		}).always(function(){
			$("#urlloadbutton").html("Download");
		});
    });
	$("#urlinput").keydown(function(e) {
        if(e.keyCode==13){
			$("#urlloadbutton").click();
		}
    });
	
	var RepaintLevelSelector=function(){
		$("#loadablelevelsbox").html("");
		for(var i in that._LevelData){
			var levelelement=$('<div class="levelbox"><div class="leveltitle">'+that._LevelData[i].Title+'</div><table class="leveltable"></table></div>'); // change the title! OK
        	var table=levelelement.find(".leveltable");
			var len=that._LevelData[i].Count; // change this! OK
			var id=i;
			for(var j=0;j<len;j+=16){
				var tr=$('<tr></tr>');
				for(var k=0;k<16;++k){
					if(j+k<len){
						var storagestate=that._LevelData[i].Storage.charAt(j+k);
						if(storagestate=="0"){
							tr.append('<td><div class="levelnumber numberincomplete" id="l_'+id+'_'+(j+k)+'">'+(j+k)+'</div></td>');
						}
						else if(storagestate=="1"){
							tr.append('<td><div class="levelnumber numbercomplete" id="l_'+id+'_'+(j+k)+'">'+(j+k)+'</div></td>');
						}
					}
					else{
						tr.append('<td></td>');
					}
				}
				table.append(tr);
			}
			$("#loadablelevelsbox").append(levelelement);
		}
		$(".levelnumber").click(function(e) {
			var parts=$(this).attr("id").split("_");
			$("#levelsalert").css("display","none");
			currleveluid=parseInt(parts[1]);
			currlevelindex=parseInt(parts[2]);
			that.OnStartLevel(that._LevelData[currleveluid].Code,currlevelindex,that._LevelData[currleveluid].Count);
		});
	}
	this.OpenLevelSelector=function(){
		if(!window.localStorage){
			alert("Local storage is not supported, so you won't be able to save your progress. Get a new browser.");
		}
		$("#levelsalert").css("display","block");
		RepaintLevelSelector();
	}
	this.StartNextLevel=function(){
		if(currlevelindex+1<that._LevelData[currleveluid].Count){
			++currlevelindex;
			that.OnStartLevel(that._LevelData[currleveluid].Code,currlevelindex,that._LevelData[currleveluid].Count);
		}
	}
	this.Win=function(){
		that._LevelData[currleveluid].Storage=that._LevelData[currleveluid].Storage.substr(0,currlevelindex)+"1"+that._LevelData[currleveluid].Storage.substr(currlevelindex+1);
		localStorage.setItem("l_"+currleveluid,that._LevelData[currleveluid].Storage);
	}
}