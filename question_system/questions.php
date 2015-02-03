<?php
	include_once("connect.php");

	$show_snapshot = false;

	function myStrtotime($date_string){ 
		return strtotime(strtr(strtolower($date_string), array('janvier'=>'jan','février'=>'feb','mars'=>'march','avril'=>'apr','mai'=>'may','juin'=>'jun','juillet'=>'jul','août'=>'aug','septembre'=>'sep','octobre'=>'oct','novembre'=>'nov','décembre'=>'dec')));
	}
	
	function convert($date){
		$converteddate = date("F j, Y g:ia", myStrtotime($date));
		return $converteddate;
	}

	function getQuestions($sort,$cID){
		$questions = "";
		$sql = mysql_query("SELECT * FROM questions WHERE c_id = '". $cID ."' ORDER BY ". $sort ." DESC") or die(mysql_error());
		if(mysql_num_rows($sql) == 0){
			$questions = "<div class='btn btn-block btn-default  no-radius each-question grayed'>Il n’y a pas de questions pour le moment</div>";
		}else{
			while($row = mysql_fetch_assoc($sql)){	
				$isview = $row['q_view'];
				$associated_view = "";
				if($isview != NULL){
					$associated_view = "<span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span> <span class='associated-view-info'>Des paramètres graphiques sont associés à ce commentaire ou cette question.</span>";
				
					$questions .= "<div class='btn btn-block btn-default no-radius each-question col-sm-12 q-". $row['id'] ."' onclick='expandRESPONSES(\"". $row['id'] ."\"); displayUserQuestionView(\"". $row['q_view'] ."\",\"". $row['q_scaleindicator'] ."\",\"". $row['q_scalesdata'] ."\",\"". $row['q_scalessdata'] ."\",\"". $row['q_color'] ."\",\"". $row['q_maxscale'] ."\",\"". $row['q_scrutin'] ."\",\"". $row['q_xindicator'] ."\",\"". $row['q_xdata'] ."\",\"". $row['q_xsdata'] ."\",\"". $row['q_yindicator'] ."\",\"". $row['q_ydata'] ."\",\"". $row['q_ysdata'] ."\",\"". $row['q_selectednodes'] ."\",\"". $row['id'] ."\");updateVIEWFEEDBACK(this)'>
							<div class='question-stats text-center col-sm-2'>
								<div class='responses-count'><span class='large-num'>". $row['r_count'] ."</span><br /><small>réponses</small></div>
								<div class='separator'></div>
								<div class='votes-count'><span class='large-num'>". $row['r_votes'] ."</span><br /><small>votes</small></div>
							</div>
							<div class='question-text col-sm-10'>
								<p class='author-name'>
									<small>auteur&thinsp;:</small> ". $row['q_author'] ."
									<span class='pull-right text-right'><a href='https://twitter.com/share' class='twitter-share-button' data-url='http://deputeviz.fr/index.php?v=". $row['id'] ."' data-hashtags='deputeviz' data-text='". $row['q_text'] ."'>Tweet</a>
										<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
									</span>
								</p>
								<small>
								<u>". convert($row['q_date']) ."</u>
								</small>
								<br /><br />
								<p class='the-question'>". $row['q_text'] ."</p>
								<p><small> ". $associated_view ."</small></p>
							</div>
					</div>";
				}else{
					$questions .= "<div class='btn btn-block btn-default no-radius each-question col-sm-12 q-". $row['id'] ."' onclick='expandRESPONSES(\"". $row['id'] ."\");'>
							<div class='question-stats text-center col-sm-2'>
								<div class='responses-count'><span class='large-num'>". $row['r_count'] ."</span><br /><small>réponses</small></div>
								<div class='separator'></div>
								<div class='votes-count'><span class='large-num'>". $row['r_votes'] ."</span><br /><small>votes</small></div>
							</div>
							<div class='question-text col-sm-10'>
								<p class='author-name'>
									<small>auteur&thinsp;:</small> ". $row['q_author'] ."
									<span class='pull-right text-right'><a href='https://twitter.com/share' class='twitter-share-button' data-url='http://deputeviz.fr' data-hashtags='deputeviz' data-text='". $row['q_text'] ."'>Tweet</a>
										<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
									</span>
								</p>
								<small>
								<u>". convert($row['q_date']) ."</u>
								</small>
								<br /><br />
								<p class='the-question'>". $row['q_text'] ."</p>
							</div>
					</div>";
				}
			}
		}
		return $questions;
	}

	function postQuestions($question,$author,$cID,$uuid){
		$question = mysql_real_escape_string(strip_tags($question));
		$author = mysql_real_escape_string(strip_tags($author));
		$sql = mysql_query("INSERT INTO questions (q_text, q_author, q_date, c_id, uuid) VALUES ('". $question ."', '". $author ."', now(), '". $cID ."', '". $uuid ."')");
		return true;
	}

	function postQuestionsWithSnapshot($cID,$question,$author,$uuid,$view,$scaleindicator,$scalesdata,$scalessdata,$color,$maxscale,$scrutin,$xindicator,$xdata,$xsdata,$yindicator,$ydata,$ysdata,$selectednodes){
		$question = mysql_real_escape_string(strip_tags($question));
		$author = mysql_real_escape_string(strip_tags($author));
		$view = mysql_real_escape_string(strip_tags($view));
		$sql = mysql_query("INSERT INTO questions (c_id, q_text, q_date, q_author, uuid, q_view, q_scaleindicator, q_scalesdata, q_scalessdata, q_color, q_maxscale, q_scrutin, q_xindicator, q_xdata, q_xsdata, q_yindicator, q_ydata, q_ysdata, q_selectednodes) VALUES ('". $cID ."', '". $question ."',now(),'". $author ."', '". $uuid ."', '". $view ."', '". $scaleindicator ."', '". $scalesdata ."', '". $scalessdata ."', '". $color ."', '". $maxscale ."', '". $scrutin ."', '". $xindicator ."', '". $xdata ."', '". $xsdata ."', '". $yindicator ."', '". $ydata ."', '". $ysdata ."', '". $selectednodes ."')") or die(mysql_error());
		return true;
	}

	if((isset($_POST['action'])) && ($_POST['action'] == "post")){
		postQuestions($_POST['question'],$_POST['author'],$_POST['c_id'],$_POST['uuid']);
	}

	if((isset($_POST['action'])) && ($_POST['action'] == "post_question_with_snapshot")){
		postQuestionsWithSnapshot($_POST['c_id'],$_POST['question'],$_POST['author'],$_POST['uuid'],$_POST['view'],$_POST['scaleindicator'],$_POST['scalesdata'],$_POST["scalessdata"],$_POST['nodecolor'],$_POST['maxscale'],$_POST['scrutin'],$_POST['xindicator'],$_POST['xdata'],$_POST['xsdata'],$_POST['yindicator'],$_POST['ydata'],$_POST['ysdata'],$_POST['selectednodes']);
	}

	$sort = "";
	if(isset($_POST['sort'])){
		$sort = $_POST['sort'];
	}else{
		$sort = "q_date";
	}

	$cID = "";
	if(isset($_POST['c_id'])){
		$cID = $_POST['c_id'];
	}else{
		$cID = 0;
	}

	echo getQuestions($sort,$cID);
?>