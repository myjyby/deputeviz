<?php
	include_once("connect.php");

	function getUserActivity($sort){
		$responses = "";
		$sql3 = mysql_query("SELECT * FROM questions WHERE q_view IS NOT NULL ORDER BY ". $sort ." DESC LIMIT 0, 10") or die(mysql_error());
		if(mysql_num_rows($sql3) == 0){
			$responses = "<li role='presentation' class='each-response grayed'>Il n’y a pas de commentaires ou questions pour le moment.</li>";
		}else{
			while($row3 = mysql_fetch_assoc($sql3)){
				$responses .= "<li class='user-snapshot q-". $row3['id'] ."' role='presentation' onclick='displayUserView(\"". $row3['q_view'] ."\",\"". $row3['q_scaleindicator'] ."\",\"". $row3['q_scalesdata'] ."\",\"". $row3['q_scalessdata'] ."\",\"". $row3['q_color'] ."\",\"". $row3['q_maxscale'] ."\",\"". $row3['q_scrutin'] ."\",\"". $row3['q_xindicator'] ."\",\"". $row3['q_xdata'] ."\",\"". $row3['q_xsdata'] ."\",\"". $row3['q_yindicator'] ."\",\"". $row3['q_ydata'] ."\",\"". $row3['q_ysdata'] ."\",\"". $row3['q_selectednodes'] ."\",\"". $row3['id'] ."\",false);collapseUSERACTIVITY()'>
						<a><u>". $row3['q_author'] ."&thinsp;:</u> «&thinsp;". $row3['q_text'] ."&thinsp;»</a>
					</li>
					<li role='presentation' class='divider'></li>";
			}
		}
		return $responses;
	}

	$sort = "";
	if(isset($_POST['sort'])){
		$sort = $_POST['sort'];
	}else{
		$sort = "q_date";
	}

	echo getUserActivity($sort);

?>