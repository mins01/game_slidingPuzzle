var SlidingPuzzleUI = (function(){
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
		},
		"pzPieces":null,
		"initTags":function(){
			$(this.pzbox).html("");
			$(this.pzbox).append('<div class="pz-grid" data-w="'+sp.w+'" data-h="'+sp.h+'"></div>');
			this.pzGrid = this.pzbox.querySelector(".pz-grid");
			for(var i=0,m=sp.w*sp.h;i<m;i++){
				$(this.pzGrid).append('<div class="pz-piece" data-k="'+i+'"></div>')
			}
			$(this.pzGrid).find('.pz-piece[data-k="'+sp.lastK+'"]').attr('data-lastK',"");
			this.pzPieces = $(this.pzGrid).find('.pz-piece[data-k]');
		},
		"initEvent":function(){
			$(this.pzGrid).on("click",".pz-piece",function(evt){
				// console.log($(this).attr('data-k'));
				if(!sp.moveKtoLastK(parseInt($(this).attr('data-k')))){
					alert("이동 불가");
					return;
				};
				SlidingPuzzleUI.draw();
				SlidingPuzzleUI.checkFinish();
			})
		},
		"draw":function(){
			var ps = sp.getPs();
			for(var i=0,m=ps.length;i<m;i++){
				this.pzGrid.append(this.pzPieces[ps[i]]);
			}
		},
		"checkFinish":function(){
			if(sp.checkFinish()){
				setTimeout(function(){
					alert("Finish!");	
				},0)
			}
		},
		"suffle":function(){
			sp.suffleKs(sp.ks.length*4);
			this.draw();
		}
		
		
	};
})()

