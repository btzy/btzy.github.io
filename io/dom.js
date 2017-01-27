// TODO: scale name and leaderboard by sqrt of distance instead.
// options: {showtouchcontrols:bool, touchcontrolsonright:bool}
var DomGame=function(canvas,options,death_callback){
    var canvas_scale=Math.sqrt(canvas.width*canvas.height);
    var resize_handler=function(){
        canvas_device_pixel_scale=window.devicePixelRatio||1;
        logical_width=canvas.offsetWidth;
        logical_height=canvas.offsetHeight;
        canvas.width=logical_width*canvas_device_pixel_scale;
        canvas.height=logical_height*canvas_device_pixel_scale;
        canvas_scale=Math.sqrt(logical_width*logical_height);
        send_dimensions_to_server();
    };
    var mousemove_handler=function(e){
        process_movement_dir_update(new Point(e.clientX,e.clientY));
    };
    var override_actions=false;
    var mousedown_handler=function(e){
        if(!override_actions){
            if(e.button===0)process_firing_update(new Point(e.clientX,e.clientY),true);
            if(e.button===2)process_boosting_update(true);
        }
    };
    var mouseup_handler=function(e){
        if(!override_actions){
            if(e.button===0)process_firing_update(new Point(e.clientX,e.clientY),false);
            if(e.button===2)process_boosting_update(false);
        }
        else{
            if(death_callback){
                death_callback();
                death_callback=undefined;
            }
            setTimeout(function(){
                socket.close();
            },1000);
        }
    };
    var mouseout_handler=function(e){
        if(!override_actions){
            process_firing_update(new Point(e.clientX,e.clientY),false);
            process_boosting_update(false);
        }
    };
    var ongoingMovementDirTouchID,ongoingFiringTouchID,ongoingBoostingTouchID;
    var touchstart_handler=function(e){
        //alert("touchstart");
        //try{
        var movementTouch=Array.prototype.find.call(e.changedTouches,function(touch){
            return true; // TODO: ignore areas for firing and boosting.
        });
        //}
        //catch(e){
        //    alert(e.message);
        //}
        //alert(movementTouch.clientX+" "+movementTouch.clientY);
        if(movementTouch){
            ongoingMovementDirTouchID=movementTouch.identifier;
            process_movement_dir_update(new Point(movementTouch.clientX,movementTouch.clientY));
        }
        //e.preventDefault();
    };
    var touchend_handler=function(e){
        if(ongoingMovementDirTouchID!==undefined){
            var movementTouch=Array.prototype.find.call(e.changedTouches,function(touch){
                return touch.identifier===ongoingMovementDirTouchID;
            });
            if(movementTouch)ongoingMovementDirTouchID=undefined;
        }
        //e.preventDefault();
    };
    var touchcancel_handler=function(e){
        touchend_handler(e); // react as if it is a touchend.
        //e.preventDefault();
    };
    var touchmove_handler=function(e){
        if(ongoingMovementDirTouchID!==undefined){
            var movementTouch=Array.prototype.find.call(e.changedTouches,function(touch){
                return touch.identifier===ongoingMovementDirTouchID;
            });
            if(movementTouch){
                process_movement_dir_update(new Point(movementTouch.clientX,movementTouch.clientY));
            }
        }
        //e.preventDefault();
    };
    var keydown_handler=function(e){
        if(!override_actions){
            switch(e.key){
                case " ":
                case "Spacebar":
                    process_boosting_update(true);
                    break;
            }
        }
    };
    var keyup_handler=function(e){
        if(!override_actions){
            switch(e.key){
                case " ":
                case "Spacebar": // some older browsers return "Spacebar" instead of " ".
                    process_boosting_update(false);
                    break;
            }
        }
    };
    var client_area=new ChangeLimitedDelayEngine(function(prev_area,target_area,time_diff){
        if(prev_area===target_area)return target_area;
        /*var multiplier=1.0000001;
        if(prev_area<target_area){
            curr_area=prev_area*Math.pow(multiplier,time_diff);
            return((curr_area>=target_area)?target_area:curr_area);
        }
        else{
            curr_area=prev_area*Math.pow(multiplier,-time_diff);
            return((curr_area<=target_area)?target_area:curr_area);
        }*/
        if(time_diff<0)console.log("invalid!");
        var multiplier=1.00001;
        if(prev_area<target_area){
            curr_area=Math.pow(Math.sqrt(prev_area)*Math.pow(multiplier,time_diff),2);
            return((curr_area>=target_area)?target_area:curr_area);
        }
        else{
            curr_area=Math.pow(Math.sqrt(prev_area)*Math.pow(multiplier,-time_diff),2);
            return((curr_area<=target_area)?target_area:curr_area);
        }
    },function(area){
        return area;
    });
    var height,width; // in relative coords, such that height*width=1;
    var agents=new InterpolatorMap(function(weightedAverager,cloner){
        return new InterpolationDelayEngine(weightedAverager,cloner);
    },function(agent1,weight1,agent2,weight2){
        if(Math.abs(weight1+weight2)<0.1){
            return new Agent(agent1.location,agent1.mass,agent1.health,agent2.is_boosting,agent2.has_shield);
        }
        var location=Point.weightedAverage(agent1.location,weight1,agent2.location,weight2);
        var mass=(agent1.mass*weight1+agent2.mass*weight2)/(weight1+weight2);
        var health=(agent1.health*weight1+agent2.health*weight2)/(weight1+weight2);
        var is_boosting=agent2.is_boosting;
        var has_shield=agent2.has_shield;
        return new Agent(location,mass,health,is_boosting,has_shield);
    },function(agent){
        return new Agent(agent.location,agent.mass,agent.health,agent.is_boosting,agent.has_shield);
    });

    var agent_properties=new Map(); // contains name and other static details
    var foods=new InterpolatorMap(function(weightedAverager,cloner){
        return new InterpolationDelayEngine(weightedAverager,cloner);
    },function(food1,weight1,food2,weight2){
        if(Math.abs(weight1+weight2)<0.1){
            return new Food(food1.location,food1.is_projectile);
        }
        var location=Point.weightedAverage(food1.location,weight1,food2.location,weight2);
        var is_projectile=food1.is_projectile&&food2.is_projectile;
        return new Food(location,is_projectile);
    },function(food){
        return new Food(food.location,food.is_projectile);
    });
    var current_agent_boost_streams=new Map(); //each element is (updated_time,array of offset,array of point,width) describing the movement at that point.  It is updated upon game tick.  Hopefully it doesnt get too slow.  Deletion is done in the process_message handler.
    var agent_boost_streams=[]; // each element is (updated_time,array of offset,array of point,width). Shares elements with current_agent_boost_streams.  Deletion is done in the drawing handler.
    
    var agent_shields=new Map(); // each element is (fade_start_time(optional=undefined)).  Addition and updating fade_start_time is done in the process_message handler, Deletion is done in the drawing handler.

    var leaderboard=[]; // each element is {display_name,score}


    var centre_loc=new InterpolationDelayEngine(function(loc1,weight1,loc2,weight2){
        if(Math.abs(weight1+weight2)<0.1){
            return new Point(loc1.x,loc1.y);
        }
        return Point.weightedAverage(loc1,weight1,loc2,weight2);
    },function(loc){
        return new Point(loc.x,loc.y);;
    });
    
    var is_alive=false;
    
    var my_agentid=undefined;
    //var current_mouse_pos=new Point(0,0);
    var current_movement_dir=null;
    var current_firing=false;
    var current_boosting=false;
    var message_period=100; // 100 ms per update from server
    var displayTime=undefined; // last rendered time
    var socket;
    var canvas;
    var food_radius=100;
    var boost_animation_period=1000;
    
    var canvas_device_pixel_scale=1;
    var logical_width,logical_height;
    
    var anim_request=undefined;
    
    this._start=function(remote_endpoint,display_name){
        window.addEventListener("resize",resize_handler);
        resize_handler();
        if(!options.touch){
            canvas.addEventListener("mousemove",mousemove_handler);
            canvas.addEventListener("mousedown",mousedown_handler);
            canvas.addEventListener("mouseup",mouseup_handler);
            canvas.addEventListener("mouseout",mouseout_handler);
            window.addEventListener("keydown",keydown_handler);
            window.addEventListener("keyup",keyup_handler);
        }
        else{
            canvas.addEventListener("touchmove",touchmove_handler);
            canvas.addEventListener("touchstart",touchstart_handler);
            canvas.addEventListener("touchend",touchend_handler);
            canvas.addEventListener("touchcancel",touchcancel_handler);
        }
        // disable context menu
        canvas.addEventListener("contextmenu",function(e){
            e.preventDefault();
            return false;
        });
        
        var ctx=canvas.getContext("2d",{alpha:false});
        var draw_handler=function(){
            ctx.save();
            var real_height=logical_height;
            var real_width=logical_width;
            canvas_scale=Math.sqrt(real_height*real_width);
            ctx.scale(canvas_scale*canvas_device_pixel_scale,canvas_scale*canvas_device_pixel_scale);
            height=real_height/canvas_scale;
            width=real_width/canvas_scale;
            draw(ctx);
            ctx.restore();
            anim_request=window.requestAnimationFrame(draw_handler);
        };
        try{
            socket=new WebSocket("ws://"+remote_endpoint);
            socket.binaryType="arraybuffer";
            socket.addEventListener("open",function(){
                spawn_me_on_server(display_name);
                send_dimensions_to_server();
                anim_request=window.requestAnimationFrame(draw_handler);
            });
            socket.addEventListener("error",function(e){
                console.log(e.message);
            });
            socket.addEventListener("message",function(e){
                process_message(e.data);
                // lag test:
                /*setTimeout(function(){
                    process_message(e.data);
                },150+Math.random()*100);*/
            });
            socket.addEventListener("close",function(e){
                console.log("Connection terminated. (Code: "+e.code+", reason: "+e.reason+")");
            });
            ctx.fillStyle="black";
            ctx.fillRect(0,0,width,height);
        }
        catch(e){
            console.log(e.message);
        }
    };
    this._stop=function(){
        if(socket)socket.close();
        socket=undefined;
        window.cancelAnimationFrame(anim_request);
        if(!options.touch){
            window.removeEventListener("keyup",keyup_handler);
            window.removeEventListener("keydown",keydown_handler);
            canvas.removeEventListener("mouseout",mouseout_handler);
            canvas.removeEventListener("mouseup",mouseup_handler);
            canvas.removeEventListener("mousedown",mousedown_handler);
        }
        else{
            canvas.removeEventListener("touchcancel",touchcancel_handler);
            canvas.removeEventListener("touchend",touchend_handler);
            canvas.removeEventListener("touchstart",touchstart_handler);
            canvas.removeEventListener("touchmove",touchmove_handler);
        }
        window.removeEventListener("resize",resize_handler);
    }

    var getFittingText=function(ctx,text,maxWidth){
        var width=ctx.measureText(text).width;
        if(width<=maxWidth)return text;
        var ellipsis="…";
        var best=ellipsis;
        for(var i=1;i<text.length;++i){
            var str=text.substr(0,i)+ellipsis;
            if(ctx.measureText(str).width<=maxWidth){
                best=str;
            }
            else{
                break;
            }
        }
        return best;
    };

    var draw=function(ctx){
        if(!centre_loc.currTime)return; // don't draw anything if no data has been received from server yet.
        //ctx.clearRect(0,0,width,height);
        ctx.fillStyle="black";
        ctx.fillRect(0,0,width,height);
        ctx.save();
        displayTime=new Date().getTime()-message_period;
        var _curr_area=client_area.get(displayTime);
        if(!_curr_area)_curr_area=300000*Math.sqrt(100000); // this is the starting screen area
        var server_size_factor=Math.sqrt(_curr_area);
        var current_centre=centre_loc.get(displayTime);
        if(current_centre)ctx.translate(width/2-current_centre.x/server_size_factor,height/2-current_centre.y/server_size_factor);
        //if(my_agentid)ctx.translate(width/2-agents.get(my_agentid,displayTime).location.x/server_size_factor,height/2-agents.get(my_agentid,displayTime).location.y/server_size_factor);
        //if(my_agentid)console.log(agents.get(my_agentid,displayTime).location.x+" "+agents.get(my_agentid,displayTime).location.y);
        ctx.scale(1/server_size_factor,1/server_size_factor);
        //var current_transform=ctx.currentTransform;
        //var left=-current_transform.e/current_transform.a;
        //var top=-current_transform.f/current_transform.d;
        var left=(current_centre)?(current_centre.x-width/2*server_size_factor):0;
        var top=(current_centre)?(current_centre.y-height/2*server_size_factor):0;
        ctx.lineCap="butt";
        ctx.lineWidth=2*server_size_factor/canvas_scale;
        ctx.strokeStyle="#333";
        for(var x=Math.ceil(left/1000)*1000;x<=left+width*server_size_factor;x+=1000){
            ctx.beginPath();
            ctx.moveTo(x,top);
            ctx.lineTo(x,top+height*server_size_factor);
            ctx.stroke();
        }
        for(var y=Math.ceil(top/1000)*1000;y<=top+height*server_size_factor;y+=1000){
            ctx.beginPath();
            ctx.moveTo(left,y);
            ctx.lineTo(left+width*server_size_factor,y);
            ctx.stroke();
        }
        /*ctx.fillStyle="lightcyan";
        ctx.shadowColor=ctx.fillStyle;
        ctx.shadowBlur=100;
        ctx.shadowOffsetX=0;
        ctx.shadowOffsetY=0;*/
        // boost animations are drawn before foods and agents, so that boost will be below them.

        agent_boost_streams=agent_boost_streams.filter(function(agent_boost_stream){
            // TODO: possible off-by-one errors!
            var endlength=Math.ceil((2000-(displayTime-agent_boost_stream.updated_time))/100);
            if(endlength<=0){
                return false;
            }
            if(endlength<agent_boost_stream.data.length)agent_boost_stream.data=agent_boost_stream.data.slice(0,endlength);
            if(agent_boost_stream.data.length<=1)return true;
            agent_boost_stream.offset.forEach(function(offset){
                var offset_boost_stream=agent_boost_stream.data.map(function(pt,index,arr){
                    var ang_next,ang_prev;
                    if(index>0){
                        ang_prev=pt.angleFrom(arr[index-1]);
                    }
                    if(index<arr.length-1){
                        ang_next=pt.angleTo(arr[index+1]);
                    }
                    var ang_avg;
                    if(index===0){
                        ang_avg=ang_next;
                    }
                    else if(index===arr.length-1){
                        ang_avg=ang_prev;
                    }
                    else{
                        ang_avg=wraparound_average(ang_prev,ang_next,Math.PI*2);
                        // note: ang_avg can be any value from -Math.PI*2 to Math.PI*2 due to the way wraparound_average works.
                    }
                    ang_avg+=Math.PI/2; // rotates by 90 deg
                    return pt.translateByDirection(ang_avg,(1-Math.pow(Math.min((displayTime-agent_boost_stream.updated_time+(index+1)*100)/2000,1),4))*agent_boost_stream.width*Math.sin(offset+(agent_boost_stream.updated_time-index*100)/boost_animation_period*2*Math.PI));
                });
                offset_boost_stream.forEach(function(pt,index,arr){
                    if(displayTime-agent_boost_stream.updated_time+index*100>=0&&index>0&&index<arr.length-1){
                        ctx.lineCap="butt";
                        ctx.lineWidth=20;
                        var ax=(arr[index-1].x+pt.x)/2;
                        var ay=(arr[index-1].y+pt.y)/2;
                        var bx=(arr[index+1].x+pt.x)/2;
                        var by=(arr[index+1].y+pt.y)/2;
                        var linearGradient=ctx.createLinearGradient(ax,ay,bx,by);
                        linearGradient.addColorStop(0,"rgba(255,255,255,"+(0.5-0.5*(displayTime-agent_boost_stream.updated_time+index*100)/2000)+")");
                        linearGradient.addColorStop(1,"rgba(255,255,255,"+Math.max(0.5-0.5*(displayTime-agent_boost_stream.updated_time+(index+1)*100)/2000,0)+")");
                        //ctx.strokeStyle="rgba(255,255,255,"+(1-(displayTime-agent_boost_stream.updated_time+index*100)/2000)+")";
                        ctx.strokeStyle=linearGradient;
                        ctx.beginPath();
                        ctx.moveTo(ax,ay);
                        ctx.quadraticCurveTo(pt.x,pt.y,bx,by);
                        ctx.stroke();
                    }
                });
            });

            /*for(var i=1;i<agent_boost_stream.data.length-1;++i){
                if(displayTime-agent_boost_stream.updated_time+i*100>=0){
                    ctx.lineCap="butt";
                    ctx.lineWidth=30;
                    ctx.strokeStyle="rgba(255,255,255,"+(1-(displayTime-agent_boost_stream.updated_time+i*100)/2000)+")";
                    var ax=(agent_boost_stream.data[i-1].x+agent_boost_stream.data[i].x)/2;
                    var ay=(agent_boost_stream.data[i-1].y+agent_boost_stream.data[i].y)/2;
                    var bx=(agent_boost_stream.data[i+1].x+agent_boost_stream.data[i].x)/2;
                    var by=(agent_boost_stream.data[i+1].y+agent_boost_stream.data[i].y)/2;
                    ctx.beginPath();
                    ctx.moveTo(ax,ay);
                    ctx.quadraticCurveTo(agent_boost_stream.data[i].x,agent_boost_stream.data[i].y,bx,by);
                    ctx.stroke();
                }
            }*/
            return true;
        });

        // foods are drawn before agents, so that agents appear on top.
        foods.forEach(function(food){
            var food_gradient=ctx.createRadialGradient(food.location.x,food.location.y,food_radius*4/8,food.location.x,food.location.y,food_radius*11/8);
            if(!food.is_projectile){
                food_gradient.addColorStop(0,"rgba(255,255,128,1)");
                food_gradient.addColorStop(0.33,"rgba(255,255,128,0.7)");
                food_gradient.addColorStop(0.67,"rgba(255,255,128,0.3)");
                food_gradient.addColorStop(1,"rgba(255,255,128,0)");
            }
            else{
                food_gradient.addColorStop(0,"rgba(255,170,128,1)");
                food_gradient.addColorStop(0.33,"rgba(255,170,128,0.7)");
                food_gradient.addColorStop(0.67,"rgba(255,170,128,0.3)");
                food_gradient.addColorStop(1,"rgba(255,170,128,0)");
            }
            ctx.fillStyle=food_gradient;
            ctx.beginPath();
            ctx.arc(food.location.x,food.location.y,food_radius*11/8,-Math.PI,Math.PI);
            ctx.closePath();
            ctx.fill();
        },displayTime);
        /*projectiles.forEach(function(projectile){
            var projectile_gradient=ctx.createRadialGradient(projectile.location.x,projectile.location.y,food_radius*4/8,projectile.location.x,projectile.location.y,food_radius*11/8);
            projectile_gradient.addColorStop(0,"rgba(255,170,128,1)");
            projectile_gradient.addColorStop(0.33,"rgba(255,170,128,0.7)");
            projectile_gradient.addColorStop(0.67,"rgba(255,170,128,0.3)");
            projectile_gradient.addColorStop(1,"rgba(255,170,128,0)");
            ctx.fillStyle=projectile_gradient;
            ctx.beginPath();
            ctx.arc(projectile.location.x,projectile.location.y,food_radius*11/8,-Math.PI,Math.PI);
            ctx.closePath();
            ctx.fill();
        },displayTime);*/
        agents.forEach(function(agent){
            var outer_radius=Math.sqrt(agent.mass)+agent.health*12;
            var player_gradient=ctx.createRadialGradient(agent.location.x,agent.location.y,Math.sqrt(agent.mass),agent.location.x,agent.location.y,outer_radius);
            player_gradient.addColorStop(0,"rgba(224,255,255,1)");
            player_gradient.addColorStop(0.33,"rgba(224,255,255,0.7)");
            player_gradient.addColorStop(0.67,"rgba(224,255,255,0.3)");
            player_gradient.addColorStop(1,"rgba(224,255,255,0)");
            ctx.fillStyle=player_gradient;
            ctx.beginPath();
            ctx.arc(agent.location.x,agent.location.y,outer_radius,-Math.PI,Math.PI);
            ctx.closePath();
            ctx.fill();
        },displayTime);

        ctx.save();
        ctx.globalCompositeOperation="difference";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        agents.forEach(function(agent,agentid){
            var font_size=Math.pow(agent.mass,1/4)*8; // fractional font sizes display different indifferent browsers, but we are not really concerned about that.
            ctx.font=font_size+"px CandelaBold,sans-serif";//"1000px Baloo"
            var display_name=agent_properties.get(agentid).display_name;
            ctx.fillText(display_name,agent.location.x,agent.location.y);
        },displayTime);
        ctx.restore();
        
        // shields
        ctx.save();
        agent_shields.forEach(function(agent_shield,agentid){
            var agent=agents.get(agentid,displayTime);
            if(agent){
                var agent_radius=Math.sqrt(agent.mass);
                var shield_radius=agent_radius+Math.sqrt(agent.mass);
                if(agent_shield.fade_start_time){
                    if(displayTime>agent_shield.fade_start_time){
                        if(displayTime>=agent_shield.fade_start_time+1000){
                            agent_shields.delete(agentid);
                            return;
                        }
                        else{
                            ctx.globalAlpha=(agent_shield.fade_start_time+1000-displayTime)/1000;
                        }
                    }
                    else{
                        ctx.globalAlpha=1;
                    }
                }
                else{
                    ctx.globalAlpha=1;
                }
                var shield_gradient=ctx.createRadialGradient(agent.location.x,agent.location.y,shield_radius-200,agent.location.x,agent.location.y,shield_radius+20);
                shield_gradient.addColorStop(0/11,"rgba(255,255,255,0)");
                shield_gradient.addColorStop(4/11,"rgba(255,255,255,0.1)");
                shield_gradient.addColorStop(7/11,"rgba(255,255,255,0.25)");
                shield_gradient.addColorStop(10/11,"rgba(255,255,255,0.5)");
                shield_gradient.addColorStop(11/11,"rgba(255,255,255,0)");
                ctx.fillStyle=shield_gradient;
                ctx.beginPath();
                ctx.arc(agent.location.x,agent.location.y,shield_radius+15,-Math.PI,Math.PI);
                ctx.closePath();
                ctx.fill();
            }
            else{
                agent_shields.delete(agentid);
            }
        });
        ctx.restore();

        ctx.restore();

        // draw leaderboard to screen (with screen normalised coordinates (width, height))
        ctx.save();
        ctx.translate(width,0);
        ctx.scale(1/1024,1/1024);
        ctx.translate(-8,8);
        ctx.globalCompositeOperation="difference";
        ctx.font="14px CandelaBold,sans-serif";
        ctx.fillStyle="white";
        ctx.textBaseline="top";
        for(var i=0;i<leaderboard.length;++i){
            var score_width=ctx.measureText(leaderboard[i].score.toString()).width;
            ctx.textAlign="left";
            var calculatedName=getFittingText(ctx,leaderboard[i].display_name,192-score_width-4);
            ctx.fillText(calculatedName,-192,i*20);
            ctx.textAlign="right";
            ctx.fillText(leaderboard[i].score.toString(),0,i*20);
        }
        ctx.restore();
    };
    var message_time_storage=[];
    var last_message_curr_location=undefined;
    var boardsize=new Point(80000,80000);
    //var last_message_time=undefined;
    var process_message=function(data){
        //var this_messsage_time=new Date().getTime();
        //if(last_message_time)console.log(this_messsage_time-last_message_time);
        //last_message_time=this_messsage_time;
        try{
            //var stream=new TokenStream(data.split(" "));
            var stream=new ByteReadStream(data);

            var msgtype=stream.readUint8();
            switch(msgtype){
                case 1:
                    process_field_update(stream);
                    break;
                case 2:
                    process_death(stream);
                    break;
                case 3:
                    process_leaderboard_update(stream);
                    break;
            }


        }
        catch(e){
            console.log(e.message);
        }
    };

    var process_field_update=function(stream){
        var new_agents=new Map();
        //var new_projectiles=new Map();
        var new_foods=new Map();

        var timestamp=stream.readUint64();
        
        
        
        var clienttime=new Date().getTime();
        message_time_storage.push(clienttime-timestamp);
        if(message_time_storage.length>50)message_time_storage.shift();
        var avg_delay=message_time_storage.reduce(function(sum,el){
            return sum+el;
        },0)/message_time_storage.length;
        var calculatedtime=timestamp+avg_delay;
        
        var screen_centre=Point.fromStream(stream);
        var screen_dimensions=Point.fromStream(stream);
        
        my_agentid=stream.readUint64()+"";
        if(my_agentid!=="0"){ // 0 is a special 'null' value.
            is_alive=true;
        }
        else{
            my_agentid=undefined;
        }
        /*if(screen_centre.x<0||screen_centre.x>=boardsize.x||screen_centre.y<0||screen_centre.y>=boardsize.y){
            console.log("Invalid! "+screen_centre.x+" "+screen_centre.y);
        }
        console.log(screen_centre.x+" "+screen_centre.y);*/
        
        
        var agent_ct=stream.readUint32();
        var foods_ct=stream.readUint32();
        for(var i=0;i<agent_ct;++i){
            var agentid=stream.readUint64()+"";
            //if(i===0)my_agentid=agentid;
            var new_agent=Agent.fromStream(stream);
            //if(i===0)console.log(new_agent.location.x+" "+new_agent.location.y);
            new_agents.set(agentid,new_agent);
            var new_agent_properties=AgentProperties.fromStream(stream);
            agent_properties.set(agentid,new_agent_properties);
        }
        for(var i=0;i<foods_ct;++i){
            var foodid=stream.readUint64()+"";
            var new_food=Food.fromStream(stream);
            new_foods.set(foodid,new_food);
            //if(new_food.location.x-screen_centre.x>boardsize.x)console.log("Yes!");
        }
        
        
        var curr_message_curr_location=screen_centre;
        if(last_message_curr_location&&last_message_curr_location.x-curr_message_curr_location.x>boardsize.x/2){
            [agents,foods].forEach(function(interpolatorMap){
                interpolatorMap.forEachEngine(function(engine){
                    if(engine.lastRetrievedLocation)engine.lastRetrievedLocation.location=new Point(engine.lastRetrievedLocation.location.x-boardsize.x,engine.lastRetrievedLocation.location.y);
                    if(engine.currLocation)engine.currLocation.location=new Point(engine.currLocation.location.x-boardsize.x,engine.currLocation.location.y);
                    if(engine.prevLocation)engine.prevLocation.location=new Point(engine.prevLocation.location.x-boardsize.x,engine.prevLocation.location.y);
                });
            });
            agent_boost_streams.forEach(function(agent_boost_stream){
                agent_boost_stream.data.forEach(function(pt){ // no need to clone pt as it is guaranteed that nobody else holds a reference to this object
                    pt.x-=boardsize.x;
                });
            });
            if(centre_loc.lastRetrievedLocation)centre_loc.lastRetrievedLocation=new Point(centre_loc.lastRetrievedLocation.x-boardsize.x,centre_loc.lastRetrievedLocation.y);
            if(centre_loc.currLocation)centre_loc.currLocation=new Point(centre_loc.currLocation.x-boardsize.x,centre_loc.currLocation.y);
            if(centre_loc.prevLocation)centre_loc.prevLocation=new Point(centre_loc.prevLocation.x-boardsize.x,centre_loc.prevLocation.y);
        }
        else if(last_message_curr_location&&curr_message_curr_location.x-last_message_curr_location.x>boardsize.x/2){
            [agents,foods].forEach(function(interpolatorMap){
                interpolatorMap.forEachEngine(function(engine){
                    if(engine.lastRetrievedLocation)engine.lastRetrievedLocation.location=new Point(engine.lastRetrievedLocation.location.x+boardsize.x,engine.lastRetrievedLocation.location.y);
                    if(engine.currLocation)engine.currLocation.location=new Point(engine.currLocation.location.x+boardsize.x,engine.currLocation.location.y);
                    if(engine.prevLocation)engine.prevLocation.location=new Point(engine.prevLocation.location.x+boardsize.x,engine.prevLocation.location.y);
                });
            });
            agent_boost_streams.forEach(function(agent_boost_stream){
                agent_boost_stream.data.forEach(function(pt){ // no need to clone pt as it is guaranteed that nobody else holds a reference to this object
                    pt.x+=boardsize.x;
                });
            });
            if(centre_loc.lastRetrievedLocation)centre_loc.lastRetrievedLocation=new Point(centre_loc.lastRetrievedLocation.x+boardsize.x,centre_loc.lastRetrievedLocation.y);
            if(centre_loc.currLocation)centre_loc.currLocation=new Point(centre_loc.currLocation.x+boardsize.x,centre_loc.currLocation.y);
            if(centre_loc.prevLocation)centre_loc.prevLocation=new Point(centre_loc.prevLocation.x+boardsize.x,centre_loc.prevLocation.y);
        }
        if(last_message_curr_location&&last_message_curr_location.y-curr_message_curr_location.y>boardsize.y/2){
            [agents,foods].forEach(function(interpolatorMap){
                interpolatorMap.forEachEngine(function(engine){
                    if(engine.lastRetrievedLocation)engine.lastRetrievedLocation.location=new Point(engine.lastRetrievedLocation.location.x,engine.lastRetrievedLocation.location.y-boardsize.y);
                    if(engine.currLocation)engine.currLocation.location=new Point(engine.currLocation.location.x,engine.currLocation.location.y-boardsize.y);
                    if(engine.prevLocation)engine.prevLocation.location=new Point(engine.prevLocation.location.x,engine.prevLocation.location.y-boardsize.y);
                });
            });
            agent_boost_streams.forEach(function(agent_boost_stream){
                agent_boost_stream.data.forEach(function(pt){ // no need to clone pt as it is guaranteed that nobody else holds a reference to this object
                    pt.y-=boardsize.y;
                });
            });
            if(centre_loc.lastRetrievedLocation)centre_loc.lastRetrievedLocation=new Point(centre_loc.lastRetrievedLocation.x,centre_loc.lastRetrievedLocation.y-boardsize.y);
            if(centre_loc.currLocation)centre_loc.currLocation=new Point(centre_loc.currLocation.x,centre_loc.currLocation.y-boardsize.y);
            if(centre_loc.prevLocation)centre_loc.prevLocation=new Point(centre_loc.prevLocation.x,centre_loc.prevLocation.y-boardsize.y);
        }
        else if(last_message_curr_location&&curr_message_curr_location.y-last_message_curr_location.y>boardsize.y/2){
            [agents,foods].forEach(function(interpolatorMap){
                interpolatorMap.forEachEngine(function(engine){
                    if(engine.lastRetrievedLocation)engine.lastRetrievedLocation.location=new Point(engine.lastRetrievedLocation.location.x,engine.lastRetrievedLocation.location.y+boardsize.y);
                    if(engine.currLocation)engine.currLocation.location=new Point(engine.currLocation.location.x,engine.currLocation.location.y+boardsize.y);
                    if(engine.prevLocation)engine.prevLocation.location=new Point(engine.prevLocation.location.x,engine.prevLocation.location.y+boardsize.y);
                });
            });
            agent_boost_streams.forEach(function(agent_boost_stream){
                agent_boost_stream.data.forEach(function(pt){ // no need to clone pt as it is guaranteed that nobody else holds a reference to this object
                    pt.y+=boardsize.y;
                });
            });
            if(centre_loc.lastRetrievedLocation)centre_loc.lastRetrievedLocation=new Point(centre_loc.lastRetrievedLocation.x,centre_loc.lastRetrievedLocation.y+boardsize.y);
            if(centre_loc.currLocation)centre_loc.currLocation=new Point(centre_loc.currLocation.x,centre_loc.currLocation.y+boardsize.y);
            if(centre_loc.prevLocation)centre_loc.prevLocation=new Point(centre_loc.prevLocation.x,centre_loc.prevLocation.y+boardsize.y);
        }

        // boost stream animations:
        var new_current_agent_boost_streams=new Map();
        new_agents.forEach(function(agent,agentid){
            // for boost animation:
            if(agent.is_boosting){
                var agent_boost_stream=current_agent_boost_streams.get(agentid);
                if(!agent_boost_stream){
                    agent_boost_stream={updated_time:calculatedtime,offset:[],data:[],width:Math.sqrt(agent.mass)/1.5};
                    for(var j=0;j<Math.sqrt(agent.mass)/150;++j){
                        agent_boost_stream.offset.push(Math.random()*2*Math.PI);
                    }
                    agent_boost_streams.push(agent_boost_stream);
                }
                agent_boost_stream.updated_time=calculatedtime;
                agent_boost_stream.offset=agent_boost_stream.offset.map(function(offset){
                    return (offset+(boost_animation_period/message_period*2*Math.PI))%(2*Math.PI);
                });
                agent_boost_stream.data.unshift(new Point(agent.location));
                new_current_agent_boost_streams.set(agentid,agent_boost_stream);
            }
        });
        current_agent_boost_streams=new_current_agent_boost_streams;
        
        // shields
        new_agents.forEach(function(agent,agentid){
            // for boost animation:
            if(agent.has_shield){
                agent_shields.set(agentid,{fade_start_time:undefined});
            }
            else{
                var agent_shield=agent_shields.get(agentid);
                if(agent_shield&&!agent_shield.fade_start_time){
                    agent_shield.fade_start_time=calculatedtime;
                }
            }
        });
        




        last_message_curr_location=curr_message_curr_location;
        // end modulo
        agents.setData(new_agents,calculatedtime);
        // TODO: smooth spawn speed for projectiles

        foods.setData(new_foods,calculatedtime);
        
        // centre location
        centre_loc.set(screen_centre,calculatedtime);

        // client view size variability
        //client_area.set(300000*Math.sqrt(my_agent_mass));
        client_area.set(screen_dimensions.x*screen_dimensions.y);
    };

    var process_death=function(stream){
        is_alive=false;
        my_agentid=undefined;
        override_actions=true;
        
        setTimeout(function(){
            if(death_callback){
                death_callback();
                death_callback=undefined;
            }
            setTimeout(function(){
                socket.close();
            },1000);
        },4000);
    };

    var process_leaderboard_update=function(stream){
        var leaderboard_ct=stream.readUint8();
        leaderboard=[];
        for(var i=0;i<leaderboard_ct;++i){
            var curr_display_name=stream.readString();
            var curr_score=stream.readInt64();
            leaderboard.push({display_name:curr_display_name,score:curr_score});
        }
    };



    var spawn_me_on_server=function(display_name){
        // the first '3' in the message denotes 'spawn me'
        // sends display name to server too
        if(socket.readyState===1){
            var stream=new ByteWriteStream();
            stream.writeUint8(3);
            stream.writeString(display_name);
            socket.send(stream.getBuffer());
        }
    };

    var send_dimensions_to_server=function(){
        // the first '2' in the message denotes 'screen dimensions update'
        //if(socket.readyState===1)socket.send("2 "+Math.round(canvas.width/canvas_scale*server_size_factor).toString()+" "+Math.round(canvas.height/canvas_scale*server_size_factor).toString());
        if(socket&&socket.readyState===1){
            var stream=new ByteWriteStream();
            stream.writeUint8(2);
            stream.writeUint32(logical_width);
            stream.writeUint32(logical_height);
            socket.send(stream.getBuffer());
            //socket.send("2 "+canvas.width.toString()+" "+canvas.height.toString());
        }
    };

    var send_update_to_server=function(){
        if(socket.readyState===1&&is_alive){ // OPEN state
           // var server_mouse_pos=new Point((pt.x-canvas.width/2)/canvas_scale*server_size_factor,(pt.y-canvas.height/2)/canvas_scale*server_size_factor);
            // the first '1' in the message denotes 'action'
            var stream=new ByteWriteStream();
            stream.writeUint8(1);
            stream.writeBool(current_movement_dir!==null);
            stream.writeBool(current_firing);
            if(current_movement_dir!==null){
                stream.writeBool(current_boosting);
                stream.writeInt16(Math.round(current_movement_dir*((360*60)/(2*Math.PI))));
            }
            socket.send(stream.getBuffer());
        }
    };

    var process_movement_dir_update=function(pt){
        if(is_alive&&displayTime){
            var current_mouse_pos=pt;
            var centerpoint=new Point(logical_width/2,logical_height/2);
            if(current_mouse_pos.distanceFrom(centerpoint)<Math.sqrt(agents.get(my_agentid,displayTime).mass)/Math.sqrt(client_area.get(displayTime))*canvas_scale){
                current_movement_dir=null;
            }
            else{
                current_movement_dir=current_mouse_pos.angleFrom(centerpoint);
            }
            send_update_to_server();
        }
    };

    var process_firing_update=function(pt,state){
        if(current_firing!==state){
            current_firing=state;
            send_update_to_server();
        }
    };

    var process_boosting_update=function(state){
        if(current_boosting!==state){
            current_boosting=state;
            send_update_to_server();
        }
    };
};
DomGame.prototype.start=function(remote_endpoint,display_name){
    this._start(remote_endpoint,display_name);
};
DomGame.prototype.stop=function(){
    this._stop();
};