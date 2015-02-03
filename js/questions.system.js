function expandRESPONSES(id){
	d3.selectAll("div.response-container").remove();
	var question=d3.select(".each-question.q-"+id).select(".the-question").html();
    // TRACE USER EVENT
   	//console.log(["user","click","question","["+[getVIEW().toString(),question,"question-"+id]+"]"])
    trace.event("user","click","question","["+[getVIEW().toString(),question,"question-"+id]+"]");
    // TRACE SYSTEM EVENT
   	//console.log(["system","display","responses-system",false])
    trace.event("system","display","responses-system",false);

	var _this=d3.select(".each-question.q-"+id),
		container=d3.select(".col-responses");

	d3.selectAll(".each-question.selected").unSelected();
	_this.isSelected();

	var row=container.append("div")
		.attr("class","response-container");

	row.append("blockquote")
		.html("<small>Commentaire ou question&thinsp;:</small> «&thinsp;"+question+"&thinsp;»");

	var sort_buttons=row.append("div")
		.attr("id","r-sort")
		.attr("class","btn-group col-sm-12 no-padding-left");

	sort_buttons.append("div")
		.attr("class","btn btn-inverse btn-sm")
		.attr("disabled","disabled")
		.html("Trier par&thinsp;:");
	sort_buttons.append("div")
		.attr("id","r_date")
		.attr("class","btn btn-default btn-sm r-sort")
		.attr("disabled","disabled")
		.html("Date");
	sort_buttons.append("div")
		.attr("id","r_vote")
		.attr("class","btn btn-default btn-sm r-sort")
		.html("Score");
	sort_buttons.append("div")
		.attr("id","r_total_votes")
		.attr("class","btn btn-default btn-sm r-sort")
		.html("Total des votes");

	responses=row.append("div")
		.attr("class","responses col-sm-12 no-padding-left");

	responses.append("div")
		.attr("class","col-sm-12 text-center loader")
	.append("img")
		.attr("src","img/loading.gif")
		.attr("width","30%");

	$.ajax({
		type:"POST",
		url:"question_system/responses.php",
		data:{q_id:id}
	})
	.done(function(txt){
		d3.select(".responses")
			.html(txt);
	    // TRACE SYSTEM EVENT
	   	//console.log(["system","display","responses",true])
	    trace.event("system","display","responses",true);
	    return;
	});

	row.append("div")
		.attr("class","lead col-sm-12 no-padding-left")
		.html("Répondez à ce commentaire ou à cette question");

	var author_input=row.append("div")
			.attr("class","user-name form-group")
		.append("div")
			.attr("class","input-group");

	author_input.append("div")
		.attr("class","input-group-addon")
		.html("Nom");

	author_input.append("input")
		.attr("type","text")
		.attr("class","form-control")
		.attr("id","r-author-name")
		.attr("placeholder","Votre nom ou pseudonyme");

	// CHECK THAT USER CAN ADD A SNAPSHOT
	if(_show_snapshots){
		var snapshot=row.append("div")
				.attr("class","r-snapshot snapshot btn btn-default btn-xs")
				.html("<span class='glyphicon glyphicon-camera' aria-hidden='true'></span> Cliquez ici pour associer les paramètres du graphique à vôtre réponse.")
				.on("click",function(){
					// TRACE USER EVENT
					trace.event("user","click","snapshot",true);
					d3.select(this)
						.isSelected();
					return;
				});
	};

	var response_form=row.append("div")
			.attr("class","response-form");

	response_form.append("textarea")
		.attr("id","response-text")
		.attr("class","form-control no-radius-bottom no-radius-top-left")
		.attr("rows",3)
		.attr("placeholder","Votre réponse")
		.on("click",function(){
			d3.event.stopPropagation();
		});

	response_form.append("button")
		.attr("id","response-process")
		.attr("class","btn btn-default btn-xs no-radius-top")
		.html("Laissez votre résponse")
		.on("click",function(){
			d3.event.stopPropagation();

			if($("#response-text").val()!==""){
				var user_name=$("#r-author-name").val();
				//user_name=user_name.replace(/\s/g, '');
				if(user_name.length===0){
					user_name="Anonyme";
				}
			    // TRACE USER EVENT
			   	//console.log(["user","click","submit-response","["+[getVIEW().toString(),user_name,$("#response-text").val(),"question-"+id]+"]"])
			    trace.event("user","click","submit-response","["+[getVIEW().toString(),user_name,$("#response-text").val(),"question-"+id]+"]");
			    // SEND THE USER’S RESPONSE
			    var data_pack={q_id:id,response:$("#response-text").val(),author:user_name,action:"post_response",uuid:sessionId};
				// IF THE USER HAS CHOSEN TO TAKE A SNAPSHOT OF THE VISUALIZATION
				if(_show_snapshots && d3.select(".r-snapshot").classed("selected")===true){
					var selected_nodes=new Array();
					d3.selectAll(".active-dot").each(function(d,i){
						var node_class=d3.select(this).attr("class"),
							node_id=node_class.split("node-")[1];
						selected_nodes.push("node-"+parseInt(node_id));
						return;
					});
					var vsindicator=getSCALES()[1],
						vsdata=getSCALES()[2],
						vssdata=getSCALES()[3],
						vxindicator=getXRANGE()[0],
						vxdata=getXRANGE()[1],
						vxsdata=getXRANGE()[2],
						vyindicator=getYRANGE()[0],
						vydata=getYRANGE()[1],
						vysdata=getYRANGE()[2];
					// CONVERT TO STRING
					if(vsindicator===undefined){vsindicator="undefined";}else if(vsindicator===null){vsindicator="null";};
					if(vsdata===undefined){vsdata="undefined";}else if(vsdata===null){vsdata="null";};
					if(vssdata===undefined){vssdata="undefined";}else if(vssdata===null){vssdata="null";};

					if(vxindicator===undefined){vxindicator="undefined";}else if(vxindicator===null){vxindicator="null";};
					if(vxdata===undefined){vxdata="undefined";}else if(vxdata===null){vxdata="null";};
					if(vxsdata===undefined){vxsdata="undefined";}else if(vxsdata===null){vxsdata="null";};

					if(vyindicator===undefined){vyindicator="undefined";}else if(vyindicator===null){vyindicator="null";};
					if(vydata===undefined){vydata="undefined";}else if(vydata===null){vydata="null";};
					if(vysdata===undefined){vysdata="undefined";}else if(vysdata===null){vysdata="null";};

					data_pack={q_id:id,response:$("#response-text").val(),author:user_name,action:"post_response_with_snapshot",uuid:sessionId,view:getVIEW(),scaleindicator:vsindicator,scalesdata:vsdata,scalessdata:vssdata,nodecolor:getCOLORS(),maxscale:getSCALERANGE(),scrutin:getSCRUTIN(),xindicator:vxindicator,xdata:vxdata,xsdata:vxsdata,yindicator:vyindicator,ydata:vydata,ysdata:vysdata,selectednodes:selected_nodes.toString()};
				};
				$.ajax({
					type: "POST",
					url: "question_system/responses.php",
					data: data_pack
				})
				.done(function(txt){
		        	// TRACE SYSTEM EVENT
		        	//console.log(["system","post","response-form",true])
		        	trace.event("system","post","response-form",true);
					d3.select(".responses")
						.html(txt);
					d3.select(".snapshot").classed("selected",false);
					$("#response-text").val("");
					$("#r-author-name").val("");
			       	// TRACE SYSTEM EVENT
			       	//console.log(["system","clear","response-form",true])
			        trace.event("system","clear","response-form",true);
			        return;
				});
			};

			d3.select(".each-question.selected .question-stats .responses-count .large-num")
				.html(function(){
					var num=d3.select(this).html();
					// TRACE SYSTEM EVENT
					//console.log(["system","update","question-response-num","["+num+",question-"+id+"]"])
					trace.event("system","update","question-response-num","["+num+",question-"+id+"]");
					return parseInt(num)+1;
				});
		});

	d3.selectAll(".r-sort")
		.on("mouseup",function(){
			var _sort = d3.select(this).attr("id");
			d3.selectAll(".r-sort")
				.attr("disabled",null);
			d3.select(this)
				.attr("disabled","disabled");

			var sort_id=this.id;
			$.ajax({
				type: "POST",
				url: "question_system/responses.php",
				data: {q_id:id,sort:_sort}
			})
			.done(function(txt){
				d3.select(".responses")
					.html(txt);
				// TRACE SYSTEM EVENT
				//console.log(["system","post","sort-responses",true])
				trace.event("system","post","sort-responses",true);
				return;
			});
			return;
		});
    // TRACE SYSTEM EVENT
   	//console.log(["system","display","response-system",true])
    trace.event("system","display","response-system",true);
	return;
};

