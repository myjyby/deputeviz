<!DOCTYPE HTML>
<html>

<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
	<title>Question System</title>
	<script type="text/javascript" src="../libs/jquery.js"></script>
	<script type="text/javascript" src="../libs/d3.js"></script>

	<script type="text/javascript">

		$(document).ready(function(){
			$(".loader").hide()
				.ajaxStart(function(){
					$(this).show();
				})
				.ajaxStop(function(){
					$(this).hide();
				});

			$("#question-process").click(function(){
				var _user_name = $("#q-author-name").val();
				_user_name = _user_name.replace(/\s/g, '');
				if(_user_name.length === 0){
					_user_name = "Anonyme";
				}
				if($("#question-text").val() !== ""){
					$.post("questions.php?action=post",{ question: $("#question-text").val(), author: _user_name },function(data){
						$(".questions").html(data);
						$("#question-text").val("");
						$("#q-author-name").val("");
					});
				};
			});

			d3.selectAll(".q-sort")
				.on("mouseup",function(){
					var _sort = d3.select(this).attr("id");
					d3.selectAll(".q-sort")
						.attr("disabled",null);
					d3.select(this)
						.attr("disabled","disabled");

					$.post("questions.php?action=sort",{ sort: _sort },function(data){
						$(".questions").html(data);
					});
					return;
				});
		});

		function expandRESPONSES(el,id){
			d3.selectAll("div.response-container").remove();

			var _this = d3.select(el),
				_container = d3.select(".col-responses");

			d3.selectAll(".each-question.selected")
				.classed("selected",false);
			_this.classed("selected",true);

			var _row = _container.append("div")
				.attr("class","response-container");

			var _sort_buttons = _row.append("div")
				.attr("id","r-sort")
				.attr("class","btn-group col-sm-12 no-padding-left");

			_sort_buttons.append("div")
				.attr("class","btn btn-inverse btn-sm")
				.attr("disabled","disabled")
				.html("Trier par&thinsp;:");
			_sort_buttons.append("div")
				.attr("id","r_date")
				.attr("class","btn btn-default btn-sm r-sort")
				.attr("disabled","disabled")
				.html("Date");
			_sort_buttons.append("div")
				.attr("id","r_vote")
				.attr("class","btn btn-default btn-sm r-sort")
				.html("Score");
			_sort_buttons.append("div")
				.attr("id","r_total_votes")
				.attr("class","btn btn-default btn-sm r-sort")
				.html("Total des votes");


			_responses = _row.append("div")
				.attr("class","responses col-sm-12 no-padding-left");

			_responses.append("div")
				.attr("class","col-sm-12 text-center loader")
			.append("img")
				.attr("src","../img/loading.gif")
				.attr("width","30%");

			$.ajax({
				type: "POST",
				url: "responses.php",
				data: { q_id : id }
			})
			.done(function(txt){
				d3.select(".responses")
					.html(txt);
			});

			_row.append("div")
				.attr("class","lead col-sm-12 no-padding-left")
				.html("Votre réponse");

			var _author_input = _row.append("div")
					.attr("class","user-name form-group")
				.append("div")
					.attr("class","input-group");

			_author_input.append("div")
				.attr("class","input-group-addon")
				.html("Nom");

			_author_input.append("input")
				.attr("type","text")
				.attr("class","form-control")
				.attr("id","r-author-name");
				//.attr("placeholder","Votre nom ou pseudonyme");

			var _response_form = _row.append("div")
					.attr("class","response-form");

			_response_form.append("textarea")
				.attr("id","response-text")
				.attr("class","form-control no-radius-bottom")
				.attr("rows",3)
				.on("mouseup",function(){
					d3.event.stopPropagation();
				});

			_response_form.append("button")
				.attr("id","response-process")
				.attr("class","btn btn-default btn-xs no-radius-top")
				.html("Laissez votre résponse")
				.on("mouseup",function(){
					d3.event.stopPropagation();

					if($("#response-text").val() !== ""){
						var _user_name = $("#r-author-name").val();
						_user_name = _user_name.replace(/\s/g, '');
						if(_user_name.length === 0){
							_user_name = "Anonyme";
						}
						$.ajax({
							type: "POST",
							url: "responses.php",
							data: { q_id : id, response: $("#response-text").val(), author: _user_name, action: "post_response" }
						})
						.done(function(txt){
							d3.select(".responses")
								.html(txt);
							$("#response-text").val("");
							$("#r-author-name").val("");
						});
					};

					d3.select(".each-question.selected .question-stats .responses-count .large-num")
						.html(function(){
							var _num = d3.select(this).html();
							return parseInt(_num)+1;
						});
				});

			d3.selectAll(".r-sort")
				.on("mouseup",function(){
					var _sort = d3.select(this).attr("id");
					d3.selectAll(".r-sort")
						.attr("disabled",null);
					d3.select(this)
						.attr("disabled","disabled");

					$.ajax({
						type: "POST",
						url: "responses.php",
						data: { q_id: id, sort: _sort }
					})
					.done(function(txt){
						d3.select(".responses")
							.html(txt);
					});
					return;
				});

			return;
		};

		function upVote(val,id,q_id,tot){
			var _newval = +val + 1,
				_newtot = +tot + 1;
			$.ajax({
				type: "POST",
				url: "responses.php",
				data: { q_id: q_id, id: id, vote: _newval, total: _newtot, action: "post_vote" }
			})
			.done(function(txt){
				console.log(txt)
				d3.select(".responses")
					.html(txt);
			});

			d3.select(".each-question.selected .question-stats .votes-count .large-num")
				.html(function(){
					var _num = d3.select(this).html();
					return parseInt(_num)+1;
				});
			return;
		};

		function downVote(val,id,q_id,tot){
			var _newval = +val - 1,
				_newtot = +tot + 1;
			$.ajax({
				type: "POST",
				url: "responses.php",
				data: { q_id: q_id, id: id, vote: _newval, total: _newtot, action: "post_vote" }
			})
			.done(function(txt){
				d3.select(".responses")
					.html(txt);
			});

			d3.select(".each-question.selected .question-stats .votes-count .large-num")
				.html(function(){
					var _num = d3.select(this).html();
					return parseInt(_num)+1;
				});
			return;
		};

	</script>

	<link rel="stylesheet" type="text/css" href="../css/questions.system.css">
	<link rel="stylesheet" type="text/css" href="../css/bootstrap.css">

