var SlidingPuzzleGame = (function(){
	var sp = null;
	return {
		"sp":null ,
		"pzbox":null,
		"pzGrid":null,
		"init":function(w,h){
			sp = new SlidingPuzzle(w,h);
			this.sp = sp;
			this.initTags();
			this.initEvent();
			this.clock.reset();
			this.msgbox.show("sliding puzzle");
		},
		"pzPieces":null,
		"initTags":function(){
			$(this.pzbox).html("");
			$(this.pzbox).append('<div class="pz-grid" data-w="'+sp.w+'" data-h="'+sp.h+'"></div>');
			this.pzGrid = this.pzbox.querySelector(".pz-grid");
			for(var i=0,m=sp.w*sp.h;i<m;i++){
				$(this.pzGrid).append('<div class="pz-piece" data-k="'+i+'"  data-p="'+i+'"  data-label="'+(i+1)+'"   ></div>')
			}
			$(this.pzGrid).find('.pz-piece[data-k="'+sp.lastK+'"]').attr('data-lastK',"");
			this.pzPieces = $(this.pzGrid).find('.pz-piece[data-k]');
			this.draw();
		},
		"cliclable":true,
		"initEvent":function(){
			var thisC = this
			$(this.pzGrid).on("click",".pz-piece",function(evt){
				// console.log($(this).attr('data-k'));
				if(!thisC.cliclable){
					return;
				}
				if(!sp.moveKtoLastK(parseInt($(this).attr('data-k')))){
					// alert("이동 불가");
					return;
				};
				thisC.draw();
				thisC.checkFinish();
			})
		},
		"draw":function(){
			var ps = sp.getPs();
			for(var i=0,m=ps.length;i<m;i++){
				// $(this.pzGrid).append(this.pzPieces[ps[i]]);
				$(this.pzPieces[ps[i]]).attr("data-matched",(i==ps[i])?"":null);
				$(this.pzPieces[ps[i]]).attr("data-p",i);
				var left = ((i%sp.w)*100/sp.w)+"%"
				var top = (Math.floor(i/sp.h)*100/sp.h)+"%";
				$(this.pzPieces[ps[i]]).css('left',left);
				$(this.pzPieces[ps[i]]).css('top',top);
				
				
			}
		},
		"checkFinish":function(){
			var thisC = this;
			if(sp.checkFinish()){
				setTimeout(function(){
					thisC.clock.stop();
					thisC.msgbox.show("FINISH!!");
					// thisC.msgbox.hide(2000);
				},500);
				
			}
		},
		"suffle":function(){
			// sp.suffleKs(sp.ks.length*4);
			
			var thisC = this;
			var n = sp.ks.length*10
			var fns = []; 
			
			if($(thisC.pzGrid).attr("data-shuffling")!=null){
				console.error("shuffling");
				return;
			}
			this.clock.reset();

			
			fns.push(function(){
				thisC.msgbox.show("shuffling");
				$(thisC.pzGrid).attr("data-shuffling","");	
				$(thisC.pzGrid).attr("data-transition-speed","fast");	
				thisC.cliclable = false;
			})
			while(n-- >0){
				fns.push(function(){
					sp.suffleOnceKs()
					thisC.draw();
				});
			}
			fns.push(function(){
				thisC.msgbox.show("Ready");
				thisC.msgbox.hide(1000,function(){
					thisC.msgbox.show("3");
					thisC.msgbox.hide(1000,function(){
						thisC.msgbox.show("2");
						thisC.msgbox.hide(1000,function(){
							thisC.msgbox.show("1");
							thisC.msgbox.hide(1000,function(){
								thisC.msgbox.show("Go!");
								thisC.msgbox.hide(1000,function(){
									$(thisC.pzGrid).attr("data-shuffling",null);	
									$(thisC.pzGrid).attr("data-transition-speed",null);	
									thisC.cliclable = true;
									thisC.clock.start();
									
								});
							});
						});
					});
				});
			})
			var tm = setInterval(function(){
				if(fns.length>0){
					var fn = fns.shift();
					fn();
				}else{
					clearInterval(tm);
				}
			},10)
		},
		"msgbox":{
			"show":function(msg){
				$("#msgbox").text(msg);
				$("#msgboxbox").show();	
			},
			"hide":function(time,fn){
				if(!time) time = 0;
				setTimeout(function(){
					$("#msgboxbox").hide();	
					if(fn){fn()}
				},time);	
			}
		},
		"clock":{
			"stTime":-1,
			"tm":null,
			"start":function(){
				this.stTime = (new Date()).getTime();
				var thisC = this;
				this.tm = setInterval(function(){
					thisC.sync();
				},100);
			},
			"reset":function(){
				this.stop();
				$("#clock").text("0.0");
			},
			"stop":function(){
				
				if(this.tm) clearInterval(this.tm);
			},
			"sync":function(){
				var time = (new Date()).getTime() - this.stTime;
				$("#clock").text((time/1000).toFixed(1));
			}
			
		}
		
		
		
	};
})()

