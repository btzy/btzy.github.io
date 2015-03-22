<?php
$hintentries=0;
if(isset($_COOKIE["hintentries"])){
	$hintentries=$_COOKIE["hintentries"];
}
setcookie("hintentries",$hintentries+1,time()+259200);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>The hints!</title>
<style>
#outPopUp{
     position:absolute;
     z-index:15;
     margin:0;
     background:#9F0;
}
</style>
</head>

<body bgcolor="#FFFFCC">
<div id="outPopUp">
<div style="padding:40px">
<?php if($hintentries==0){ ?>
<p>Trying to get hints?  Why are you giving up so soon?</p>
<?php }elseif($hintentries==1){ ?>
<p>Persistence is key, my friend.</p>
<?php }elseif($hintentries==2){ ?>
<p>Are you absolutely sure you want to get the hints?</p>
<?php }elseif($hintentries>=3){ ?>
<p>You have commendable persistence.  Hence, you will be rewarded.</p>
<p>Here are the clues: <span style="color:#666">The clues are given by index number, so it would only help if you know who you're finding.  Good luck.</span></p>
<table width="100%" border="1">
  <tr>
    <td>Name</td>
    <td>Clue</td>
  </tr>
  <tr>
    <td>ALVIN TAN WEI MING</td>
    <td>home</td>
  </tr>
  <tr>
    <td>BERNARD TEO ZHI YI</td>
    <td>OFF in two words, without any 'a'.</td>
  </tr>
  <tr>
    <td>CHIANG YAN LI</td>
    <td>coffee tea icecream water orange juice lemonade</td>
  </tr>
  <tr>
    <td>CHIK CHENG YAO</td>
    <td>pineapple</td>
  </tr>
  <tr>
    <td>CHO MING EN</td>
    <td>Isn't it obvious? The Earth isn't that big!</td>
  </tr>
  <tr>
    <td>GAO YAN</td>
    <td></td>
  </tr>
  <tr>
    <td>GOH HUI MIN</td>
    <td>You ordered it too.</td>
  </tr>
  <tr>
    <td>HO JIN YANG</td>
    <td>Clue will not help.  There is no    answer needed.</td>
  </tr>
  <tr>
    <td>LANG YANBIN</td>
    <td></td>
  </tr>
  <tr>
    <td>LEONG QI DONG</td>
    <td>econs lecture</td>
  </tr>
  <tr>
    <td>LI XIAOXUE</td>
    <td>Who do you wish the answer is?</td>
  </tr>
  <tr>
    <td>LIM CHIA WEI</td>
    <td>no need la... if you really want: go search through ur email :D</td>
  </tr>
  <tr>
    <td>LIM SHU NING</td>
    <td></td>
  </tr>
  <tr>
    <td>LIU RUIHAN</td>
    <td>There's no clue here. Isn't it obvious?</td>
  </tr>
  <tr>
    <td>LOO LI YANG</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>LYNCAM EDVIANO LOO</td>
    <td></td>
  </tr>
  <tr>
    <td>MA QIANHUI</td>
    <td>The (incorrect) name for your jacket.</td>
  </tr>
  <tr>
    <td>NG YI PIN</td>
    <td>http://poohbearfanclub.blogspot.sg/</td>
  </tr>
  <tr>
    <td>OEN QI XUAN, KELLYNN</td>
    <td>Think egoistic.</td>
  </tr>
  <tr>
    <td>RACHEL TEO</td>
    <td>The second word rhymes with shun.</td>
  </tr>
  <tr>
    <td>RAO XIAOJIA</td>
    <td>The number is even!</td>
  </tr>
  <tr>
    <td>TAN WEI YANG</td>
    <td>GP essay question posed during math lecture</td>
  </tr>
  <tr>
    <td>THENG KWANG HUI MARK</td>
    <td>There is no dependence on the magnetic flux density because chronon    interactions cancel out the magnetic field. Also, dimensional analysis.</td>
  </tr>
  <tr>
    <td>WANG QIAN</td>
    <td>It's on your bed.</td>
  </tr>
  <tr>
    <td>WANG RUONI</td>
    <td>No clue here, sorry</td>
  </tr>
  <tr>
    <td>XIA NAN</td>
    <td>I'm confident in your ability, so I don't give clue liao :)</td>
  </tr>
  </table>
<?php } ?>
</div>
</div>
</body>
</html>
