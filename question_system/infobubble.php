<?php
	include_once("connect.php");

	function getQCount($cID){
		$info = "";
		$sql = mysql_query("SELECT * FROM questions WHERE c_id = '". $cID ."'") or die(mysql_error());
		if(mysql_num_rows($sql) == 0){
			$info = "Il n’y a pas de commentaire ni de question pour cette vue. Posez la première.";
		}else{
			$question = "";
			$responses = "";
			if(mysql_num_rows($sql) == 1){
				$question = "un commentaire ou une question";
				$responses = "Réagissez- ou répondez-y.";
			}else{
				$question = mysql_num_rows($sql) ." commentaires ou questions";
				$responses = "Réagissez- ou répondez-y";
			}
			$info = "Il y a ". $question ." pour cette vue. ". $responses;
		}

		return $info;
	};

	$cID = "";
	if(isset($_POST['c_id'])){
		$cID = $_POST['c_id'];
	}else{
		$cID = 0;
	}

	echo getQCount($cID);

?>