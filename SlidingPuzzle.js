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
				this.w = w;
				this.h = h;
				this.pzMap = new Array(w*h);
				this.lastK = this.pzMap.length-1;
				for(var i=0,m=this.pzMap.length;i<m;i++){
					this.pzMap[i]=i;
				}
			},
			"sufflePzMap":function(n){
				this.showPmap();
				while(n--){
						this.suffleOncePzMap();
				}
			},
			"suffleOncePzMap":function(){
				var k = this.shuffleArray(this.removeNullKs(this.getNeighborhoodKs(this.lastK)))[0];
				console.log(this.lastK+" to "+k);
				this.changePos(this.lastK,k);
				this.showPmap();
			},
			"checkChangePos":function(k1,k2){
				if(this.getNeighborhoodKs(k2).indexOf(k1)==-1){
					// console.error("position index out range exception");
					return false;
				}
				return true;
			},
			"changePos":function(k1,k2){
				if(!this.checkChangePos(k1,k2)){
					return;
				}
				var p = this.pzMap[k2];
				this.pzMap[k2] = this.pzMap[k1]
				this.pzMap[k1] = p;
			},
			//top,right,bottom,left
			"getNeighborhoodKs":function(k){
				var p = this.pzMap[k]; //포지션 찾기
				var ks = [-1,-1,-1,-1];
				if(p-this.w>=0){
					ks[0] = this.pzMap.indexOf(p-this.w);
				}
				if((p+1)%this.w!=0){
					ks[1] = this.pzMap.indexOf(p+1);
				}
				if(p+this.w<=this.lastK){
					ks[2] = this.pzMap.indexOf(p+this.w);
				}
				if(p%this.w!=0){
					ks[3] = this.pzMap.indexOf(p-1);
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
			"showPmap":function(){
				//-- k-p 배열에서 p-k 배열로 만들어서 출력
				var ps = new Array(this.w*this.h); 
				for(var i=0,m=this.pzMap.length;i<m;i++){
					ps[this.pzMap[i]] = i;
				}
				var msg = [];
				for(var i=0,m=ps.length;i<m;i+=this.w){
					msg.push(ps.slice(i,i+this.w).toString());
				}
				console.log(msg.join("\n"));
			},
			"checkFinish":function(){
				for(var i=0,m=this.pzMap.length;i<m;i++){
					if(i != this.pzMap[i]) return false;
				}
				return true;
			}
		}	
	})()
	
	
	
	return SlidingPuzzle;
})()