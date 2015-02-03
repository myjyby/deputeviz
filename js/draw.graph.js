// MAIN FUCNTION FROM TUTORIAL AT
// http://www.delimited.io/blog/2013/12/19/force-bubble-charts-in-d3

// ------------------------------------------------------------------------- //
// PUBLIC VARIABLES -------------------------------------------------------- //
// ------------------------------------------------------------------------- //
// CREATE A PLACEHOLDER TO STORE THE DATA INTIALLY LOADED
var _global_data;
// SHOULD THE LATEST ACTIVITY WITH DIRECT 
//ACCESS TO VIEWS BE ADDED?
var _show_question_system=true,
	_show_snapshots=true,
	_show_prompter=true;
if(!_show_question_system){
	_show_snapshots=false;
	_show_prompter=false;
}
// DETERMINE GENERIC NODE SIZE
// AND PADDING TO RESPECT WHEN BUNDELING
// THE NODE BALLS 
var _node_size=7.5,
	padding=2;
// SET SCALE RANGE FOR NOES 
// (APPLIES WHEN A SPECIFIC SCALE IS SELECTED BY THE USER)
var _scale=d3.scale.linear()
	//.domain(d3.extent(_recettes_totales_recettes_millions))
	.range([1,_node_size]);
// DETERMINE SVG FEATURES
var f_width=1110, 
	f_height=600,
	f_padding=39,
	width=f_width - f_padding,
	height=f_height - f_padding,
	shiftKey;
// DETERMINE THE PROJECTION FOR THE MAP
var projection=d3.geo.mercator()
	    .center([3,46.5])
	    .scale(2250)
	    .translate([width/2, height/2]);
var path=d3.geo.path()
    	.projection(projection);
// DETERMINE A FORCE LAYOUT
var force=d3.layout.force();
// DETERMINE THE DRAGGING SCALE
// AND RANGE FOR THE SCALE SLIDER AND
// CHECK FOR USER DRAG (NOT AUTOMATIC ON VIEW CHANGE)
// OF THE SCALE SLIDER
var _drag = d3.behavior.drag()
		.origin(0)
		.on("dragstart",dragstart)
		.on("drag",dragmove)
		.on("dragend",dragend),
	_slider_thumb_min_width = 5,
	_slider_thumb_max_width = 20,
	_slider_thumb_scale = d3.scale.linear()
		.range([_slider_thumb_min_width,_slider_thumb_max_width]),
	_scale_thumb_drag=false;
// DETERMINE SCATTERPLOT FEATURES
var _scatter_p=50,
	_scatter_w=f_width-_scatter_p * 2,
	_scatter_h=height-_scatter_p,
	_scatter_x = d3.scale.linear()
    	.range([_scatter_p, _scatter_w]),
	_scatter_y = d3.scale.linear()
    	.range([_scatter_h, 0]),
    _commasFormatter = d3.format(".0f"),
	_xAxis = d3.svg.axis()
    	.scale(_scatter_x)
    	.tickFormat(function(d){return _commasFormatter(d);})
    	.orient("bottom"),
	_yAxis = d3.svg.axis()
    	.scale(_scatter_y)
    	.tickFormat(function(d){return _commasFormatter(d);})
    	.orient("left");
// DETERMINE ALL DEPARTEMENTS IN FRANCE METROPOLITAINE
var _dep_metropole = ["Ain","Aisne","Allier","Alpes-de-Haute-Provence","Hautes-Alpes","Alpes-Maritimes","Ardèche","Ardennes","Ariège","Aube","Aude","Aveyron","Bouches-du-Rhône","Calvados","Cantal","Charente","Charente-Maritime","Cher","Corrèze","Côte-d’Or","Côtes-d’Armor","Creuse","Dordogne","Doubs","Drôme","Eure","Eure-et-Loir","Finistère","Corse-du-Sud","Haute-Corse","Gard","Haute-Garonne","Gers","Gironde","Hérault","Ille-et-Vilaine","Indre","Indre-et-Loire","Isère","Jura","Landes","Loir-et-Cher","Loire","Haute-Loire","Loire-Atlantique","Loiret","Lot","Lot-et-Garonne","Lozère","Maine-et-Loire","Manche","Marne","Haute-Marne","Mayenne","Meurthe-et-Moselle","Meuse","Morbihan","Moselle","Nièvre","Nord","Oise","Orne","Pas-de-Calais","Puy-de-Dôme","Pyrénées-Atlantiques","Hautes-Pyrénées","Pyrénées-Orientales","Bas-Rhin","Haut-Rhin","Rhône","Haute-Saône","Saône-et-Loire","Sarthe","Savoie","Haute-Savoie","Paris","Seine-Maritime","Seine-et-Marne","Yvelines","Deux-Sèvres","Somme","Tarn","Tarn-et-Garonne","Var","Vaucluse","Vendée","Vienne","Haute-Vienne","Vosges","Yonne","Territoire-de-Belfort","Essonne","Hauts-de-Seine","Seine-Saint-Denis","Val-de-Marne","Val-d’Oise"];