</head>

<body>

	<h2>Question system</h2><hr />

	<div class="container">

		<div class="col-sm-6 col-questions">

			<div class="question-container">

				<div class="lead col-sm-12 no-padding-left">Posez une nouvelle question</div>
				
				<div class="user-name form-group">
					<div class="input-group">
						<div class="input-group-addon">Nom</div>
						<input type="text" class="form-control" id="q-author-name" placeholder="Votre nom ou pseudonyme">
					</div>
				</div>
				

				<div class="question-form">
				
					<textarea id="question-text" class="form-control no-radius-bottom" rows="3" placeholder="Votre question"></textarea>

					<button id="question-process" class="btn btn-default btn-xs no-radius-top" />Posez votre question</button>

				</div>

				<div id="q-sort" class="btn-group col-sm-12 no-padding-left">
					<div class="btn btn-inverse btn-sm" disabled="disabled">Trier par&thinsp;: </div>
					<div id="q_date" class="btn btn-default btn-sm q-sort" disabled="disabled">Date</div>
					<div id="r_count" class="btn btn-default btn-sm q-sort">Nombre de réponses</div>
					<div id="r_votes" class="btn btn-default btn-sm q-sort">Nombre de votes</div>
					<div id="q_popularity" class="btn btn-default btn-sm q-sort no-radius-top-last-button">Activité totale</div>
				</div>

				<div class="questions">
					<div class="col-sm-12 text-center loader">
						<img src="../img/loading.gif" width="30%" />
					</div>
					<?php
						include_once("questions.php");
					?>
				</div>

			</div>

		</div>

		<div class="col-sm-6 col-responses">

		</div>

	</div>

</body>


</html>