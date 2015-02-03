function searching(){
	var keyWords=document.getElementById('search-form').value;
	keyWords=keyWords.replace(/([.*+?^=!:${}()|\[\]\/\\])/g," ");
	keyWords=keyWords.toLowerCase();
	keyWords=keyWords.split(",");

	if(keyWords!==""){
		d3.selectAll(".node").each(function(d){
			var _this=this;
			keyWords.forEach(function(kd){
				var idx={el:_this,match:false};
				var name=d.name.toLowerCase();
				if(name.indexOf(kd)!==-1){
					idx.match=true;
				};
		    	if(idx.match!==true){
		    		d3.select(_this)
		    			.classed("active-dot",false);
		    	}else{
	        		d3.select(_this)
	        			.moveToFront()
	        			.classed("active-dot",true);
	        		d3.selectAll(".label")
	        			.moveToFront();
		    	};
			});
		});
	}else{
		d3.selectAll(".node")
			.classed("active-dot",true);
		d3.selectAll(".label")
			.moveToFront();
	};

	// TRACE USER EVENT
	//console.log(["user","input","search-depute",keyWords.toString()])
	trace.event("user","input","search-depute",keyWords.toString());
	return;
};

function searchingSCRUTINS(){
	var keyWords=document.getElementById('scrutin-search-form').value;
	keyWords=keyWords.replace(/([.*+?^=!:${}()|\[\]\/\\])/g," ");
	keyWords=keyWords.toLowerCase();
	keyWords=keyWords.split(",");

	if(keyWords!==""){
		d3.selectAll(".scrutin-opt").each(function(d){

			var _this=this;
			keyWords.forEach(function(kd){
				var idx={el:_this,match:false};

				var desc=d.desc.toLowerCase(),
					sid=d.scrutin_id.toString();

				if(desc.indexOf(kd)!==-1){
					idx.match=true;
				}else if(sid.indexOf(kd)!==-1){
					idx.match=true;
				};
		    	if(idx.match !== true){
		    		d3.select(_this).hide();
		    	}
		    	else{
	        		d3.select(_this).show();
		    	};
			});
		});
	}else{
		d3.selectAll(".scrutin-opt")
			.show();
	};
	// TRACE USER EVENT
	//console.log(["user","input","search-scrutin",keyWords.toString()])
	trace.event("user","input","search-scrutin",keyWords.toString());
	return;
};