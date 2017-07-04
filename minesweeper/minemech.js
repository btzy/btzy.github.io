function MinesweeperGame(height,width,mines){
	this.Grid=new Array(height);
	for(var i=0;i<height;++i){
		this.Grid[i]=new Array(width);
	}
	this.Height=height;
	this.Width=width;
	this.Mines=mines;
}
MinesweeperGame.prototype.Height=0;
MinesweeperGame.prototype.Width=0;
MinesweeperGame.prototype.Mines=0;
MinesweeperGame.prototype.Grid=null;
MinesweeperGame.prototype.IsNew=true;
MinesweeperGame.prototype.Step=function(top,left){
	if(this.IsNew){
		this.IsNew=false;
		var tmparr=new Array();
		for(var i=0;i<this.Mines;++i){
			tmparr.push(true);
		}
		for(var i=this.Mines;i<this.Height*this.Width-1;++i){
			tmparr.push(false);
		}
		shuffle(tmparr);
		var k=0;
		for(var i=0;i<this.Height;++i){
			for(var j=0;j<this.Width;++j){
				if(i==top&&j==left)this.Grid[i][j]=false;
				else{
					this.Grid[i][j]=tmparr[k];
					++k;
				}
			}
		}
	}
	return(this.Grid[top][left])?-1:this.CountMines(top,left);
	//returns number of bombs. -1=die, -2=closed
}
MinesweeperGame.prototype.CountMines=function(top,left){
	var ret=0;
	for(var i=top-1;i<=top+1;++i){
		for(var j=left-1;j<=left+1;++j){
			if(i>=0&&j>=0&&i<this.Height&&j<this.Width&&this.Grid[i][j])++ret;
		}
	}
	return ret;
}
var shuffle=function(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};