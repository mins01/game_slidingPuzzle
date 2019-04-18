var SlidingPuzzle = (function(){
	var version = "0.1";
	var SlidingPuzzle = function(w,h){
		this.init(w,h);
	}
	SlidingPuzzle.prototype = (function(){
		return {
			"version":version,
			"w":0,
			"h":0,		
			"lastK":-1,
			"init":function(w,h){
				return this.createPuzzle(w,h);
			},
			"createPuzzle":function(w,h){
				w = parseInt(w,10);
				h = parseInt(h,10);
				if(w<2){
					console.error("width required number bigger then 2");
				}
				if(h<2){
					console.error("height required number bigger then 2");
				}
				this.w = w;
				this.h = h;
				this.ks = new Array(w*h);
				this.lastK = this.ks.length-1;
				for(var i=0,m=this.ks.length;i<m;i++){
					this.ks[i]=i;
				}
				
			},
			"suffleKs":function(n){
				this.showPmap();
				while(n--){
						this.suffleOnceKs();
				}
			},
			"suffleOnceKs":function(){
				var k = this.shuffleArray(this.removeNullKs(this.getNeighborhoodKs(this.lastK)))[0];
				// console.log(this.lastK+" to "+k);
				this.changePos(this.lastK,k);
				this.showPmap();
			},
			"checkChangePos":function(k1,k2){
				if(k1 == k2 ||this.getNeighborhoodKs(k2).indexOf(k1)==-1){
					// console.error("position index out range exception");
					return false;
				}
				return true;
			},
			"changePos":function(k1,k2){
				if(!this.checkChangePos(k1,k2)){
					return false;
				}
				var p = this.ks[k2];
				this.ks[k2] = this.ks[k1]
				this.ks[k1] = p;
				return true;
			},
			// k를 lastK와 위치 바꾼다.
			"moveKtoLastK":function(k){
				return this.changePos(k,this.lastK);
			},
			//top,right,bottom,left
			"getNeighborhoodKs":function(k){
				var p = this.ks[k]; //포지션 찾기
				var ks = [-1,-1,-1,-1];
				if(p-this.w>=0){
					ks[0] = this.ks.indexOf(p-this.w);
				}
				if((p+1)%this.w!=0){
					ks[1] = this.ks.indexOf(p+1);
				}
				if(p+this.w<=this.lastK){
					ks[2] = this.ks.indexOf(p+this.w);
				}
				if(p%this.w!=0){
					ks[3] = this.ks.indexOf(p-1);
				}
				return ks;
			},
			// key 에서 -1을 제외
			"removeNullKs":function(ks){
				var rks = [];
				for(var i=0,m=ks.length;i<m;i++){
					if(ks[i]==-1) continue;
					rks.push(ks[i])
				}
				return rks;
			},
			"shuffleArray":function(a) {
				var j, x, i;
				for (i = a.length - 1; i > 0; i--) {
					j = Math.floor(Math.random() * (i + 1));
					x = a[i];
					a[i] = a[j];
					a[j] = x;
				}
				return a;
			},
			"getPs":function(){
				return this.convertKstoPs(this.ks)
			},
			"convertKstoPs":function(ks){
				var ps = new Array(ks.length); 
				for(var i=0,m=ks.length;i<m;i++){
					ps[ks[i]] = i;
				}
				return ps
			},
			"showPmap":function(){
				//-- k-p 배열에서 p-k 배열로 만들어서 출력
				var ps = this.convertKstoPs(this.ks);
				var msg = [];
				for(var i=0,m=ps.length;i<m;i+=this.w){
					msg.push(ps.slice(i,i+this.w).toString());
				}
				// console.log(msg.join("\n"));
			},
			"checkFinish":function(){
				for(var i=0,m=this.ks.length;i<m;i++){
					if(i != this.ks[i]) return false;
				}
				return true;
			}
		}	
	})()
	
	
	
	return SlidingPuzzle;
})()