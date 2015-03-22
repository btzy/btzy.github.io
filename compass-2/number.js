Number.Epsilon=0.000001;
Number.IsEqual=function(number1,number2){
	return Math.abs(number1-number2)<=Number.Epsilon;
}
Number.IsGreater=function(bigger,smaller){
	return bigger-smaller>Number.Epsilon;
}
Number.IsZero=function(number){
	return Math.abs(number)<=Number.Epsilon;
}