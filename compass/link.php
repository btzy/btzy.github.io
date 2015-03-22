<?php
$url = $_REQUEST['link'];
if (preg_match('/\b(https?|ftp):\/\/*/', $url) !== 1) die;
echo (file_get_contents($url));
?>