<?php
	include_once("connect.php");
	$q_id = $_POST['q_id'];

	function myStrtotime($date_string){ 
		return strtotime(strtr(strtolower($date_string), array('janvier'=>'jan','février'=>'feb','mars'=>'march','avril'=>'apr','mai'=>'may','juin'=>'jun','juillet'=>'jul','août'=>'aug','septembre'=>'sep','octobre'=>'oct','novembre'=>'nov','décembre'=>'dec')));
	}
	
	function convert($date){
		$converteddate = date("F j, Y g:ia", myStrtotime($date));
		return $converteddate;
	}

	function getResponses($q_id,$sort){
		$responses = "";
		$sql2 = mysql_query("SELECT * FROM responses WHERE q_id = '". $q_id ."' ORDER BY ". $sort ." DESC") or die(mysql_error());
		if(mysql_num_rows($sql2) == 0){
			$responses = "<div class='each-response grayed'>Il n’y a pas de réponses pour le moment.</div>";
		}else{
			while($row2 = mysql_fetch_assoc($sql2)){
				$score = $row2['r_vote'];
				$isview = $row2['r_view'];
				$color = "";
				$associated_view = "";
				if($score > 0){
					$color = "text-success";
				}else if($score < 0){
					$color = "text-danger";
				}else{
					$color = "grayed";
				}
				if($isview != NULL){
					$associated_view = "<a style='cursor:n-resize;' onclick='displayUserView(\"". $row2['r_view'] ."\",\"". $row2['r_scaleindicator'] ."\",\"". $row2['r_scalesdata'] ."\",\"". $row2['r_scalessdata'] ."\",\"". $row2['r_color'] ."\",\"". $row2['r_maxscale'] ."\",\"". $row2['r_scrutin'] ."\",\"". $row2['r_xindicator'] ."\",\"". $row2['r_xdata'] ."\",\"". $row2['r_xsdata'] ."\",\"". $row2['r_yindicator'] ."\",\"". $row2['r_ydata'] ."\",\"". $row2['r_ysdata'] ."\",\"". $row2['r_selectednodes'] ."\",\"". $row2['q_id'] ."\",false);'><span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span> Voir les paramètres graphiques associés à cette réponse.</a>";
				}
				$responses .= "<div class='each-response pull-left col-sm-12 no-padding-left'>
					<div class='vote-system text-center col-sm-2'>
						<div class='vote-up' style='margin-left:1px;' onclick='upVote(". $row2['r_vote'] .", ". $row2['id'] .", ". $row2['q_id'] .", ". $row2['r_total_votes'] .")'><span class='glyphicon glyphicon-chevron-up' aria-hidden='true'></span></div>
						<div class='vote-num ". $color ."'>". $row2['r_vote'] ."</div>
						<div class='vote-down' onclick='downVote(". $row2['r_vote'] .", ". $row2['id'] .", ". $row2['q_id'] .", ". $row2['r_total_votes'] .")'><span class='glyphicon glyphicon-chevron-down' aria-hidden='true'></span><br /></div>
						<div class='total-votes'><small>Total des votes:</small><br /><p class='num-total-votes'>". $row2['r_total_votes'] ."</p></div>
					</div>
					<div class='response-text col-sm-10'>
						<p class='author-name'><small>auteur&thinsp;:</small> ". $row2['r_author'] ."</p>
						<small>
						<u>". convert($row2['r_date']) ."</u>
						</small>
						<br /><br />
						<p class='the-response'>". $row2['r_text'] ."</p>
						<p><small> ". $associated_view ."</small></p>
					</div>
				</div>";
			}
		}
		return $responses;
	}

	function postResponses($id,$response,$author,$uuid){
		$response = mysql_real_escape_string(strip_tags($response));
		$author = mysql_real_escape_string(strip_tags($author));
		$sql = mysql_query("INSERT INTO responses (q_id, r_text, r_date, r_author, uuid) VALUES ('". $id ."','". $response ."',now(),'". $author ."', '". $uuid ."')") or die(mysql_error());
		$sql2 = mysql_query("UPDATE questions SET r_count = r_count + 1, q_popularity = q_popularity + 1 WHERE id = '". $id ."'") or die(mysql_error());
		return true;
	}
	function postResponsesWithSnapshot($id,$response,$author,$uuid,$view,$scaleindicator,$scalesdata,$scalessdata,$color,$maxscale,$scrutin,$xindicator,$xdata,$xsdata,$yindicator,$ydata,$ysdata,$selectednodes){
		$response = mysql_real_escape_string(strip_tags($response));
		$author = mysql_real_escape_string(strip_tags($author));
		$view = mysql_real_escape_string(strip_tags($view));
		$sql = mysql_query("INSERT INTO responses (q_id, r_text, r_date, r_author, uuid, r_view, r_scaleindicator, r_scalesdata, r_scalessdata, r_color, r_maxscale, r_scrutin, r_xindicator, r_xdata, r_xsdata, r_yindicator, r_ydata, r_ysdata, r_selectednodes) VALUES ('". $id ."','". $response ."',now(),'". $author ."', '". $uuid ."', '". $view ."', '". $scaleindicator ."', '". $scalesdata ."', '". $scalessdata ."', '". $color ."', '". $maxscale ."', '". $scrutin ."', '". $xindicator ."', '". $xdata ."', '". $xsdata ."', '". $yindicator ."', '". $ydata ."', '". $ysdata ."', '". $selectednodes ."')") or die(mysql_error());
		$sql2 = mysql_query("UPDATE questions SET r_count = r_count + 1, q_popularity = q_popularity + 1 WHERE id = '". $id ."'") or die(mysql_error());
		return true;
	}

	function updateVotes($id,$vote,$total,$q_id){
		$sql = mysql_query("UPDATE responses SET r_vote = '". $vote ."', r_total_votes = '". $total ."' WHERE id = '". $id ."'") or die(mysql_error());
		$sql2 = mysql_query("UPDATE questions SET r_votes = r_votes + 1, q_popularity = q_popularity + 1 WHERE id = '". $q_id ."'") or die(mysql_error());
		return true;
	}

	if((isset($_POST['action'])) && ($_POST['action'] == "post_response")){
		postResponses($_POST['q_id'],$_POST['response'],$_POST['author'],$_POST['uuid']);
	}

	if((isset($_POST['action'])) && ($_POST['action'] == "post_response_with_snapshot")){
		postResponsesWithSnapshot($_POST['q_id'],$_POST['response'],$_POST['author'],$_POST['uuid'],$_POST['view'],$_POST['scaleindicator'],$_POST['scalesdata'],$_POST["scalessdata"],$_POST['nodecolor'],$_POST['maxscale'],$_POST['scrutin'],$_POST['xindicator'],$_POST['xdata'],$_POST['xsdata'],$_POST['yindicator'],$_POST['ydata'],$_POST['ysdata'],$_POST['selectednodes']);
	}

	if((isset($_POST['action'])) && ($_POST['action'] == "post_vote")){
		updateVotes($_POST['id'],$_POST['vote'],$_POST['total'],$_POST['q_id']);
	}

	$sort = "";
	if(isset($_POST['sort'])){
		$sort = $_POST['sort'];
	}else{
		$sort = "r_date";
	}

	echo getResponses($q_id,$sort);
?>