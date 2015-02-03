<?php
	$db_host = "localhost";
	$db_username = "root";
	$db_pass = "root";
	$db_name = "deputeviz";

	$db_connection = mysql_connect($db_host, $db_username, $db_pass, $db_name) or die(mysql_error());
	mysql_select_db($db_name) or die(mysql_error());
?>