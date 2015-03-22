<?php
if(array_key_exists('link',$_REQUEST)){
	$url = $_REQUEST['link'];
	if(filter_var($url,FILTER_VALIDATE_URL,FILTER_FLAG_SCHEME_REQUIRED)){
		if(($data=file_get_contents($url))!==FALSE){
			exit($data);
		}
	}
}
exit('-');
?>