// ------------------------------------------------------------------------- //
// GENERIC FUNCTIONS ------------------------------------------------------- //
// ------------------------------------------------------------------------- //
// MOVE TO DOM-NODE TO FRONT
d3.selection.prototype.moveToFront=function(){
	return this.each(function(){
		var this_node=d3.select(this)[0][0].nodeName,
			this_class=d3.select(this).attr("class"),
			this_node=this_node+"."+this_class;
		// TRACE SYSTEM EVENT
		////console.log(["system","move-to-front","dom-node",this_node])
		//trace.event("system","move-to-front","dom-node",this_node);
		return this.parentNode.appendChild(this);
	});
};
// HIDE A DOM-NODE
d3.selection.prototype.hide=function(){
	return this.each(function(){
		var this_node=d3.select(this)[0][0].nodeName,
			this_class=d3.select(this).attr("class"),
			this_node=this_node+"."+this_class;
		// TRACE SYSTEM EVENT
		////console.log(["system","display","dom-node","["+[this_node,false]+"]"])
		//trace.event("system","display","dom-node","["+[this_node,false]+"]");
		return d3.select(this).classed("hide",true);
	});
};
// SHOW A DOM-NODE
d3.selection.prototype.show=function(){
	return this.each(function(){
		var this_node=d3.select(this)[0][0].nodeName,
			this_class=d3.select(this).attr("class"),
			this_node=this_node+"."+this_class;
		// TRACE SYSTEM EVENT
		////console.log(["system","display","dom-node","["+[this_node,true]+"]"])
		//trace.event("system","display","dom-node","["+[this_node,true]+"]");
		return d3.select(this).classed("hide",false);
	});
};
// DETERMINE DOM-NODE AS SELECTED
d3.selection.prototype.isSelected=function(){
	return this.each(function(){
		var this_node=d3.select(this)[0][0].nodeName,
			this_class=d3.select(this).attr("class"),
			this_node=this_node+"."+this_class;
		// TRACE SYSTEM EVENT
		////console.log(["system","set","dom-node-selected","["+[this_node,true]+"]"])
		//trace.event("system","set","dom-node-selected","["+[this_node,true]+"]");
		return d3.select(this).classed("selected",true);
	});
};
// DETERMINE DOM-NODE AS UNSELECTED
d3.selection.prototype.unSelected=function(){
	return this.each(function(){
		var this_node=d3.select(this)[0][0].nodeName,
			this_class=d3.select(this).attr("class"),
			this_node=this_node+"."+this_class;
		// TRACE SYSTEM EVENT
		////console.log(["system","set","dom-node-selected","["+[this_node,false]+"]"])
		//trace.event("system","set","dom-node-selected","["+[this_node,false]+"]");
		return d3.select(this).classed("selected",false);
	});
};
// STRIP A STRING FROM SUPERFICIAL CHARACTERS
function stripStr(str){
	return str.toLowerCase().replace(/[`’~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
};
// STRIP A STRING FROM SUPERFICIAL CHARACTERS FOR USE AS A CLASS ATTRIBUTE
function toClassStr(str){
	return str.replace('M. ', '').replace('Mme. ', '').toLowerCase().replace(/[`’~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s+/g, '');
};
// CAPITALIZE FIRST LETTER
String.prototype.capitalize=function(){
    return this.charAt(0).toUpperCase()+this.slice(1);
};

// ------------------------------------------------------------------------- //
// RETRIEVE VALUES FUNCTIONS ----------------------------------------------- //
// ------------------------------------------------------------------------- //
function getSCALES(){
	var vindicator=$(".scale.selected").data("d"),
		sdata=$(".scale.selected").data("sd"),
		ssdata=$(".scale.selected").data("ssd");
	return [_global_data,vindicator,sdata,ssdata];
};

function getSCALERANGE(){
	var maxscale=parseFloat(d3.select(".slider-thumb").style("margin-left"));
	return maxscale;
};

function getXRANGE(){
	var vindicator=$(".x-range.selected").data("d"),
		sdata=$(".x-range.selected").data("sd"),
		ssdata=$(".x-range.selected").data("ssd");
	return [vindicator,sdata,ssdata];
};

function getYRANGE(){
	var vindicator=$(".y-range.selected").data("d"),
		sdata=$(".y-range.selected").data("sd"),
		ssdata=$(".y-range.selected").data("ssd");
	return [vindicator,sdata,ssdata];
};

function getCOLORS(){
	var vindicator=d3.select(".color.selected").attr("id").toLowerCase();
	return vindicator;
};

function getVIEW(){
	var active_view=d3.select(".view.selected").attr("id");
	return active_view;
};

function getSCRUTIN(){
	var active_scrutin=d3.select(".scrutin-opt.selected").datum(),
		active_scrutin_id=active_scrutin.scrutin_id;
	return active_scrutin_id;
};

function isSetSCATTERPLOT(){
	var x_selection=$(".x-range.selected").data("d"),
		y_selection=$(".y-range.selected").data("d");
	if(x_selection===null && y_selection===null){
		return false;
	}else{
		return true;
	};
};

function keyflip() {
  shiftKey=d3.event.shiftKey||d3.event.metaKey;
  return;
};

// ------------------------------------------------------------------------- //
// BACKGROUND DRAWING FUNCTIONS -------------------------------------------- //
// ------------------------------------------------------------------------- //
// DRAW THE SVG CONATINER THAT WILL CONTAIN 
// ALL THE GRAPHICAL ELEMENTS
function drawSVG(){
	// SET A LISTENER ON THE BODY LEVEL FOR SHIFT KEY DOWN
	// TO MAKE MULTIPLE SELECTIONS AND
	// ADD AN SVG CONTAINER TO THE #canvas DIV
	var svg = d3.select("body")
		.attr("tabindex",1)
		.on("keydown.brush",keyflip)
		.on("keyup.brush",keyflip)
		.select("#canvas")
	.append("svg")
		.attr("id","svg-canvas")
		.attr("width",f_width)
		.attr("height",f_height);
	// ADD THE MAIN GROUP (WHERE ALL OTHER GROUPS GO)
	// AND FIRST ADD THE NODES GROUP TO IT (USED TO BE .bubbles)
	var main_group = svg.append("g")
		.attr("class","main-group")
		.attr("transform","translate("+[0,f_padding]+")");
	main_group.append("g")
		.attr("class","nodes");
	// ADD DATA ORIGIN NOTE AT THE BOTTOM
	main_group.insert("foreignObject",".nodes")
		.attr("width",f_width)
		.attr("height",22)
		.attr("x",0)
		.attr("y",f_height-f_padding/2)
		.attr("transform","translate("+[0,-f_padding]+")")
	.append("xhtml:body")
		.attr("class","f-obj-body text-center noselect")
		.html("<small>Toutes les données (sauf contre-indication) furent extraites du site de <a href='http://www.assemblee-nationale.fr/qui/xml/liste_alpha.asp?legislature=14' target='_blank'>l’Assemblée Nationale</a> en décembre 2014.</small>");
	// ADD THE SELECTALL DEPUTES BUTTON
	svg.append("foreignObject")
		.attr("width",f_width)
		.attr("height",30)
		.attr("x",0)
		.attr("y",-1)
		//.attr("transform","translate("+[0,-f_padding]+")")
	.append("xhtml:body")
		.attr("class","f-obj-body select-all-button")
		.hide()
	.append("div")
		.attr("class","text-center")
	.append("div")
		.attr("class","btn btn-default btn-xs select-all-deputes")
		.html("Selectionnez tous les députés")
		.on("click",function(){
			// TRACE USER EVENT
			//console.log(["user","click","select-all-nodes",true])
			trace.event("user","click","select-all-nodes",true);
			d3.selectAll(".node")
				.classed("active-dot",true);
			d3.select(".select-all-button").hide();
			return;
		});

	// TRACE SYSTEM EVENT
	//console.log(["system","draw","svg",true])
	trace.event("system","draw","svg",true);
	return;
};
// DRAW THE HEMICYCLE BACKGROUND
function drawHEMICYCLE(num){
	// ADD A GROUP FOR THE HEMISPHERE DRAWING 
	// BELOW THE DEPUTE NODES
	var svg = d3.select(".main-group")
			.insert("g",".nodes")
			.attr("class","hemicycle")
			.attr("transform","translate(" + [129,-22] + ")");
	// DRAW THE HEMICYCLE BASED ON THE DATA
	// IN /img/hemicycle.data.js
	svg.html(function(){
		var sieges=d3.select("#hemicycle-svg").html();
		d3.select("#hemicycle-svg").remove();
		return sieges;
	});
	// ADD AN ANNOTATION MENTIONNING
	// THERE ARE 577 DEPUTES
	svg.append("text")
		.attr("x",f_width/2-132)
		.attr("y",height-f_padding*2+7)
		.attr("class","svg-title noselect")
		.attr("text-anchor","middle")
		.text(/*num*/577);
	svg.append("text")
		.attr("x",f_width/2-132)
		.attr("y",height-f_padding*2+39)
		.attr("class","svg-sub-title noselect")
		.attr("text-anchor","middle")
		.text("députés");
	// TRACE SYSTEM EVENT
	//console.log(["system","draw","hemicycle-bg",true])
	trace.event("system","draw","hemicycle-bg",true);
	return;
};
// DRAW THE MAP BACKGROUND
function drawMAP(){
	// ADD A GROUP FOR THE MAP CONTOURS
	// BELOW THE DEPUTE NODES AND SET IT
	// TO DISPLAY NONE, SINCE IT IS NOT
	// IN THE FIRST VIEW (THIS MAY CHANGE
	// IF WE GIVE QUESTION/ANSWER AUTHORS
	// THE OPPORTUNITY TO MARK THE STATE 
	// OF THEIR VISUALIZATION
	var svg=d3.select(".main-group")
			.insert("g",".nodes")
			.attr("class","map")
			.hide();
	// ADD A CIRCLE CONTOUR FOR THE DOM-TOM
	svg.append("circle")
		.attr("class","outre-mer-circle")
		.attr("cx",175)
		.attr("cy",300)
		.attr("r",55);
	// ADD A LABEL FOR THE CIRCLE
	// LINE 1
	svg.append("text")
		.attr("class","noselect")
		.attr("x",175)
		.attr("y",385)
		.attr("text-anchor","middle")
		.text("Départements et Territoires");
	// LINE 2
	svg.append("text")
		.attr("class","noselect")
		.attr("x",175)
		.attr("y",405)
		.attr("text-anchor","middle")
		.text("d’Outre-Mer (DOM-TOM),");
	// LINE 3
	svg.append("text")
		.attr("class","noselect")
		.attr("x",175)
		.attr("y",425)
		.attr("text-anchor","middle")
		.text("et Étranger");
	// LOAD THE MAP DATA
	d3.json("data/fr.dep.json",function(error,fr){
	  if (error) return //console.log(["system","load","map-data",false]);
	  	// DRAW THE MAP BASED ON THE DATA
		svg.selectAll(".map-borders")
			.data(topojson.feature(fr,fr.objects.departements).features)
			.enter()
			.append("path")
			.attr("class", function(d){ 
				return "map-borders "+stripStr(d.properties.name);
			})
			.attr("d", path)
			.each(function(d){
				// FOR EACH DEPARTEMENT, ADD AN INVISIBLE
				// CIRCLE THAT WHEN HOVERED OVER
				// WILL DISPLAY A SUMMARY PIECHART VIEW

				// DETERMINE WHERE AND HOW BIG THE
				// CIRCLE SHOULD BE TO BEST FIT IN 
				// THE DRAWING OF THE DEPARTEMENT
				var bbox=d3.select(this).node().getBBox(),
					w=bbox.width,
					h=bbox.height,
					r=d3.min([w,h]);
				// ADD THE CIRCLES BELOW THE DRAWING
				// OF THE DEPARTEMENT
				var top_level = d3.select(".map")
					.insert("circle",".map-borders")
					.datum({ind:"departement",name:stripStr(d.properties.name),full_name:d.properties.name})
					.attr("class","map-centroids")
					.attr("cx",path.centroid(d)[0])
					.attr("cy",path.centroid(d)[1])
					.attr("r",r/3)
					.style("fill","none")
					.style("stroke","transparent")
					.style("stroke-width",15)
					// ON MOUSE HOVER ADD AND REMOVE
					// THE SUMMARY PIE CHART
					.on("mouseover",showPIE)
					.on("mouseout",removePIE);
				return;
			});
		// TRACE SYSTEM EVENT
		//console.log(["system","load","map-data",true]);
		trace.event("system","load","map-data",true);
		return;
	});
	// TRACE SYSTEM EVENT
	//console.log(["system","draw","map-bg",true])
	trace.event("system","draw","map-bg",true);
	return;
};
// DRAW THE SCATTERPLOT ENVIRONMENT
function drawSCATTERPLOT(){
	// SET THE DOMAINS FOR THE AXES
	_scatter_x.domain([0,0]).nice();
  	_scatter_y.domain([0,0]).nice();
  	// ADD A GROUP FOR THE SCATTERPLOT
  	// BELOW THE NODES
	var svg=d3.select(".main-group")
			.insert("g",".nodes")
			.attr("class","scatterplot sp")
			.hide();
	// CREATE THE X AXIS
	// AND THE X AXIS DATA SELECTOR
	svg.append("g")
		.attr("class","x axis")
		.attr("transform","translate("+[0,_scatter_h]+")")
		.call(_xAxis);
	// DRAW A CONTAINER FOR THE DROPDOWN MENU
	var x_label_select=d3.select(".main-group")
		.insert("foreignObject",".nodes")
		.attr("width",_scatter_w)
		.attr("height",22)
		.attr("x",0)
		.attr("y",_scatter_h)
		.attr("transform","translate("+[0,-f_padding]+")")
		.attr("class","sp")
		.hide()
	.append("xhtml:body")
		.attr("class","f-obj-body")
	.append("div")
		.attr("class","btn-group-xs dropup pull-right x-axis-scale");
	// DRAW THE DROPDOWN BUTTON
	x_label_select.append("button")
		.attr("type","button")
		.attr("class","btn btn-default dropdown-toggle x-indicator")
		.attr("data-toggle","dropdown")
		.attr("aria-expanded",false)
		.html("Encodez l’axe horizontal&nbsp;")
		.on("click",function(){
			// TRACE USER EVENT
			//console.log(["user","click","scatterplot-x-scale-menu",true])
        	trace.event("user","click","scatterplot-x-scale-menu",true);
        	return;
		})
	.append("span")
		.attr("class","caret");
	// SET THE CONTENT OF THE DROPDOWN MENU
	var x_menu=x_label_select.append("ul")
		.attr("class","dropdown-menu dropdown-menu-right dropdown-menu-x-axis")
		.attr("role","menu")
		.html(function(){
			var html=d3.select("#hidden")
				.select(".dropdown-menu-x-axis").html();
			return html;
		});
	// CREATE THE Y AXIS
	// AND THE Y AXIS DATA SELECTOR
	svg.append("g")
		.attr("class","y axis")
		.attr("transform","translate("+[_scatter_p,0]+")")
		.call(_yAxis);
	var y_label_select=d3.select(".main-group")
		.insert("foreignObject",".nodes")
		.attr("width",_scatter_w)
		.attr("height",30)
		.attr("x",_scatter_p)
		.attr("y",f_padding)
		.attr("transform","translate("+[0,-f_padding]+")")
		.attr("class","sp")
		.hide()
	.append("xhtml:body")
		.attr("class","f-obj-body")
	.append("div")
		.attr("class","btn-group-xs pull-left");
	y_label_select.append("button")
		.attr("type","button")
		.attr("class","btn btn-default dropdown-toggle y-indicator")
		.attr("data-toggle","dropdown")
		.attr("aria-expanded",false)
		.html("Encodez l’axe vertical&nbsp;")
		.on("click",function(){
			// TRACE USER EVENT
			//console.log(["user","click","scatterplot-y-scale-menu",true])
        	trace.event("user","click","scatterplot-y-scale-menu",true);
        	return;
		})
	.append("span")
		.attr("class","caret");
	var y_menu=y_label_select.append("ul")
		.attr("class","dropdown-menu dropdown-menu-y-axis")
		.attr("role","menu")
		.html(function(){
			var html=d3.select("#hidden")
				.select(".dropdown-menu-y-axis").html();
			return html;
		});
	// DRAW THE OUT-OF-BOUNDS LINES
	// FOR THE Y-DIMENSION
	svg.append("line")
		.attr("class","missing-data")
		.attr("x1",f_padding/2)
		.attr("y1",-f_padding/2)
		.attr("x2",f_width)
		.attr("y2",-f_padding/2)
		.attr("stroke-dasharray","5,5");
	// FOR THE X-DIMENSION
	svg.append("line")
		.attr("class","missing-data")
		.attr("x1",f_padding/2)
		.attr("y1",-f_padding/2)
		.attr("x2",f_padding/2)
		.attr("y2",f_height-f_padding*1.5)
		.attr("stroke-dasharray","5,5");
	// ADD A LEGEND FOR MISSING DATA
	svg.append("text")
		.attr("class","missing-data")
		.attr("x",f_padding/2)
		.attr("y",-f_padding/2)
		.text("Données manquantes");
	// TRACE SYSTEM EVENT
	//console.log(["system","draw","scatterplot-bg",true])
	trace.event("system","draw","scatterplot-bg",true);
  	return;
};
// DRAW THE SCRUTINS ENVIRONMENT
function drawSCRUTIN(){
	// ADD A GROUP FOR THE SCRUTINS DROPDOWN
	// BELOW THE NODES
	var svg=d3.select(".main-group")
			.insert("g",".nodes")
			.attr("class","scrutins")
			.hide();
	var scrutin_desc=svg.append("foreignObject")
		.attr("width",f_width)
		.attr("height",30)
		.attr("x",0)
		.attr("y",f_padding*2)
		.attr("transform","translate("+[0,-f_padding]+")")
	.append("xhtml:body")
		.attr("class","f-obj-body text-center")
	.append("div")
		.attr("class","col-sm-6 col-sm-offset-3 scrutin-desc noselect")
		.html("<p><u>Première séance du 17/12/2014</u></p><p>Scrutin public sur l’ensemble du projet de loi relatif à la délimitation des régions, aux élections régionales et départementales et modifiant le calendrier électoral (lecture définitive).</p>")
	// ADD THE DROPDOWN MENU
	var dropdown=d3.select(".main-group")
		.insert("foreignObject",".nodes")
		.attr("width",f_width)
		.attr("height",30)
		.attr("x",0)
		.attr("y",f_padding)
		.attr("transform","translate("+[0,-f_padding]+")")
		.attr("class","scrutins")
		.hide()
	.append("xhtml:body")
		.attr("class","f-obj-body text-center")
	.append("div")
		.attr("class","btn-group-xs");
	dropdown.append("button")
		.attr("type","button")
		.attr("class","btn btn-default dropdown-toggle scrutins-select")
		.attr("data-toggle","dropdown")
		.attr("aria-expanded",false)
		.html("Scrutin n° 997&nbsp;")
		.on("click",function(){
			// TRACE USER EVENT
			//console.log(["user","click","scrutin-menu",true])
        	trace.event("user","click","scrutin-menu",true);
        	return;
		})
	.append("span")
		.attr("class","caret");
	var menu=dropdown.append("ul")
		.attr("class","dropdown-menu dropdown-menu-scrutin z-high")
		.attr("role","menu");
	// ADD A SEARCH ENGINE IN THE DROPDOWN MENU
	menu.append("li")
		.on("click",function(){
			d3.event.stopPropagation();
			return;
		})
	.append("div")
		.attr("class","form-group col-sm-12")
	.append("input")
		.attr("type","text")
		.attr("class","form-control")
		.attr("id","scrutin-search-form")
		.attr("placeholder","Cherchez un scrutin")
		.on("input",function(){return searchingSCRUTINS();});

	var s_pie_legend=menu.append("li")
		.attr("class","s-pie-legend drop-list-padding")
	.append("svg")
		.attr("width",558)
		.attr("height",20);
	// DRAW THE MINI PIE CHART LEGENDS
	s_pie_legend.append("text")
		.attr("class","s-pie-legend-txt")
		.attr("y",15)
		.style("opacity",0.65)
		.text("Votes : ");
	s_pie_legend.append("path")
		.attr("class","s-pie-pour")
		.attr("transform","translate("+[50,20]+")")
		.attr("d","M1.2246467991473533e-15,-20A20,20 0 0,1 17.19207072235204,-10.219232078666472L0,0Z");
	s_pie_legend.append("text")
		.attr("class","s-pie-legend-txt")
		.attr("x",72)
		.attr("y",15)
		.text("Pour");
	s_pie_legend.append("path")
		.attr("class","s-pie-contre")
		.attr("transform","translate("+[120,20]+")")
		.attr("d","M1.2246467991473533e-15,-20A20,20 0 0,1 17.19207072235204,-10.219232078666472L0,0Z");
	s_pie_legend.append("text")
		.attr("class","s-pie-legend-txt")
		.attr("x",142)
		.attr("y",15)
		.text("Contre");
	s_pie_legend.append("path")
		.attr("class","s-pie-abstention")
		.attr("transform","translate("+[195,20]+")")
		.attr("d","M1.2246467991473533e-15,-20A20,20 0 0,1 17.19207072235204,-10.219232078666472L0,0Z");
	s_pie_legend.append("text")
		.attr("class","s-pie-legend-txt")
		.attr("x",217)
		.attr("y",15)
		.text("Abstentions");
	s_pie_legend.append("path")
		.attr("class","s-pie-absent")
		.attr("transform","translate("+[295,20]+")")
		.attr("d","M1.2246467991473533e-15,-20A20,20 0 0,1 17.19207072235204,-10.219232078666472L0,0Z");
	s_pie_legend.append("text")
		.attr("class","s-pie-legend-txt")
		.attr("x",317)
		.attr("y",15)
		.text("Absents");
	// ADD A DIVIDER
	menu.append("li")
		.attr("class","divider");
	// LOAD THE DATA TO POPULATE THE DROPDOWN LIST
	d3.json("data/scrutins/scrutins.summary.json",function(error,scrutins){
		// SET ALL THE OPTIONS
		var options=menu.selectAll(".scrutin-opt")
			.data(scrutins);
		var text_line=options.enter()
			.append("li")
			.attr("class",function(d){
				var setclass="scrutin-opt opt-"+d.scrutin_id;
				if(d.scrutin_id===997){
					setclass+=" selected";
				};
				return setclass;
			})
		var table=text_line.append("a")
			.on("click",function(d){
				// TRACE USER EVENT
				//console.log(["user","click","scrutin-option",d.scrutin_id])
				trace.event("user","click","scrutin-option",d.scrutin_id);
				// UNSELECT THE USER SELECTED VIEW
				if(_show_snapshots){
					d3.selectAll(".user-snapshot").unSelected();
					d3.selectAll(".each-question").unSelected();
				};
				setupScrutin(d.scrutin_id);
				d3.select(".scrutins-select")
					.html("Scrutin n° "+d.scrutin_id+"&nbsp;<span class='caret'></span>");
				d3.select(".scrutin-desc")
					.html("<p><u>"+d.seance+"</u></p><p>"+d.desc+"</p>");
				d3.selectAll(".scrutin-opt.selected")
					.unSelected();
				d3.select(this.parentNode)
					.isSelected();
				return;
			})
			.append("table")
			.append("tr");
		table.append("td")
			.attr("class","table-first-cell")
			.html(function(d){return d.scrutin_id;});
		table.append("td")
			.attr("class","table-second-cell")
			.html(function(d){return d.desc;});
		table.append("td")
			.attr("class","table-third-cell")
			.each(function(d){
				var s_pie_data=[{label:"pour",value:+d.pour},{label:"contre",value:+d.contre},{label:"abstention",value:+d.abstention},{label:"absent",value:+d.absent}],
					s_pie_r=20,
					s_arc=d3.svg.arc()
						.outerRadius(s_pie_r)
						.innerRadius(0),
					s_pie=d3.layout.pie()
						.sort(d3.descending)
						.value(function(c){return c.value;}),
					s_pie_color=d3.scale.ordinal()
						.domain(["pour","contre","abstention","absent"])
						.range(["olivedrab","indianred","gray","lightgray"]),
					svg=d3.select(this)
						.append("svg")
							.attr("width",s_pie_r*2+10)
							.attr("height",s_pie_r*2+10)
						.append("g")
							.attr("transform","translate("+[(s_pie_r+5),(s_pie_r+5)]+")"),
					g=svg.selectAll(".s-arc")
						.data(s_pie(s_pie_data))
					.enter().append("g")
						.attr("class","s-arc");
				g.append("path")
					.attr("d",s_arc)
					.style("fill",function(d){ return s_pie_color(d.data.label);});

				//console.log(s_pie_data)
				return;
			});			
		options.append("li")
			.attr("class","divider");
		return;
	});
	// TRACE SYSTEM EVENT
	//console.log(["system","draw","vote-bg",true])
	trace.event("system","draw","vote-bg",true);
	return;	
};

// CREATE THE NODES FOR THE DEPUTES
function drawInitialNODES(data){
	var svg=d3.select(".nodes");
	// SET THE DEPUTE NODES INITIAL DATA:
	// ADD ORIGINAL POSITION AND SIZE
	for (var j=0;j<data.length;j++){
		data[j].radius=_node_size;
		data[j].x=Math.random()*width;
		data[j].y=Math.random()*height;
	};
	// CREATE THE NODES
	var nodes=svg.selectAll(".node")
		.data(data);
	nodes.enter().append("circle")
		.attr("class",function(d,i){
			var depute=toClassStr(d.name);
			return "node active-dot low-opacity "+depute+" node-"+i;
		})
		.attr("r",function(d){return _node_size;})
		.on("click",function(d){
          	// TRACE USER EVENT
          	//console.log(["user","click","node",d.name])
          	trace.event("user","click","node",d.name);
			// UNSELECT THE USER SELECTED VIEW
			if(_show_snapshots){
				d3.selectAll(".user-snapshot").unSelected();
				d3.selectAll(".each-question").unSelected();
			};
          	// DESELECT ALL NODES TO HAVE ONLY THE NODE
          	// CLICKED ON SELECTED
      		d3.selectAll(".node")
      			.classed("active-dot",false);
			if(d3.select(this).classed("active-dot")===false){
				d3.select(this)
					.classed("active-dot",true)
					.moveToFront();
				d.selected=1;
				// TRACE USER EVENT
	        	//console.log(["user","select","node",d3.selectAll(".node.active-dot")[0].length])
	        	trace.event("user","select","node",d3.selectAll(".node.active-dot")[0].length);
			}else{
				d3.select(this)
					.classed("active-dot",false)
					.moveToFront();
				d.selected=0;
				// TRACE USER EVENT
	        	//console.log(["user","unselect","node",d3.selectAll(".node.active-dot")[0].length])
	        	trace.event("user","unselect","node",d3.selectAll(".node.active-dot")[0].length);
			};
			return;
		})
		.on("mouseover",function(d){
			// TRACE USER EVENT
        	//console.log(["user","mouseover","node",d.name])
        	trace.event("user","mouseover","node",d.name);
			return showPopover(d);
		})
		.on("mouseout",function(d){
			// TRACE USER EVENT
        	//console.log(["user","mouseout","node",d.name])
        	trace.event("user","mouseout","node",d.name);
			return removePopovers(d);
		});
	// TRACE SYSTEM EVENT
	//console.log(["system","draw","nodes",true])
	trace.event("system","draw","nodes",true);
	// DRAW THE FIRST LAYOUT:
	// THE HEMICYCLE
	layoutVIEW('siege',data);
	return;
};
// DRAW THE SCALE SLIDER THUMB
function drawSLIDERTHUMB(){
	var container = d3.select("#scale-slider");
	container.insert("div")
		.attr("class","slider-thumb")
		.style("margin-left", "calc(50% - 40px + 7.5px)")
		.call(_drag);
	// TRACE SYSTEM EVENT
	//console.log(["system","draw","scale-slider-thumb",true])
	trace.event("system","draw","scale-slider-thumb",true);
	return;
};

// ------------------------------------------------------------------------- //
// MAIN (NODE) DRAWING FUNCTIONS ------------------------------------------- //
// ------------------------------------------------------------------------- //
// GENERATE THE MAIN LAYOUT FOR EVERY
// VIEW EXCEPT THE SCATTERPLOT VIEW
function layoutVIEW(vname,data){
	var size=[f_width-f_padding,height],
		centers=getCenters(vname,size,data),
		trace_vname=vname;
	// IF THE SCATTERPLOT HAS BEEN MODIFIED, POINTS NEED TO BE 
	// CENTERED AROUND A UNIQUE VALUE SO 
	// WE NEED TO CHANGE vname TO SOME UNIQUE VALUE
	// IN THE DATASET (E.G. THE DEPUTE’S ID)
	if(vname==="scatterplot" && isSetSCATTERPLOT()) vname="id";
	// ANIMATE THE NODES INTO POSITION
	force.on("tick", tick(centers,vname,data));
	drawCategoricalLABELS(centers,vname)
	force.start();
	// TRACE SYSTEM EVENT
	//console.log(["system","display",trace_vname,true])
	trace.event("system","display",trace_vname,true);
	return;
};

// ------------------------------------------------------------------------- //
// DEPENDENCIES FOR NODE CLUSTERING ---------------------------------------- //
// ------------------------------------------------------------------------- //
// LOAD THE DATA FOR A SCRUTIN
// AND DRAW THE LAYOUT
function setupScrutin(id){
	d3.json("data/scrutins/s_"+id+".json",function(error,scrutin){
		if(error) return console.log(["system","load","vote-data",false])
		// BIND THE NEW DATA TO THE MAIN DATA
		_global_data.forEach(function(d,i){
			d.vote=scrutin[i].vote;
			return;
		});
		// TRACE SYSTEM EVENT
		//console.log(["system","load","vote-data",true])
		trace.event("system","load","vote-data",true);
		layoutVIEW("vote",_global_data);
		return;
	});
	return;
};

// SET THE CENTERS FOR EACH NODE CLUSTER
function getCenters(vname,size,data){
	var centers, 
		map,
		parseDate=d3.time.format("%Y").parse,
		timescale=d3.time.scale()
			.range([f_padding,size[0]-f_padding]),
		votescale=d3.scale.ordinal()
			.domain(["absent","non-votant","abstention","contre","pour"])
			.rangePoints([f_padding*3,size[0]-f_padding*4]);
	// REMOVE ALL BACKGROUND IMAGES
	// TO RESET THE VIEW:
	// HIDE THE MAP
	d3.select(".map")
		.hide();
	// HIDE THE HEMICYCLE
	d3.select(".hemicycle")
		.hide();
	// HIDE THE SCATTERPLOT DIMENSIONS
	d3.selectAll(".sp")
		.hide();
	// HIDE THE SCRUTINS DESCRIPTIONS
	d3.selectAll(".scrutins")
		.hide();
	// RESET THE NODES THAT HAD MISSING DATA
	// IN THE SCATTERPLOT VIEW
	d3.selectAll(".node")
		.classed("missing-dimension",false);
	// SET VIEW CONDITIONS
	if(vname==="decade"){
		timescale.domain(d3.extent(data,function(d){return parseDate(d.decade);}))
		centers=_.uniq(_.pluck(data,vname)).map(function(d){
			return{name:d,value:1,x:timescale(parseDate(d)),y:size[1]/2,dx:0, dy:0,ind:vname};
		});
	}else if(vname==="departement"||vname==="origin_dep"){
		// DISPLAY THE MAP
		d3.select(".map")
			.show();
		// GET THE CENTERS FOR EACH DEPARTEMENT
		centers=data.map(function(d){
			var dep=stripStr(d[vname]),
				centroid=[175,300];
			if(_dep_metropole.indexOf(d[vname])!==-1){
				var geo_path=d3.select("."+dep);
				if(geo_path[0][0] !== null){
					var geo_path_datum=geo_path.datum(),
						bounds=path.bounds(geo_path_datum);
					centroid=path.centroid(geo_path_datum);
				};
			};
			return {name:d[vname],value:1,x:centroid[0],y:centroid[1],dx:0,dy:0,ind:vname};
		});
	}else if(vname==="siege"){
		// DISPLAY THE HEMISPHERE DRAWING
		d3.select(".hemicycle")
			.show();
		centers=data.map(function(d){
			return {name:d.siege.siege_id,value:1,x:d.siege.s_x+9,y:d.siege.s_y,dx:0,dy:0,ind:d.siege.siege_id};
		});
	}else if(vname==="scatterplot"){
		// DISPLAY THE SCATTERPLOT AXES
		d3.selectAll(".sp")	
			.show();
		if(!isSetSCATTERPLOT()){	
			centers=_.uniq(_.pluck(data,vname)).map(function(d){
				return{name:d,value:1,ind:vname};
			});
			// SET AN INITIAL TREEMAP LAYOUT WITH ONLY ONE ROOT
			map=d3.layout.treemap().size(size).ratio(1/1);
			map.nodes({children: centers});
		}else{
			var xvals=getXRANGE(),
				yvals=getYRANGE();
			// SET THE DOMAIN FOR THE X-AXIS
			setXDOMAIN();
			// SET THE DOMAIN FOR THE Y-AXIS
			setYDOMAIN();
			// SET THE CENTERS
			centers=data.map(function(d){
				var plot_x=f_width/2,
					plot_y=f_height/2;
				// DETERMINE X-POSITIONS
				if(xvals[0]){
					if(xvals[1]){
						if(xvals[2]){
							if(d[xvals[0]]){
								plot_x=_scatter_x(d[xvals[0]][xvals[1]][xvals[2]]);
							}else{
								plot_x=0;
							};
						}else{
							if(d[xvals[0]]){
								plot_x=_scatter_x(d[xvals[0]][xvals[1]]);
							}else{
								plot_x=0;
							};
						};
					}else{
						if(d[xvals[0]]){
							plot_x=_scatter_x(d[xvals[0]]);
						}else{
							plot_x=0;
						};
					};
				};
				// DETERMINE Y-POSITIONS
				if(yvals[0]){
					if(yvals[1]){
						if(yvals[2]){
							if(d[yvals[0]]){
								plot_y=_scatter_y(d[yvals[0]][yvals[1]][yvals[2]]);
							}else{
								plot_y=-f_padding;
							};
						}else{
							if(d[yvals[0]]){
								plot_y=_scatter_y(d[yvals[0]][yvals[1]]);
							}else{
								plot_y=-f_padding;
							};
						};
					}else{
						if(d[yvals[0]]){
							plot_y=_scatter_y(d[yvals[0]]);
						}else{
							plot_y=-f_padding;
						};
					};
				};
				// IF DATA IS MISSING FOR THE NODE
				if(isNaN(plot_x)){
					plot_x=0;
				};
				if(isNaN(plot_y)){
					plot_y=-f_padding;
				};
				// SET THE NODE TO OUTLINE ALONE
				/*if(d.temp_x===0 || d.temp_y===-f_padding){
					d3.select(this).classed("missing-dimension",true);	
				}else{
					d3.select(this).classed("missing-dimension",false);
				};*/
				// RETURN THE POSITION DATA
				return {name:d.id,value:1,x:plot_x,y:plot_y,dx:0,dy:0,ind:d.id};
			});
		};
	}else if(vname==="vote"){
		// DISPLAY THE SCRUTIN DESCRIPTION
		// AND DROPDOWN MENU
		d3.selectAll(".scrutins")	
			.show();
		centers=_.uniq(_.pluck(data,vname)).map(function(d){
			return{name:d,value:1,x:votescale(d),y:size[1]/2,dx:0, dy:0,ind:vname};
		});
	}else{
		centers=_.uniq(_.pluck(data,vname)).map(function(d){
			return{name:d,value:1,ind:vname};
		});
		// SET A TREEMAP LAYOUT WITH AS MANY ROOTS AS
		// THERE ARE CATEGORIES IN THE DATA
		map = d3.layout.treemap().size(size).ratio(1/1);
		map.nodes({children: centers});
	};
	// TRACE SYSTEM EVENT
	//console.log(["system","get",vname+"-cluster-centers",true])
	trace.event("system","get",vname+"-cluster-centers",true);
	return centers;
};
// ANIMATE THE NODES INTO POSITION
function tick(centers,vname,data){
	var nodes=d3.selectAll(".node"),
		foci={};
	for(var i=0;i<centers.length;i++){
		// PUT ALL CENTER VALUES 
		// IN A NEW OBJECT THAT CAN BE ACCESSED
		// LIKE: foci[name_of_indicator]
		foci[centers[i].name]=centers[i];
	};
	return function(e){
		for (var i=0;i<data.length;i++){
			var o=data[i];
			if(vname==='siege'){
				var f=foci[o[vname].siege_id];
			}else{
				// HERE vname NEED TO BE SET 
				// TO THE SAME THING AS THE
				// INDICATOR IN THE CENTERS
				var f=foci[o[vname]];
			};
			o.y+=((f.y+(f.dy/2))-o.y)*e.alpha;
			o.x+=((f.x+(f.dx/2))-o.x)*e.alpha;
		};
	if(vname==='siege' || vname==='id'){
		nodes.attr("cx",function(d){
				d.temp_x=d.x;
				return d.x; 
			})
			.attr("cy",function(d){ 
				d.temp_y=d.y;
				return d.y; 
			});
	}else{
			nodes.each(collide(.11,data))
			.attr("cx",function(d){
				d.temp_x=d.x;
				return d.x; 
			})
			.attr("cy",function(d){ 
				d.temp_y=d.y;
				return d.y; 
			});
		};
	};
};
// DETECT NODE COLLISION
// TO MINIMIZE OVERLAP
// AND VISUAL CLUTTER
function collide(alpha,data){
	var maxRadius=d3.max(_.pluck(data,'radius'));
	var quadtree=d3.geom.quadtree(data);
	return function(d){
		var r=d.radius+maxRadius+padding,
			nx1=d.x-r,
			nx2=d.x+r,
			ny1=d.y-r,
			ny2=d.y+r;
		quadtree.visit(function(quad,x1,y1,x2,y2){
			if(quad.point&&(quad.point!==d)){
				var x=d.x-quad.point.x,
					y=d.y-quad.point.y,
					l=Math.sqrt(x*x+y*y),
					r=d.radius+quad.point.radius+padding;
				if(l<r){
					l=(l-r)/l*alpha;
					d.x-=x*=l;
					d.y-=y*=l;
					quad.point.x+=x;
					quad.point.y+=y;
				};
			};
		return x1>nx2||x2<nx1||y1>ny2||y2<ny1;
		});
	};
	return;
};

// ------------------------------------------------------------------------- //
// DEPENDENCIES FOR SCATTERPLOT -------------------------------------------- //
// ------------------------------------------------------------------------- //
// SET THE X-SCALE
function setXDOMAIN(){
	var xvals=getXRANGE();
	// IF THE USER HAS SELECTED A DIMENSION FOR THE X-AXIS
	if(xvals[0]){
	// SET THE DOMAIN FOR THE X-AXIS
		_scatter_x.domain([0,d3.max(_global_data,function(d){
			if(d[xvals[0]]){
				if(xvals[1]){
					if(xvals[2]){
						return +d[xvals[0]][xvals[1]][xvals[2]];
					}else{
						return +d[xvals[0]][xvals[1]];
					};
				}else{
					return +d[xvals[0]];
				};
			};
		})]).nice();
	}else{
		_scatter_x.domain([0,0]);
	};
	// TRACE SYSTEM EVENT
	//console.log(["system","update",getVIEW().toString()+"-x-domain","["+xvals.toString()+"]"])
	trace.event("system","update",getVIEW().toString()+"-x-domain","["+xvals.toString()+"]");
};
// SET THE Y-SCALE
function setYDOMAIN(){
	var yvals=getYRANGE();
	// IF THE USER HAS SELECTED A DIMENSION FOR THE Y-AXIS
	if(yvals[0]){
	// SET THE DOMAIN FOR THE Y-AXIS
		_scatter_y.domain([0,d3.max(_global_data,function(d){
			if(d[yvals[0]]){
				if(yvals[1]){
					if(yvals[2]){
						return +d[yvals[0]][yvals[1]][yvals[2]];
					}else{
						return +d[yvals[0]][yvals[1]];
					};
				}else{
					return +d[yvals[0]];
				};
			};
		})]).nice();
	}else{
		_scatter_y.domain([0,0]);
	};
	// TRACE SYSTEM EVENT
	//console.log(["system","set",getVIEW().toString()+"-y-domain","["+yvals.toString()+"]"])
	trace.event("system","set",getVIEW().toString()+"-y-domain","["+yvals.toString()+"]");
};
// UPDATE THE X-AXIS TICKS AND THE BUTTON LABEL
function updateXAXIS(vhtml){
	// UPDATE THE RENDERING OF THE X-AXIS
	d3.select(".x.axis")
		.transition()
		.duration(500)
		.call(_xAxis);
	// WRTIE THE NAME OF THE SELECTED DIMENSION
	// IN THE DROPDOWN BUTTON
	d3.select(".x-indicator")
		.html(vhtml + "&nbsp;<span class='caret'></span>");
	// TRACE SYSTEM EVENT
	//console.log(["system","update",getVIEW().toString()+"-x-axis",vhtml])
	trace.event("system","update",getVIEW().toString()+"-x-axis",vhtml);
	return;
};
// UPDATE THE Y-AXIS TICKS AND THE BUTTON LABEL
function updateYAXIS(vhtml){
	// UPDATE THE RENDERING OF THE X-AXIS
	d3.select(".y.axis")
		.transition()
		.duration(500)
		.call(_yAxis);
	// WRTIE THE NAME OF THE SELECTED DIMENSION
	// IN THE DROPDOWN BUTTON
	d3.select(".y-indicator")
		.html(vhtml + "&nbsp;<span class='caret'></span>");
	// TRACE SYSTEM EVENT
	//console.log(["system","update",getVIEW().toString()+"-y-axis",vhtml])
	trace.event("system","update",getVIEW().toString()+"-y-axis",vhtml);
	return;
};

// ------------------------------------------------------------------------- //
// DEPENDENCIES FOR NODE SCALING ------------------------------------------- //
// ------------------------------------------------------------------------- //
// UPDATE THE SCALE DOMAIN
// AND REDRAW THE NODES,
// EITHER BY USER-TRIGGERED
// MOUSE DRAG OF SCALE SLIDER
// OR AUTOMATICALLY ON VIEW CHANGE
function updateSCALEDOMAIN(data,vindicator,sdata,ssdata,transition_duration,drag){
	// RESET ALL NODES TO DEFAULT
	d3.selectAll(".missing-scale")
		.classed("missing-scale",false);
	// IF THE USER HAS SELECTED A SCALE ENCODING
	if(vindicator){
		// UPDATE THE SCALE DOMAIN
		// FOR THE NODES
		_scale.domain(d3.extent(data,function(d){
			if(d[vindicator]){
				if(sdata){
					if(ssdata){
						return +d[vindicator][sdata][ssdata];
					}else{
						return +d[vindicator][sdata];
					};
				}else{
					return +d[vindicator];
				};
			};
		}));
		// UPDATE THE NODES’ SIZES
		d3.selectAll(".node")
			.transition()
			.duration(transition_duration)
			.attr("r",function(d){
				if(sdata){
					if(ssdata){
						if(d[vindicator]){
							d.radius=_scale(d[vindicator][sdata][ssdata]);
						}else{
							d.radius=_node_size;
							d3.select(this).classed("missing-scale",true);
						};
					}else{
						if(d[vindicator]){
							d.radius=_scale(d[vindicator][sdata]);
						}else{
							d.radius=_node_size;
							d3.select(this).classed("missing-scale",true);
						};
					};
				}else{
					if(d[vindicator]){
						d.radius=_scale(d[vindicator]);
					}else{
						d.radius=_node_size;
						d3.select(this).classed("missing-scale",true);
					};
				};
				if(isNaN(d.radius)){
					d.radius=_node_size;
					d3.select(this).classed("missing-scale",true);
				};
				return d.radius;
			});
	}else{
		d3.selectAll(".node")
			.transition()
			.duration(transition_duration)
			.attr("r",function(d){ 
				d.radius=_node_size;
				return d.radius;
			});
	};
	// TRACE SYSTEM EVENT
	//console.log(["system","render","node-scale-domain","["+[vindicator,sdata,ssdata]+"]"])
	trace.event("system","render","node-scale-domain","["+[vindicator,sdata,ssdata]+"]");
	return;
};
// UPDATE AND RENDER THE NEW NODE SIZES
// ON USER-TRIGGERED CLICK (SOMWHERE ALONG THE SLIDER SCALE)
// OR AUTOMATICALLY ON VIEW CHANGE (WITH ANIMATED TRANSITION)
function updateNODESIZES(transition_duration,position){
	// THIS COULD BE REPLACED BY THE getSliderEXTENT VALUES
	var el=d3.select("#scale-slider").node(),
		slider_w=parseFloat(d3.select(el).style("width")),
		padding=parseFloat(d3.select(el).style("padding-left")),
		slider_extent=slider_w-padding*2,
		slider_range=slider_w-padding*2-_slider_thumb_max_width,
		thumb_size,thumb_pos;
	// UPDATE THE SLIDER SCALE
	_slider_thumb_scale.domain([0,slider_range]);
	// CHECK THAT THE POSITION ISN'T SET IN THE FUNCTION
	// TYPICALLY IN THE CASE WHERE THE SCALE IS UPDATED
	// DYNAMICALLY WHEN THE USER SWITCHES VIEWS
	if(position){
		thumb_size=_slider_thumb_scale(position),
		thumb_pos=position;
	};
	// LIMIT THE MOUSE INPUT
	if(!position){
		var mouse=d3.mouse(el),
			xmouse=mouse[0]-padding;
		// LIMIT THE MOUSE INPUT
		if(xmouse<=0){
			xmouse=0;
		}else if(xmouse>=slider_range){
			xmouse=slider_range;
		};
		// GET THE THUMB SIZE AND ITS POSITION
		// AND THE PUBLIC VAR NODE MAX SIZE
		thumb_size=_slider_thumb_scale(xmouse),
		thumb_pos=xmouse-thumb_size/2;
		// LIMIT THE THUMB POSITION
		if(xmouse<=0){
			thumb_pos=0;
		}else if(xmouse>=slider_range){
			thumb_pos=slider_range;
		};
	};
	// RESET THE PUBLIC VAR _node_size
	_node_size=thumb_size/2;
    // TRACE SYSTEM EVENT
    //console.log(["system","update","scale-slider-thumb:value",thumb_size])
    trace.event("system","update","scale-slider-thumb:value",thumb_size);
	// UPDATE THE SLIDER THUMB POSITION AND SIZE 
	// IN THE RENDERING
	d3.select(".slider-thumb")
		.transition()
		.duration(transition_duration)
		.style("margin-left",thumb_pos+"px")
		.style("width",thumb_size+"px")
		.style("height",thumb_size+"px")
		.style("margin-top",-thumb_size/2+"px");
	// UPDATE THE NODE SCALE
	_scale.range([1,_node_size]);
	// TRACE SYSTEM EVENT
	//console.log(["system","update","node-scale-range","["+_scale.range().toString()+"]"])
	trace.event("system","update","node-scale-range","["+_scale.range().toString()+"]");
	// GET THE SCALES FROM SELECTED INDICATORS
	// THAT ENCODE NODE SIZE
	var scales=getSCALES();
	// UPDATE THE SIZES OF THE NODES
	updateSCALEDOMAIN(scales[0],scales[1],scales[2],scales[3],transition_duration/4);
	// GET THE ACTIVE VIEW
	var view=getVIEW();
	// REDRAW THE LAYOUT
	if(view==="scrutin"){
		// GET THE ACTIVE SCRUTIN
		var scrutin_id=getSCRUTIN();
		setupScrutin(scrutin_id);
	}else{
		layoutVIEW(view,_global_data);
	};
	return;
};
// GET THE SLIDER SCALE RANGE (OR EXTENT)
function getSliderEXTENT(){
	var slider=d3.select("#scale-slider"),
		slider_pl=parseFloat(slider.style("padding-left")),
		slider_pr=parseFloat(slider.style("padding-right")),
		slider_s=parseFloat(slider.style("width"))-slider_pl-slider_pr- _slider_thumb_max_width;
	return [slider.node(),slider_s,slider_pl,slider_pr];
};
// THE SCALE SLIDER THUMB
// DRAGGING FUNCTIONS
function dragstart(){
	// TRACE USER EVENT
	//console.log(["user","drag","scale-slider-thumb",true])
	trace.event("user","drag","scale-slider-thumb",true);
	// DECLARE THAT THE USER IS DRAGGING THE THUMB
	_scale_thumb_drag=true;
	var slider_data=getSliderEXTENT();
	_slider_thumb_scale
		.domain([0,slider_data[1]]);
	return;
};
function dragmove(){
	var size=0,
		slider_data=getSliderEXTENT(),
		pos_x=d3.mouse(slider_data[0])[0]-slider_data[2];
		if(pos_x<=0){
			pos_x=0;
		}else if(pos_x>=slider_data[1]){
			pos_x=slider_data[1];
		};
  	d3.select(this)
		.style("margin-left", function(){
			return pos_x+"px";
		})
		.style("width",function(){
			return _slider_thumb_scale(pos_x)+"px";
		})
		.style("height",function(){
			return _slider_thumb_scale(pos_x)+"px";
		})
		.style("margin-top",function(){
			return -_slider_thumb_scale(pos_x)/2+"px";
		});
	// SET THE NODES’ SIZES FOR THE VISUALIZATION
	_node_size=_slider_thumb_scale(pos_x)/2;
	_scale.range([1,_node_size]);
	// AND GET THE CURRENT USER-SELECT SCALE
	// PROPERTIES TO UPDATE THE SCALE DOMAIN
	var scales=getSCALES();
	updateSCALEDOMAIN(scales[0],scales[1],scales[2],scales[3],0,true);
	return;
};
function dragend(){
	// TRACE USER EVENT
	//console.log(["user","drag","scale-slider-thumb",false])
	trace.event("user","drag","scale-slider-thumb",false);
	// UNSELECT THE USER SELECTED VIEW
	if(_show_snapshots){
		d3.selectAll(".user-snapshot").unSelected();
		d3.selectAll(".each-question").unSelected();
	};
	// THIS IS REDUNDANT WITH THE END
	// OF THE updateNODESIZES() FUNCTION
	// MAYBE REMOVE
	// GET THE ACTIVE VIEW
	var view=getVIEW();
	// REDRAW THE LAYOUT
	if(view==="scrutin"){
		// GET THE ACTIVE SCRUTIN
		var scrutin_id=getSCRUTIN();
		setupScrutin(scrutin_id);
	}else{
		layoutVIEW(view,_global_data);
	};
    // DECLARE THAT THE USER IS NO LONGER DRAGGING THE THUMB
    _scale_thumb_drag=false;
	return;
};

// ------------------------------------------------------------------------- //
// OVERLAY DRAWING FUNCTIONS ----------------------------------------------- //
// ------------------------------------------------------------------------- //
// DRAW THE CATEGORY LABELS 
// FOR EACH CLUSTER OF NODES
function drawCategoricalLABELS(centers,vname){
	var svg=d3.select(".nodes");
	svg.selectAll(".label").remove();
	if(vname!=="departement"&&vname!=="origin_dep"){
		svg.selectAll(".label")
			.data(centers)
			.enter()
			.append("foreignObject")
			.attr("class", "label noselect")
			.attr("width",150)
			.attr("height",200)
			.attr("x",0)
			.attr("y",0)
			.attr("transform",function(d){
				return "translate("+[(d.x+d.dx/2),(d.y+d.dy/2-12)]+") rotate(-45)";
			})
			.html(function(d){ 
				var s=d.name;
				if(s!==undefined && vname!=='siege' && vname!=='id'){
					return s[0].toUpperCase()+s.slice(1);
				}else{
					return null;
				};
			})
			.on("mouseover",showPIE)
			.on("mouseout",removePIE);
	};
	// TRACE SYSTEM EVENT
	//console.log(["system","display",getVIEW().toString()+"-categorical-labels",true])
	trace.event("system","display",getVIEW().toString()+"-categorical-labels",true);
	return;
};
// DRAW THE SUMMARY PIECHART OVERLAY
// ON USER-TRIGGERED MOUSEOVER MAP.CIRCLE 
// OR CATEGORICAL LABEL
function showPIE(d){
	// TRACE USER EVENT
	// THIS NEEDS TO COME HERE OTHERWISE IT WILL SCREW UP
	// THE CALL TO THIS FUNCTION
	//console.log(["user","mouseover",getVIEW().toString()+"-categorical-label",d.name])
	trace.event("user","mouseover",getVIEW().toString()+"-categorical-label",d.name);
	var vindicator=d.ind,
		vname=d.name,
		departement_name=d.full_name;
	// IF THE PIECHART IS CALLED FOR ONE
	// OF THE MAP VIEWS,
	// CHECK WHETHER THE PIECHART IS FOR
	// ELECTION DEPARTMENT OR BIRTH DEPARTMENT
	if(vindicator==="departement"){
		vindicator=getVIEW();
	};
	var total_count=0,
		select_count=0,
		select_radical=0,
		select_ni=0,
		select_ecolo=0,
		select_udi=0,
		select_ps=0,
		select_ump=0,
		select_a_ump=0,
		select_a_ps=0,
		select_a_ecolo=0,
		select_gauche=0,
		select_hommes=0,
		select_femmes=0;
	// CHECK WHETHER A COLOR CODE
	// HAS BEEN SET BY THE USER
	var color_code=getCOLORS();
	// COUNT THE DIFFERENT NODES SELECTED 
	// ACCORDING TO THE COLOR CODING 
	// (IF THERE IS ONE)
	d3.selectAll(".node")
		.each(function(c){
			var depute=c[vindicator];
			if(vindicator==="departement"||vindicator==="origin_dep"){
				depute=stripStr(depute);
			};
			if(depute===vname){
				if(d3.select(this).classed("active-dot")===true){
					if(color_code==="sexe"){
						if(c.sexe==="Hommes"){
							select_hommes++;
						}else if(c.sexe==="Femmes"){
							select_femmes++;
						};
					}else if(color_code==="parti_s"){
						var pp=c.parti_s;
						if(pp==="radical"){
							select_radical++;
						}else if(pp==="ni"){
							select_ni++;
						}else if(pp==="ecolo"){
							select_ecolo++;
						}else if(pp==="udi"){
							select_udi++;
						}else if(pp==="ps"){
							select_ps++;
						}else if(pp==="ump"){
							select_ump++;
						}else if(pp==="a-ump"){
							select_a_ump++;
						}else if(pp==="a-ps"){
							select_a_ps++;
						}else if(pp==="a-ecolo"){
							select_a_ecolo++;
						}else if(pp==="gauche"){
							select_gauche++;
						};
					}
					select_count++;
				};
				total_count++;
			};
			return;
		});
	// IF THERE ARE DEPUTIES IN THE LIST
	// DETERMINE THE PERCENTAGE OF SELECTED NODES IN EACH CATEGORY
	// AND THE PERCENTAGE OF UNSELECTED NODES
	if(total_count>0){
		var perc=parseInt((select_count*100/total_count)*10)/10,
			perc_radical=parseInt((select_radical*100/total_count)*10)/10,
			perc_ni=parseInt((select_ni*100/total_count)*10)/10,
			perc_ecolo=parseInt((select_ecolo*100/total_count)*10)/10,
			perc_udi=parseInt((select_udi*100/total_count)*10)/10,
			perc_ps=parseInt((select_ps*100/total_count)*10)/10,
			perc_ump=parseInt((select_ump*100/total_count)*10)/10,
			perc_a_ump=parseInt((select_a_ump*100/total_count)*10)/10,
			perc_a_ps=parseInt((select_a_ps*100/total_count)*10)/10,
			perc_a_ecolo=parseInt((select_a_ecolo*100/total_count)*10)/10,
			perc_gauche=parseInt((select_gauche*100/total_count)*10)/10,
			perc_hommes=parseInt((select_hommes*100/total_count)*10)/10,
			perc_femmes=parseInt((select_femmes*100/total_count)*10)/10;
		var perc_unselected=100-perc;
	}else{
		var perc=0,
			perc_unselected=100;
	};
	// FORMAT THE DATA FOR THE D3 PIE LAYOUT
	var perc_data=new Array();
	if(color_code==="sexe"){
		perc_data=[{type:"Hommes",count:perc_hommes,type_s:"hommes"},{type:"Femmes",count:perc_femmes,type_s:"femmes"},{type:"Reste",count:perc_unselected,type_s:"unselected"}];
	}else if(color_code==="parti_s"){
		// ORDER ACCORDING TO SEATING IN THE ASSEMBLEE
		perc_data=[{type:"Gauche démocrate et républicaine",count:perc_gauche,type_s:"gauche"},{type:"Apparenté Socialiste, républicain et citoyen",count:perc_a_ps,type_s:"a-ps"},{type:"Socialiste, républicain et citoyen",count:perc_ps,type_s:"ps"},{type:"Apparenté Écologiste",count:perc_a_ecolo,type_s:"a-ecolo"},{type:"Écologiste",count:perc_ecolo,type_s:"ecolo"},{type:"Radical, républicain, démocrate et progressiste",count:perc_radical,type_s:"radical"},{type:"Union des démocrates et indépendants",count:perc_udi,type_s:"udi" },{type:"Apparenté Union pour un Mouvement Populaire",count:perc_a_ump,type_s:"a-ump"},{type:"Union pour un Mouvement Populaire",count:perc_ump,type_s:"ump"},{type:"Députés non inscrits",count:perc_ni,type_s:"ni"},{type:"Reste",count:perc_unselected,type_s:"unselected"}];
	}else{
		perc_data=[{type:"Selectionné",count:perc,type_s:"selected"},{type:"Reste",count:perc_unselected,type_s:"unselected"}];
	};
	// NOW THAT THE DATA IS FORMATTED
	// DRAW THE SUMMARY PIECHART OVERLAY
	var svg=d3.select("svg#svg-canvas"),
		svg_node=svg.node(),
		container=d3.select(".nodes"),
		this_x=0,
		this_y=0,
		pie_size=20;
	// SET THE D3 PIECHART LAYOUT
	var arc=d3.svg.arc()
			.outerRadius(pie_size)
			.innerRadius(0),
		pie=d3.layout.pie()
			.sort(null)
			.value(function(d) {return d.count;});
	// SET THE X AND Y POSITION FOR THE PIECHART
	if(vindicator==="departement"||vindicator==="origin_dep"){
		this_x=d3.select(this).attr("cx");
		this_y=d3.select(this).attr("cy");
	}else{
		this_x=d3.transform(d3.select(this).attr("transform")).translate[0];
		this_y=d3.transform(d3.select(this).attr("transform")).translate[1];
	};
	var piechart = container.append("g")
		.attr("class","piechart")
		.attr("transform",function(d){
			return "translate("+[this_x,this_y+12]+")";
		});
	piechart.append("circle")
		.attr("class","pie no-pointer-evt")
		.attr("r",pie_size+3);
	var g=piechart.selectAll(".arc")
		.data(pie(perc_data))
		.enter()
		.append("g")
		.attr("class", "arc no-pointer-evt");
	g.append("path")
		.attr("d",arc)
		.attr("class",function(b){
			return "slice no-pointer-evt low-opacity "+b.data.type_s;
		});
	piechart.append("circle")
		.attr("class","strong-border no-pointer-evt")
		.attr("r",pie_size+3);
	piechart.append("foreignObject")
		.attr("width",150)
		.attr("height",40)
		.attr("x",-75)
		.attr("y",pie_size*3.3)
		.attr("transform","translate("+[0,-f_padding]+")")
		.attr("class", "dep-label noselect")
		.html(function(d){
			var depute_spelling="député(e)s",
				departement_spelling="";
			if(total_count===1){
				depute_spelling="député(e)";
			};
			if(vindicator==="departement"||vindicator==="origin_dep"){
				departement_spelling=departement_name+"<br/>";
			};
			return departement_spelling+"<strong>"+total_count+"</strong> "+depute_spelling;
		});
	// TRACE SYSTEM EVENT
	//console.log(["system","display",getVIEW().toString()+"-pie-chart","["+[d.name,true]+"]"])
	trace.event("system","display",getVIEW().toString()+"-pie-chart","["+[d.name,true]+"]");
	return;
};
// REMOVE THE SUMMARY PIECHART
// ON USER TRIGGERED MOUSEOUT MAP.CIRCLE 
// OR CATEGORICAL LABEL
function removePIE(d){
	// TRACE USER EVENT
	// THIS NEEDS TO COME HERE OTHERWISE IT WILL SCREW UP
	// THE CALL TO THIS FUNCTION
	//console.log(["user","mouseout",getVIEW().toString()+"-categorical-label",d.name])
	trace.event("user","mouseout",getVIEW().toString()+"-categorical-label",d.name);
	d3.selectAll(".piechart").remove();
	// TRACE SYSTEM EVENT
	//console.log(["system","display",getVIEW().toString()+"-pie-chart","["+[d.name,false]+"]"])
	trace.event("system","display",getVIEW().toString()+"-pie-chart","["+[d.name,false]+"]");
	return;
};
// DRAW THE POPOVER TOOLTIP
// FOR EACH DEPUTE ON
// USER-TRIGGERED MOUSEOVER NODE
function showPopover(d){
	var svg=d3.select("svg#svg-canvas"),
		svg_node=svg.node(),
		mouse = d3.mouse(svg_node),
		mx = mouse[0],
		my = mouse[1],
		active_view=getVIEW();
	svg.append("foreignObject")
		.attr("width",250)
		.attr("height",100)
		.attr("class","inspector-object")
		.attr("x", function(){
			if(mx<width/2){
				return mx+10;
			}else{
				return mx-260;
			};
		})
		.attr("y",my)
		.attr("transform","translate("+[0,-f_padding]+")")
		.append("xhtml:body")
			.attr("class","f-obj-body")
			.style("height","100px")
			.style("width","250px")
		.append("div")
			.attr("class","inspector-container noselect")
			.html(function(){ 
				var assis_spelling="Assis",
					naissance_spelling="Né",
					elu_spelling="Élu";
				if(d.sexe==="Femmes"){
					assis_spelling="Assise";
					naissance_spelling="Née";
					elu_spelling="Élue";
				}
				if(active_view==="siege"){
					if(d.siege.siege_id<600){
						return "<p class='back-light'><strong><u>"+d.name+"</u></strong></p><p class='back-light'>"+assis_spelling+" à la place n° "+d.siege.siege_id+"</p>"; 
					}else{
						return "<p class='back-light'><strong><u>"+d.name+"</u></strong></p><p class='back-light'>Donnée manquante</p>";
					};
				}else if(active_view==="decade"||active_view==="origin_dep"){
					return "<p class='back-light'><strong><u>"+d.name+"</u></strong></p><p class='back-light'>"+naissance_spelling+" le "+d.naissance+"</p><p class='back-light'>à "+d.lieu+"</p>"; 
				}else if(active_view==="departement"){
					var circonscription=d.dep.split("(")[1].split(")")[0];
					return "<p class='back-light'><strong><u>"+d.name+"</u></strong></p><p class='back-light'>"+elu_spelling+" dans la "+circonscription+"</p>"; 
				}else if(active_view==="profession"){
					return "<p class='back-light'><strong><u>"+d.name+"</u></strong></p><p class='back-light'>"+d.job+"</p>"; 
				}else if(active_view==="commission"){
					return "<p class='back-light'><strong><u>"+d.name+"</u></strong></p><p class='back-light'>"+d.info+"</p>"; 
				}else{
					return "<p class='back-light'><strong><u>"+d.name+"</u></strong></p>"; 
				}
			});
	// TRACE SYSTEM EVENT
	//console.log(["system","display",getVIEW().toString()+"-pop-over","["+[d.name,true]+"]"])
	trace.event("system","display",getVIEW().toString()+"-pop-over","["+[d.name,true]+"]");
	return;
};
// DRAW THE POPOVER TOOLTIP FOR THE BRUSHING INTERACTION
function showSelectedPopover(){
	var svg=d3.select("svg#svg-canvas"),
		svg_node=svg.node(),
		mouse = d3.mouse(svg_node),
		mx = mouse[0],
		my = mouse[1],
		active_view=getVIEW(),
		num_selection=d3.selectAll(".active-dot")[0].length;
	svg.append("foreignObject")
		.attr("width",250)
		.attr("height",100)
		.attr("class","inspector-object")
		.attr("x", function(){
			return mx+10;
		})
		.attr("y",my+7)
		.attr("transform","translate("+[0,-f_padding]+")")
		.append("xhtml:body")
			.attr("class","f-obj-body")
			.style("height","100px")
			.style("width","250px")
		.append("div")
			.attr("class","inspector-container noselect")
			.html(function(){ 
				return "<strong>"+num_selection+"</strong> députés<br/>sélectionnés";
			});
	// TRACE SYSTEM EVENT
	// console.log(["system","display",getVIEW().toString()+"-pop-over","["+[d.name,true]+"]"])
	trace.event("system","display",getVIEW().toString()+"-brush-pop-over","["+[num_selection,true]+"]");
	return;
};
// REMOVE THE POPOVER TOOLTIP
// FOR EACH DEPUTE ON
// USER-TRIGGERED MOUSEOVER NODE
function removePopovers(d){
	d3.selectAll(".inspector-object")
		.remove();
	// TRACE SYSTEM EVENT
	// console.log(["system","display",getVIEW().toString()+"-pop-over","["+[d.name,false]+"]"])
	trace.event("system","display",getVIEW().toString()+"-pop-over","["+[d.name,false]+"]");
	return;
};

// ------------------------------------------------------------------------- //
// OVERLAY TUTORIALS ------------------------------------------------------- //
// ------------------------------------------------------------------------- //
// DRAW THE ANIMATED VISUAL CUE FOR CLICK AND DRAG
// WHEN USER CLICKS ON THE CHART/OUTSIDE OF A NODE
function tutorialCLICKDRAG(){
	var svg=d3.select("svg#svg-canvas"),
		svg_node=svg.node(),
		mouse=d3.mouse(svg_node),
		select_w=200,
		select_h=150;
	var simu_brush=svg.append("rect")
		.attr("class","simu-brush")
		.attr("width",0)
		.attr("height",0)
		.attr("x",mouse[0])
		.attr("y",mouse[1])
		.attr("stroke-dasharray","5,5");
	var simu_cursor = svg.append("g")
		.attr("class","simu-cursor")
		.attr("transform","translate("+[mouse[0],mouse[1]]+")");
	var text=svg.append("g")
		.attr("class","brush-tuto-text noselect")
		.style("fill","#CCC")
		.style("opacity",0);
	var line1=text.append("text")
		.attr("text-anchor","middle")
		.attr("x",function(){
			var x=mouse[0];
			if(mouse[0]<=f_width/2){
				x=mouse[0]+select_w/2;
			}else{
				x=mouse[0]-select_w/2;
			};
			return x;
		})
		.attr("y",function(){
			var y=mouse[1];
			if(mouse[1]<=f_height/2){
				y=mouse[1]+select_h/2-20;
			}else{
				y=mouse[1]-select_h/2-20;
			};
			return y;
		})
		.text("Cliquez et faites glisser");
	var line2=text.append("text")
		.attr("text-anchor","middle")
		.attr("x",function(){
			var x=mouse[0];
			if(mouse[0]<=f_width/2){
				x=mouse[0]+select_w/2;
			}else{
				x=mouse[0]-select_w/2;
			};
			return x;
		})
		.attr("y",function(){
			var y=mouse[1];
			if(mouse[1]<=f_height/2){
				y=mouse[1]+select_h/2;
			}else{
				y=mouse[1]-select_h/2;
			};
			return y;
		})
		.text("le curseur pour sélectionner");
	var line3=text.append("text")
		.attr("text-anchor","middle")
		.attr("x",function(){
			var x=mouse[0];
			if(mouse[0]<=f_width/2){
				x=mouse[0]+select_w/2;
			}else{
				x=mouse[0]-select_w/2;
			};
			return x;
		})
		.attr("y",function(){
			var y=mouse[1];
			if(mouse[1]<=f_height/2){
				y=mouse[1]+select_h/2+20;
			}else{
				y=mouse[1]-select_h/2+20;
			};
			return y;
		})
		.text("plusieurs députés à la fois.");	

	simu_cursor.append("line")
		.attr("x1",0)
		.attr("y1",-7)
		.attr("x2",0)
		.attr("y2",7);
	simu_cursor.append("line")
		.attr("x1",-7)
		.attr("y1",0)
		.attr("x2",7)
		.attr("y2",0);
	// ANIMATE IN THE SIMULATED CURSOR AND SELECTION AREA
	// AND FADE THE TEXT IN
	simu_brush.transition()
		.duration(1000)
		.attr("width",select_w)
		.attr("height",select_h)
		.attr("x",function(){
			var x=mouse[0];
			if(mouse[0]>f_width/2){
				x=mouse[0]-select_w;
			};
			return x;
		})
		.attr("y",function(){
			var y=mouse[1];
			if(mouse[1]>f_height/2){
				y=mouse[1]-select_h;
			};
			return y;
		});
	simu_cursor.transition()
		.duration(1000)
		.attr("transform",function(){
			var pos=[mouse[0],mouse[1]];
			if(mouse[0]<=f_width/2){
				pos[0]=mouse[0]+select_w;
			}else{
				pos[0]=mouse[0]-select_w;
			};
			if(mouse[1]<=f_height/2){
				pos[1]=mouse[1]+select_h; 
			}else{
				pos[1]=mouse[1]-select_h;
			};
			return "translate("+pos+")";
		});
	text.transition()
		.duration(1000)
		.ease("cubic-in")
		.style("fill","#000")
		.style("opacity",1);
	// ANIMATE EVERYTHING OUT
	simu_brush.transition()
		.duration(1000)
		.delay(3000)
		.attr("width",0)
		.attr("height",0)
		.attr("x",function(){
			var x=mouse[0];
			if(mouse[0]<=f_width/2){
				x=mouse[0]+select_w;
			}else{
				x=mouse[0]-select_w;
			};
			return x;
		})
		.attr("y",function(){
			var y=mouse[1];
			if(mouse[1]<=f_height/2){
				y=mouse[1]+select_h;
			}else{
				y=mouse[1]-select_h;
			};
			return y;
		})
		.each("end",function(){
			cleartutorialCLICKDRAG();
		});
	text.transition()
		.duration(1000)
		.delay(3000)
		.ease("cubic-out")
		.style("fill","#CCC")
		.style("opacity",0);
	// TRACE SYSTEM EVENT
	//console.log(["system","display",getVIEW().toString()+"-brush-selection-tutorial",true])
	trace.event("system","display",getVIEW().toString()+"-brush-selection-tutorial",true);
	return;
};
// REMOVE THE CLICK AND DRAG TUTORIAL 
// WHEN THE USER CLICKS ELESEWHERE
function cleartutorialCLICKDRAG(){
	d3.selectAll(".simu-brush").transition().duration(0).each("end",function(){return d3.select(this).remove();});
	d3.selectAll(".simu-cursor").transition().duration(0).each("end",function(){return d3.select(this).remove();});
	d3.selectAll(".brush-tuto-text").transition().duration(0).each("end",function(){return d3.select(this).remove();});
	// TRACE SYSTEM EVENT
	//console.log(["system","display",getVIEW().toString()+"-brush-selection-tutorial",false])
	trace.event("system","display",getVIEW().toString()+"-brush-selection-tutorial",false)
	return;
};

// ------------------------------------------------------------------------- //
// DISPLAY USER SNAPSHOT VIEWS --------------------------------------------- //
// ------------------------------------------------------------------------- //
// VIEWS FOR QUESTIONS
function displayUserQuestionView(vview,vsind,vsdata,vssdata,vcolor,vmaxscale,vscrutin,vxind,vxdata,vxsdata,vyind,vydata,vysdata,vselectednodes,qid){
	// RESET ALL USER SNAPSHOT LIST
	if(_show_snapshots){
		d3.selectAll(".user-snapshot").unSelected();
		d3.selectAll(".q-"+qid).isSelected();
	};
	//d3.select(el).isSelected();
	// RESET ALL VIEW BUTTONS
	// AND SET THE SNAPSHOT VIEW
	d3.selectAll(".btn.view")
		.attr("disabled",null)
		.unSelected();
	d3.select("#"+vview.toString())
		.attr("disabled","disabled")
		.isSelected();
	// GET THE SELECTED SCALE
	// SET NULL AND UNDEFINED VALUES
	if(vsdata==="null" || vsdata==="undefined"){vsdata=null};
	if(vssdata==="null" || vssdata==="undefined"){vssdata=null};
	d3.selectAll("li.scale")
		.unSelected()
		.each(function(){
			var indicator=d3.select(this).attr("data-d"),
				sdata=d3.select(this).attr("data-sd"),
				ssdata=d3.select(this).attr("data-ssd");
			if(indicator===vsind && sdata===vsdata && ssdata===vssdata){
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-MENU
				if(d3.select(this.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode)
					.isSelected()
					.select("a")
					.isSelected();
				};
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-SUB-MENU
				if(d3.select(this.parentNode.parentNode.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode.parentNode.parentNode)
					.isSelected()
					.select("a")
					.isSelected();
				};
				d3.select(this).isSelected();
				// MENTION THE SCALE INFO AT THE BOTTOM OF THE CANVAS
				if(d3.select(this).select("a").html()!=="Aucun encodage"){
					d3.select(".scale-info")
						.html("<small>La taille encode&thinsp;:</small> "+d3.select(this).select("a").html());
				}else{
					d3.select(".scale-info").html("");
				};
				// TRACE SYSTEM EVENT
				//console.log(["system","display","scale-legend",true])
				trace.event("system","display","scale-legend",true);
				// ADD A LEGEND FOR MISSING VALUES IN DATA
				// AT THE BOTTOM OF THE CANVAS
				// ALSO, REMOVE THIS IF THERE IS NO SCALING OF THE NODES
				if(d3.select(this).select("a").html()!=="Aucun encodage"){
					d3.select(".missing-scale-legend")
						.html("<div class='legend-entry'><span class='dot-legend missing-val'></span>Données manquantes</div>");
				}else{
					d3.select(".missing-scale-legend").html("");
				};
			};
			return;
		});
	// GET THE SELECTED COLOR
	// SET THE CAPITAL FOR SEXE COLOR CODING
	var colorId=vcolor;
	if(colorId==="sexe"){
		colorId=vcolor.capitalize();
	};
	// SELECT THE COLOR IN THE DROPUP MENU
	d3.selectAll("li.color")
		.unSelected();
	d3.select("li#"+colorId)
		.isSelected();
	// CHANGE THE COLOR OF THE NODES
	// UPDATE THE NODES’ COLOR
	d3.selectAll(".node")
		.attr("class",function(d){
			// REMOVE PREVIOUS COLOR CODING
			d3.select(this).classed(d.parti_s.toLowerCase(),false);
			d3.select(this).classed(d.sexe.toLowerCase(),false);
			// DETERMINE THE NEW CLASS/COLOR-CODING
			var color_class=d3.select(this).attr("class");
			if(vcolor!=="null"){
				color_class+=" "+d[vcolor].toLowerCase();
			};
		return color_class;
	});
	// DISPLAY THE LEGEND
	d3.select(".legend")
		.html(_legendes[vcolor]);
	// GET THE SELECTED SCRUTIN
	d3.selectAll(".scrutin-opt")
		.unSelected();
	d3.select(".scrutin-opt.opt-"+vscrutin)
		.isSelected();
	var scrutin_datum=d3.select(".scrutin-opt.opt-"+vscrutin).datum();
	d3.select(".scrutins-select")
		.html("Scrutin n° "+scrutin_datum.scrutin_id+"&nbsp;<span class='caret'></span>");
	d3.select(".scrutin-desc")
		.html("<p><u>"+scrutin_datum.seance+"</u></p><p>"+scrutin_datum.desc+"</p>");
	// SET THE USER’S SCATTERPLOT VIEW
	// FOR THE X AXIS
	if(vxdata==="null" || vxdata==="undefined"){vxdata=null};
	if(vxsdata==="null" || vxsdata==="undefined"){vxsdata=null};
	d3.selectAll("li.x-range")
		.unSelected()
		.each(function(){
			var indicator=d3.select(this).attr("data-d"),
				sdata=d3.select(this).attr("data-sd"),
				ssdata=d3.select(this).attr("data-ssd");
			if(indicator===vxind && sdata===vxdata && ssdata===vxsdata){
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-MENU
				if(d3.select(this.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode)
						.isSelected()
					.select("a")
						.isSelected();
				};
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-SUB-MENU
				if(d3.select(this.parentNode.parentNode.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode.parentNode.parentNode)
						.isSelected()
					.select("a")
						.isSelected();
				};
				d3.select(this).isSelected();
				setXDOMAIN();
				updateXAXIS(d3.select(this).select("a").html());
			};
			return;
		});
	// FOR THE Y AXIS
	if(vydata==="null" || vydata==="undefined"){vydata=null};
	if(vysdata==="null" || vysdata==="undefined"){vysdata=null};
	d3.selectAll("li.y-range")
		.unSelected()
		.each(function(){
			var indicator=d3.select(this).attr("data-d"),
				sdata=d3.select(this).attr("data-sd"),
				ssdata=d3.select(this).attr("data-ssd");
			if(indicator===vyind && sdata===vydata && ssdata===vysdata){
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-MENU
				if(d3.select(this.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode)
					.isSelected()
					.select("a")
					.isSelected();
				};
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-SUB-MENU
				if(d3.select(this.parentNode.parentNode.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode.parentNode.parentNode)
					.isSelected()
					.select("a")
					.isSelected();
				};
				d3.select(this).isSelected();
				setYDOMAIN();
				updateYAXIS(d3.select(this).select("a").html());
			};
			return;
		});
	// GET THE SELECTED NODES
	var nodes=vselectednodes.split(",");
	d3.selectAll(".node").classed("active-dot",false);
	nodes.forEach(function(d){
		d3.select(".node."+d).classed("active-dot",true);
		return;
	});
	// UPDATE THE DISPLAY
	updateNODESIZES(2000,vmaxscale);
	return;
};

// VIEWS FOR REPSONSES
// BASICALLY THE DIFFERENCE HERE IS THAT AT THE END
// WE UPDATE THE QUESTION SYSTEM TO MAKE SURE WE HAVE
// THE QUESTIONS FOR THE APPROPRIATE VIEW
// THIS COULD BE OPTIMIZED AS IT IS STUPID 
// TO COPY THE WHOLE FUNCTION
function displayUserView(vview,vsind,vsdata,vssdata,vcolor,vmaxscale,vscrutin,vxind,vxdata,vxsdata,vyind,vydata,vysdata,vselectednodes,qid,isinit){
	if(!isinit){
		// TRACE USER EVENT
		trace.event("user","click","show-snapshot",true);
	}else{
		// TRACE SYSTEM EVENT
		trace.event("system","draw","specific-view-with-question-id",qid);
	}
	// SCROLL PAGE BACK TO TOP
	$('html, body').animate({scrollTop : 0},800);
	// RESET ALL VIEW BUTTONS
	// AND SET THE SNAPSHOT VIEW
	d3.selectAll(".btn.view")
		.attr("disabled",null)
		.unSelected();
	d3.select("#"+vview.toString())
		.attr("disabled","disabled")
		.isSelected();
	// GET THE SELECTED SCALE
	// SET NULL AND UNDEFINED VALUES
	if(vsdata==="null" || vsdata==="undefined"){vsdata=null};
	if(vssdata==="null" || vssdata==="undefined"){vssdata=null};
	d3.selectAll("li.scale")
		.unSelected()
		.each(function(){
			var indicator=d3.select(this).attr("data-d"),
				sdata=d3.select(this).attr("data-sd"),
				ssdata=d3.select(this).attr("data-ssd");
			if(indicator===vsind && sdata===vsdata && ssdata===vssdata){
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-MENU
				if(d3.select(this.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode)
					.isSelected()
					.select("a")
					.isSelected();
				};
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-SUB-MENU
				if(d3.select(this.parentNode.parentNode.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode.parentNode.parentNode)
					.isSelected()
					.select("a")
					.isSelected();
				};
				d3.select(this).isSelected();
				// MENTION THE SCALE INFO AT THE BOTTOM OF THE CANVAS
				if(d3.select(this).select("a").html()!=="Aucun encodage"){
					d3.select(".scale-info")
						.html("<small>La taille encode&thinsp;:</small> "+d3.select(this).select("a").html());
				}else{
					d3.select(".scale-info").html("");
				};
				// TRACE SYSTEM EVENT
				//console.log(["system","display","scale-legend",true])
				trace.event("system","display","scale-legend",true);
				// ADD A LEGEND FOR MISSING VALUES IN DATA
				// AT THE BOTTOM OF THE CANVAS
				// ALSO, REMOVE THIS IF THERE IS NO SCALING OF THE NODES
				if(d3.select(this).select("a").html()!=="Aucun encodage"){
					d3.select(".missing-scale-legend")
						.html("<div class='legend-entry'><span class='dot-legend missing-val'></span>Données manquantes</div>");
				}else{
					d3.select(".missing-scale-legend").html("");
				};
			};
			return;
		});
	// GET THE SELECTED COLOR
	// SET THE CAPITAL FOR SEXE COLOR CODING
	var colorId=vcolor;
	if(colorId==="sexe"){
		colorId=vcolor.capitalize();
	};
	// SELECT THE COLOR IN THE DROPUP MENU
	d3.selectAll("li.color")
		.unSelected();
	d3.select("li#"+colorId)
		.isSelected();
	// CHANGE THE COLOR OF THE NODES
	// UPDATE THE NODES’ COLOR
	d3.selectAll(".node")
		.attr("class",function(d){
			// REMOVE PREVIOUS COLOR CODING
			d3.select(this).classed(d.parti_s.toLowerCase(),false);
			d3.select(this).classed(d.sexe.toLowerCase(),false);
			// DETERMINE THE NEW CLASS/COLOR-CODING
			var color_class=d3.select(this).attr("class");
			if(vcolor!=="null"){
				color_class+=" "+d[vcolor].toLowerCase();
			};
		return color_class;
	});
	// DISPLAY THE LEGEND
	d3.select(".legend")
		.html(_legendes[vcolor]);
	// GET THE SELECTED SCRUTIN
	d3.selectAll(".scrutin-opt")
		.unSelected();
	d3.select(".scrutin-opt.opt-"+vscrutin)
		.isSelected();
	var scrutin_datum=d3.select(".scrutin-opt.opt-"+vscrutin).datum();
	d3.select(".scrutins-select")
		.html("Scrutin n° "+scrutin_datum.scrutin_id+"&nbsp;<span class='caret'></span>");
	d3.select(".scrutin-desc")
		.html("<p><u>"+scrutin_datum.seance+"</u></p><p>"+scrutin_datum.desc+"</p>");
	// SET THE USER’S SCATTERPLOT VIEW
	// FOR THE X AXIS
	if(vxdata==="null" || vxdata==="undefined"){vxdata=null};
	if(vxsdata==="null" || vxsdata==="undefined"){vxsdata=null};
	d3.selectAll("li.x-range")
		.unSelected()
		.each(function(){
			var indicator=d3.select(this).attr("data-d"),
				sdata=d3.select(this).attr("data-sd"),
				ssdata=d3.select(this).attr("data-ssd");
			if(indicator===vxind && sdata===vxdata && ssdata===vxsdata){
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-MENU
				if(d3.select(this.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode)
						.isSelected()
					.select("a")
						.isSelected();
				};
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-SUB-MENU
				if(d3.select(this.parentNode.parentNode.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode.parentNode.parentNode)
						.isSelected()
					.select("a")
						.isSelected();
				};
				d3.select(this).isSelected();
				setXDOMAIN();
				updateXAXIS(d3.select(this).select("a").html());
			};
			return;
		});
	// FOR THE Y AXIS
	if(vydata==="null" || vydata==="undefined"){vydata=null};
	if(vysdata==="null" || vysdata==="undefined"){vysdata=null};
	d3.selectAll("li.y-range")
		.unSelected()
		.each(function(){
			var indicator=d3.select(this).attr("data-d"),
				sdata=d3.select(this).attr("data-sd"),
				ssdata=d3.select(this).attr("data-ssd");
			if(indicator===vyind && sdata===vydata && ssdata===vysdata){
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-MENU
				if(d3.select(this.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode)
					.isSelected()
					.select("a")
					.isSelected();
				};
				// IF THE SCALE-ENCODING VALUE IS IN A SUB-SUB-MENU
				if(d3.select(this.parentNode.parentNode.parentNode.parentNode).select("a").classed("more-data")===true){
					d3.select(this.parentNode.parentNode.parentNode.parentNode)
					.isSelected()
					.select("a")
					.isSelected();
				};
				d3.select(this).isSelected();
				setYDOMAIN();
				updateYAXIS(d3.select(this).select("a").html());
			};
			return;
		});
	// GET THE SELECTED NODES
	var nodes=vselectednodes.split(",");
	d3.selectAll(".node").classed("active-dot",false);
	nodes.forEach(function(d){
		d3.select(".node."+d).classed("active-dot",true);
		return;
	});
	// UPDATE THE DISPLAY
	updateNODESIZES(2000,vmaxscale);
	// SET THE CURRENT VIEW ID TO DETERMINE
	// WHICH SET OF QUESTIONS TO CALL AND DISPLAY
	// (QUESTION SYSTEM RELATED)
	_c_id = _cs.indexOf(vview);
	// QUERY FOR EXISTING QUESTIONS FOR THIS VIEW
	// AND DISPLAY THEM IF THEY EXIST (QUESTION SYSTEM RELATED)
	$.post("question_system/questions.php",{c_id:_c_id},function(data){
		$(".questions").html(data);
		// RESET ALL USER SNAPSHOT LIST
		if(_show_snapshots){
			d3.selectAll(".user-snapshot").unSelected();
			d3.selectAll(".q-"+qid).isSelected();
		};
		// EXPAND THE RESPONSE SYSTEM
		expandRESPONSES(qid);
	});
	// SAY HOW MANY QUESTIONS ARE AVAILABLE FOR THE VIEW
	// IN THE QUESTION SYSTEM PROMPTER (QUESTION SYSTEM RELATED)
	if(_show_prompter){
		$.post("question_system/infobubble.php",{c_id:_c_id},function(data){
			$(".infobubble").html(data);
		});
	};

	return;
};

// IF THE USER CLICKS ON A QUESTION
// IN THE QUESTION SYSTEM
// THAT HAS AN ASSOCIATED VIEW
// PROVIDE FEEDBACK THAT THE VIEW HAS BEEN UPDATE
function updateVIEWFEEDBACK(el){
	d3.select(el).select(".associated-view-info")
		.html("<strong>Le graphique a été mis à jour.</strong>");
	setTimeout(function(){
		d3.select(el).select(".associated-view-info")
			.html("Des paramètres graphiques sont associés à ce commentaire ou cette question.");
	},3000)
}

// THE USER EXPANDS/COLLAPSES THE USER ACTIVITY LIST
function collapseUSERACTIVITY(){	
	if(d3.select(".side-menu-collapsible").classed("collapsed")===false){
		// TRACE USER EVENT
		trace.event("user","click","collapse-user-activity",true);
		d3.select(".user-views .widget-bar").html("&#8677;");
		d3.select(".side-menu-collapsible").classed("collapsed",true);
	}else{
		// TRACE USER EVENT
		trace.event("user","click","collapse-user-activity",false);
		d3.select(".user-views .widget-bar").html("&#8676;");
		d3.select(".side-menu-collapsible").classed("collapsed",false);
	}
	return;
};

// REMOVE THE QUESTION SYSTEM PROMPTER
function removePROMPTER(el){
	// TRACE USER EVENT
	trace.event("user","click","close-prompter",true);
	d3.select(el.parentNode).remove();
	_show_prompter=false;
	return;
};
