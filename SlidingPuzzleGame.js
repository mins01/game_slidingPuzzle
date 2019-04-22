var SlidingPuzzleGame = (function(){
	var version = "0.4";
	var sp = new SlidingPuzzle(3,3);
	return {
		"version":version,
		"sp":null ,
		"pzbox":null,
		"pzGrid":null,
		"init":function(){
			this.initTags();
			this.initEvent();
			this.stopSuffle();
		},
		"create":function(w,h){
			
			if(this.isSuffling()){
				return;
			}
			$(this.pzbox).attr("data-status","creating");
			this.cliclable = false;
			
			this.stopSuffle();
			sp.createPuzzle(w,h)
			this.sp = sp;
			this.initAddTags();
			this.hideAnswer();
			
			this.clock.reset();
			this.msgbox.show("sliding puzzle");
			$(this.pzbox).attr("data-status","created");
		},
		"pzPieces":null,
		"initTags":function(){
			this.pzGrid = this.pzbox.querySelector(".pz-grid");
		},
		"initAddTags":function(){
			$(this.pzGrid).html("").attr("data-w",sp.w).attr("data-h",sp.h);
			for(var i=0,m=sp.w*sp.h;i<m;i++){
				$(this.pzGrid).append('<div class="pz-piece" data-k="'+i+'"  data-p="'+i+'"    ><div class="pz-block"  data-label="'+(i+1)+'"></div></div>')
			}
			$(this.pzGrid).find('.pz-piece[data-k="'+sp.lastK+'"]').attr('data-lastK',"");
			this.pzPieces = $(this.pzGrid).find('.pz-piece[data-k]');
			this.initBgImgPos();
			this.draw();
		},
		"initBgImgPos":function(){
			var unitW = 100/(sp.w-1);
			var unitH = 100/(sp.h-1);
			for(var i=0,m=this.pzPieces.length;i<m;i++){
				var $pzBlock = $(this.pzPieces[i]).find('.pz-block');
				var y = Math.floor(i/sp.w)
				var x = i%sp.w;
				$pzBlock.css('backgroundPositionX',x*unitW+"%")
				.css('backgroundPositionY',y*unitW+"%");
			}
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
			this.drawByPs(ps)
		},
		"drawByPs":function(ps){
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
		"showAnswer":function(){
			var ps = new Array(sp.ks.length);
			for(var i=0,m=ps.length;i<m;i++){
				ps[i]=i;
			}
			this.drawByPs(ps);
		},
		"hideAnswer":function(){
			this.draw();
		},
		"checkFinish":function(){
			var thisC = this;
			if(sp.checkFinish()){
				thisC.cliclable = false;
				setTimeout(function(){
					thisC.clock.stop();
					thisC.msgbox.show("FINISH!!");
					thisC.msgbox.hide(2000);
					$(thisC.pzbox).attr("data-status","finished");
					// thisC.msgbox.hide(2000);
				},500);
				
			}
		},
		"isSuffling":function(){
			return $(this.pzGrid).attr("data-shuffling")!=null || this.tmSuffle;
		},
		"tmSuffle":null,
		"suffle":function(){
			// sp.suffleKs(sp.ks.length*4);
			
			var thisC = this;
			var n = sp.ks.length*10
			var fns = []; 
			this.hideAnswer();
			if(this.isSuffling()){
				console.error("shuffling");
				return;
			}
			this.clock.reset();

			$(thisC.pzbox).attr("data-status","suffling");
			
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
									thisC.cliclable = true;
									thisC.clock.start();
									$(thisC.pzGrid).attr("data-shuffling",null);	
									$(thisC.pzGrid).attr("data-transition-speed",null);
									$(thisC.pzbox).attr("data-status","gaming");
								});
							});
						});
					});
				});
			})
			this.tmSuffle = setInterval(function(){
				if(fns.length>0){
					var fn = fns.shift();
					fn();
				}else{
					thisC.stopSuffle();
				}
			},10)
		},
		"stopSuffle":function(){
			if(this.tmSuffle) clearInterval(this.tmSuffle);
			this.tmSuffle = null;
		},
		"msgbox":{
			"show":function(msg){
				$("#msgbox").text(msg).show();
			},
			"hide":function(time,fn){
				if(!time) time = 0;
				setTimeout(function(){
					$("#msgbox").hide();	
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
			
		},
		"setBgImage":function(n){
			if(n==0){
				$(this.pzbox).attr("data-bg-image",null);	
			}else{
				$(this.pzbox).attr("data-bg-image",n);
			}
		},
		"test":{
			"finish":function(){
				for(var i=0,m=sp.ks.length;i<m;i++){
					sp.ks[i]=i;
				}
				SlidingPuzzleGame.draw();
				SlidingPuzzleGame.checkFinish();
			}
		}
		
		
		
	};
})()