function upVote(val,id,q_id,tot){
	var newval=+val+1,
		newtot=+tot+1;
    // TRACE USER EVENT
   	//console.log(["user","click","upvote","["+[getVIEW().toString(),"response-"+id,newval,"question-"+q_id]+"]"])
    trace.event("user","click","upvote","["+[getVIEW().toString(),"response-"+id,newval,"question-"+q_id]+"]");

	$.ajax({
		type:"POST",
		url:"question_system/responses.php",
		data:{q_id:q_id,id:id,vote:newval,total:newtot,action: "post_vote" }
	})
	.done(function(txt){
		d3.select(".responses")
			.html(txt);
		// TRACE SYSTEM EVENT
		//console.log(["system","post","upvote",true])
		trace.event("system","post","upvote",true);
		return;
	});

	d3.select(".each-question.selected .question-stats .votes-count .large-num")
		.html(function(){
			var num=d3.select(this).html();
			// TRACE SYSTEM EVENT
			//console.log(["system","update","vote-num","["+[(+num+1),"response-"+id]+"]"])
			trace.event("system","update","vote-num","["+[(+num+1),"response-"+id]+"]");
			return parseInt(num)+1;
		});
	return;
};

function downVote(val,id,q_id,tot){
	var newval=+val-1,
		newtot=+tot+1;
    // TRACE USER EVENT
   	//console.log(["user","click","downvote","["+[getVIEW().toString(),"response"+id,newval,"question-"+q_id]+"]"])
    trace.event("user","click","downvote","["+[getVIEW().toString(),"response"+id,newval,"question-"+q_id]+"]");
	$.ajax({
		type:"POST",
		url:"question_system/responses.php",
		data:{q_id:q_id,id:id,vote:newval,total:newtot,action:"post_vote"}
	})
	.done(function(txt){
		d3.select(".responses")
			.html(txt);
		// TRACE SYSTEM EVENT
		//console.log(["system","post","downvote",true])
		trace.event("system","post","downvote",true);
		return;
	});

	d3.select(".each-question.selected .question-stats .votes-count .large-num")
		.html(function(){
			var num = d3.select(this).html();
			// TRACE SYSTEM EVENT
			//console.log(["system","update","vote-num","["+[(+num+1),"response-"+id]+"]"])
			trace.event("system","update","vote-num","["+[(+num+1),"response-"+id]+"]");
			return parseInt(num)+1;
		});
	return;
};