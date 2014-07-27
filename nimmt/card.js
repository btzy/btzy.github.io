// JavaScript Document
function CreateCard(number){
	var points=(number==55)?7:(number%11==0)?5:(number%10==0)?3:(number%5==0)?2:1;
	var charmap=[null,"&#10102;","&#10103;","&#10104;",null,"&#10106;",null,"&#10108;"];
	return '<svg class="face-'+points+'" viewBox="0 0 50 70"><rect x="0" y="0" width="50" height="70" class="face-background" /><text class="face-value" text-anchor="middle" x="25" y="50">'+number+'</text><text class="face-points" text-anchor="middle" x="25" y="9">'+charmap[points]+'</text><text class="face-points" text-anchor="middle" x="25" y="68">'+charmap[points]+'</text></svg>';
}
function GetPoints(number){
	return (number==55)?7:(number%11==0)?5:(number%10==0)?3:(number%5==0)?2:1;
}