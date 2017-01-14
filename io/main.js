// browser support required: WebSockets (binary data), ArrayBuffer, requestAnimationFrame, canvas, KeyboardEvent, classList, flexbox
// supported browsers: IE 11, Edge latest, Firefox latest, Chrome latest, Safari latest, Opera latest, iOS Safari latest, Chrome android latest, Firefox android latest, IE Mobile 11
// TODO: need a fallback for globalCompositionOperation='difference', which is not supported in IE11
// TODO: add front page and help


window.addEventListener("load",function(){
    var canvas=document.getElementById("main-canvas");
    var death_callback=function(){
        document.getElementById("welcome-panel").classList.remove("hidden");
        dom_game=new DomGame(canvas,death_callback);
        name_textbox.focus();
    };
    var dom_game=new DomGame(canvas,death_callback);
    var game_is_running=false;
    var name_textbox=document.getElementById("name-textbox");
    var xhr=new XMLHttpRequest();
    xhr.addEventListener("load",function(e){
        var remote_endpoint=xhr.responseText;
        name_textbox.addEventListener("keydown",function(e){
            switch(e.key){
                case "Enter":
                    if(game_is_running)dom_game.stop();
                    dom_game.start(remote_endpoint,name_textbox.value);
                    document.getElementById("welcome-panel").classList.add("hidden");
                    break;
            }
        });
    });
    xhr.open("GET","http://182.19.235.218:8080/welcome");
    xhr.send();
});