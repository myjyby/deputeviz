<?php
	$db_host = "deputeviwpjyby.mysql.db";
	$db_username = "deputeviwpjyby";
	$db_pass = "deputeDB2204";
	$db_name = "deputeviwpjyby";

	$db_connection = mysql_connect($db_host, $db_username, $db_pass, $db_name) or die(mysql_error());
	mysql_select_db($db_name) or die(mysql_error());
?>