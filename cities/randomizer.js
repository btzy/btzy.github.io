function Randomizer(arraydata){
	this.Data=arraydata;
}
Randomizer.prototype.GetNext=function(){
	var index=Math.floor(Math.random()*this.Data.length);
	if(index>=this.Data.length)index=0;
	return this.Data[index];
}