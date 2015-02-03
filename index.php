<!DOCTYPE HTML>
<html>
<head>

  <meta http-equiv="content-type" content="text/html; charset=utf-8" />

  <title>DeputeViz</title>

  <script type="text/javascript" src="libs/d3.js"></script>
  <script type="text/javascript" src="libs/topojson.js"></script>
  <script type="text/javascript" src="libs/jquery.js"></script>
  <script type="text/javascript" src="libs/underscore.js"></script>
  <script type="text/javascript" src="libs/bootstrap.min.js"></script>
  <script type="text/javascript" src="libs/trace.js"></script>
  
  <script type="text/javascript" src="data/legendes.data.js"></script>

  <script type="text/javascript" src="js/draw.graph.js"></script>
  <script type="text/javascript" src="js/search.methods.js"></script>
  <script type="text/javascript" src="js/questions.system.js"></script>

  <link rel="stylesheet" type="text/css" href="css/bootstrap.css">
  <link rel="stylesheet" type="text/css" href="css/css.css">
  <link rel="stylesheet" type="text/css" href="css/questions.system.css">
  <link rel="stylesheet" type="text/css" href="css/submenu.css">
  <link href='http://fonts.googleapis.com/css?family=Abril+Fatface' rel='stylesheet' type='text/css'>

  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-58949644-1', 'auto');
    ga('send', 'pageview');
    //ga('set', '&uid', {{sessionId}}); // Set the user ID using signed-in user_id.
  </script>

</head>



<body>

  <div class="side-menu-collapsible animated">
    <ul class="dropdown-menu user-views no-radius-left">
      <li class="widget-bar text-right" onclick="collapseUSERACTIVITY()">&#8676;</li>
      <li role="presentation" class="drop-list-padding droplist-action-title"><strong>Les derniers commentaires et questions en images</strong></li>
      <?php include_once('question_system/useractivity.php'); ?>
    </ul>
  </div>


  <div id="header" class="col-sm-12">
    <p class="lead text-center col-sm-offset-2 col-sm-8">Qui sont nos députés?<!--<small>Depuis le 17 juin 2012</small>--></p>
    <p class="col-sm-2 lead text-right information-icon">&#9432;</p>
  </div>

  <div class="container viz">


    <div id="navigation" class="col-sm-12">
      <div class="btn-group">
         <div id="grouping-label" class="btn btn-sm btn-inverse" disabled="disabled">Répartir par&thinsp;: </div>       
        <div id="siege" class="btn btn-sm btn-default view selected" disabled="disabled">Siège</div>
        <div id="sexe" class="btn btn-sm btn-default view">Sexe</div>
        <div id="decade" class="btn btn-sm btn-default view">Décennie de naissance</div>
        <div id="origin_dep" class="btn btn-sm btn-default view">Département de naissance</div>
        <div id="parti" class="btn btn-sm btn-default view">Parti politique</div>
        <div id="departement" class="btn btn-sm btn-default view">Département d’élection</div>
        <div id="profession" class="btn btn-sm btn-default view">Profession</div>
        <div id="commission" class="btn btn-sm btn-default view">Commission</div>
        <div id="scrutin" class="btn btn-sm btn-default view">Votes lors de scrutins</div>
        <div id="scatterplot" class="btn btn-sm btn-default view">Axes</div>
      </div>

    </div>

    <div id="canvas" class="col-sm-12"></div>

    <div class="col-sm-12">
      <div class="col-sm-3">
      
        <div class="btn-group dropup pull-left" id="indicator-select">
          <button type="button" class="btn btn-default dropdown-toggle scale-btn" data-toggle="dropdown" aria-expanded="false">
            <div class="dot-btn animated animate-point-scale"></div>
          </button>
          <?php include_once("_scale_menu.html"); ?>
        </div>

        <div class="btn-group dropup pull-left">
          <button type="button" class="btn btn-default dropdown-toggle color-btn" data-toggle="dropdown" aria-expanded="false">
            <div class="dot-btn animated animate-point-color"></div>
          </button>
          <?php include_once("_color_menu.html"); ?>
        </div>

      </div>

      <div class="form-group col-sm-6">
          <input type="text" class="form-control" id="search-form" placeholder="Cherchez un député" oninput="searching();">
      </div>

      <div id="scale-slider" class="drop-list-padding col-sm-3">
        <div class="ref-thumb">
          <div class="ref-sm-thumb"></div>
          <div class="ref-lg-thumb"></div>
        </div>
        <div class="slider-bar border-top"></div>
      </div>
    </div>

    <div class="scale-legend col-sm-12">
      <div class="col-sm-8 scale-info no-left-padding"></div>
      <div class="col-sm-4 missing-scale-legend"></div>
    </div>

    <div class="legend col-sm-12">

    </div>

  </div>

  <!-- THE DISCLAIMER -->
  <div class="container disclaimer">
    <div class="col-sm-9">
      <p class="lead">
        <script type="text/javascript">
          if(_show_question_system){
            document.write("Ce site a pour vocation de vous aider à mieux comprendre qui sont nos représentants à l’Assemblée Nationale. Le graphique interactif ci-dessus présente des données concernant chacun de nos députés, et le système de question-réponse ci-dessous vous permet de poser les questions que vous avez au sujet de ces données ou de la représentation graphique, ansi que de fournir des réponses aux questions que d’autres auront posé.");
          }else{
            document.write("Ce site a pour vocation de vous aider à mieux comprendre qui sont nos représentants à l’Assemblée Nationale. Le graphique interactif ci-dessus présente des données concernant chacun de nos députés.");
          }
        </script>
      </p>
    </div>
  </div>


  <!-- THE QUESTION SYSTEM AT THE BOTTOM OF THE PAGE --> 

  <div class="container question-system">

    <div class="col-sm-6 col-questions">

      <div class="question-container">

        <div class="lead col-sm-12 no-padding-left">Commentez ou posez une nouvelle question relative à cette vue des données</div>
        
        <div class="user-name form-group">
          <div class="input-group">
            <div class="input-group-addon">Nom</div>
            <input type="text" class="form-control" id="q-author-name" placeholder="Votre nom ou pseudonyme">
          </div>
        </div>
        
        <script type="text/javascript">

          function click_record_camera(el){
            // TRACE USER EVENT
            trace.event("user","click","snapshot",true);
            d3.select(el)
              .isSelected();
          }

          if(_show_snapshots){
            document.write("<div class='q-snapshot snapshot btn btn-default btn-xs' onclick='click_record_camera(this)'>"+
                      "<span class='glyphicon glyphicon-camera' aria-hidden='true'></span> "+
                      "Cliquez ici pour associer les paramètres du graphique à vôtre commentaire ou question."+
                    "</div>");
          };

        </script>

        <div class="question-form">
        
          <textarea id="question-text" class="form-control no-radius-bottom no-radius-top-left" rows="3" placeholder="Votre commentaire ou question"></textarea>

          <button id="question-process" class="btn btn-default btn-xs no-radius-top" />Commentez ou posez votre question</button>

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
            <img src="img/loading.gif" width="30%" />
          </div>
          <?php
            include_once("question_system/questions.php");
          ?>
        </div>

      </div>

    </div>

    <div class="col-sm-6 col-responses">

    </div>

  </div>

  <div class="prompter animated-slow text-center radius-top">
    <p class="widget-bar text-right radius-top" onclick="removePROMPTER(this)">&#8855;</p>
    <div class="prompter-content">
      <p class="glyphicon-white infobubble"><?php include_once("question_system/infobubble.php") ?></p>
      <p class="no-margin-bottom"><span class='glyphicon glyphicon-chevron-down glyphicon-white' aria-hidden='true'></p>
    </div>
  </div>

  <div id="hidden" class="hide">
    <?php 
      include_once("_y_axis.html");
      include_once("_x_axis.html");
      include_once("img/hemicycle.assemblee.data.js")
    ?>
  </div>


</body>

<script type="text/javascript">


  // ----------------------------------------------------------------------- //
  // SETUP THE QUESTIONS SYSTEM -------------------------------------------- //
  // ----------------------------------------------------------------------- //
  // IF THE QUESTION SYSTEM IS NOT ACTIVATED
  // REMOVE IT
  if(!_show_question_system){
    d3.select(".question-system").remove();
    d3.select(".prompter").remove();
    _show_snapshots=false;
    _show_prompter=false;
  };
  // THIS IS FOR THE QUESTION SYSTEM
  // TO KNOW WHICH VIEW THE USER IS IN
  // SO THAT THE QUESTION CORRESPONDS 
  // TO THE VIEW (QUESTION SYSTEM RELATED)
  var _cs=["siege","sexe","decade","origin_dep","parti","departement","profession","commission","scrutin","scatterplot"],
    // BY DEFAULT, THE VIEW IS SET TO
    // THE HEMICYCLE VIEW (I.E. 0)
    _c_id=0;

  // DRAW THE SVG CANVAS HERE BEFORE LOADING THE DATA
  // TO AVOID THE INITIAL SHIF ON PAGE LOAD
  drawSVG();
  drawSCRUTIN();
  drawSCATTERPLOT();
  drawMAP();
  // DRAW THE SCALE SLIDER’S THUMB
  drawSLIDERTHUMB();
  // IF THE SNAPSHOT SHOULD NOT BE SHOWN
  // OR IF THE QUESTION SYSTEMS IS SIMPLY NOT DISPLAYED
  // REMOVE IT
  if(!_show_snapshots || !_show_question_system){
    d3.select(".side-menu-collapsible").remove();
  };

  // ----------------------------------------------------------------------- //
  // THINGS GET REAL! LOAD THE DATA ---------------------------------------- //
  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  // FIRST, SCRAPE EXTRA DATA FROM vosdeputes.fr --------------------------- //
  // ----------------------------------------------------------------------- //
  d3.json("http://www.nosdeputes.fr/synthese/data/json",function(error,json){
    if(error) return console.log(["system","load","extra-data",false])
    // PARSE THE DATA WE WANT
    var deputes_synthese=new Object();
    json.deputes.forEach(function(d){
      var c=d.depute,
        full_title="";
      if(c.sexe==="H"){
        full_title="M. "+c.nom;
      }else{
        full_title="Mme "+c.nom;
      };
      deputes_synthese[full_title]={"amendements":{"adoptes":+c.amendements_adoptes,"signes":+c.amendements_signes},"en_commission":{"interventions":+c.commission_interventions,"presences":+c.commission_presences},"interventions":{"longues":+c.hemicycle_interventions,"courtes":+c.hemicycle_interventions_courtes},"mandats":+c.nb_mandats,"propositions":{"ecrites":+c.propositions_ecrites,"signees":+c.propositions_signees},"questions":{"ecrites":+c.questions_ecrites,"orales":+c.questions_orales},"rapports":+c.rapports,"semaines_presence":+c.semaines_presence};
      return;
    });

    // LOAD THE MAIN DATA
    d3.json("data/assemblee_nationale_data.json",function(error,data){
      if(error) return console.log(["system","load","main-data",false])
      // INCLUDE THE EXTRA DATA FROM nosdeputes.fr
      data.forEach(function(d){
        // CHECK IF THE DATA EXISTS FOR THE DEPUTE
        var depute=deputes_synthese[d.name];
        if(depute!==undefined){
          d.mandats=depute.mandats;
          d.semaines_presence=depute.semaines_presence;
          d.amendements=depute.amendements;
          d.en_commission=depute.en_commission;
          d.interventions=depute.interventions;
          d.propositions=depute.propositions;
          d.questions=depute.questions;
          d.rapports=depute.rapports;
        };
        return;
      });
      // PUT THE DATA IN THE _global_data PUBLIC VARIABLE
      // SO THAT THE DATA CAN BE CALLED OUTSIDE OF THIS FUNCTION
      _global_data=data;
      // TRACE SYSTEM EVENT
      //console.log(["system","load","main-data",true])
      trace.event("system","load","main-data",true);
      // CALL ALL THE INITIAL DRAWING FUNCTIONS
      drawHEMICYCLE(data.length);
      // MOVED ALL THE DRAWING FUNCTION THAT DON’T REQUIRE DATA
      // UP BEFORE THE DATA_LOAD
      // DRAW THE DEPUTE NODES
      drawInitialNODES(data);

      // CHECK IF THERE IS SPECIFIC VIEW IN THE URL
      // I.E., IF THE USER IS COMMING FROM TWITTER
      // TO A PREDEFINED VIEW
      <?php
        include_once("connect.php");
        # CHECK FOR VIEW
        $qid=$_GET['v'];
        $fn="";
        #SETUP QUERY
        $initsql=mysql_query("SELECT * FROM questions WHERE id='". $qid ."'") or die(mysql_error());
        while($initrow=mysql_fetch_assoc($initsql)){
          $fn="displayUserView(\"". $initrow['q_view'] ."\",\"". $initrow['q_scaleindicator'] ."\",\"". $initrow['q_scalesdata'] ."\",\"". $initrow['q_scalessdata'] ."\",\"". $initrow['q_color'] ."\",\"". $initrow['q_maxscale'] ."\",\"". $initrow['q_scrutin'] ."\",\"". $initrow['q_xindicator'] ."\",\"". $initrow['q_xdata'] ."\",\"". $initrow['q_xsdata'] ."\",\"". $initrow['q_yindicator'] ."\",\"". $initrow['q_ydata'] ."\",\"". $initrow['q_ysdata'] ."\",\"". $initrow['q_selectednodes'] ."\",\"". $initrow['id'] ."\",true)";
        }
        echo $fn;
      ?>

      // --------------------------------------------------------------------- //
      // USER-TRIGGERED ACTIONS ---------------------------------------------- //
      // --------------------------------------------------------------------- //

      // THE USER SELECTS ANOTHER VIEW
      d3.selectAll(".btn.view")
        .on("click",function(){
          // TRACE SYSTEM EVENTS
          //console.log(["system","display",getVIEW().toString()+"-categorical-labels",false])
          //console.log(["system","display",getVIEW().toString(),false])
          trace.event("system","display",getVIEW().toString()+"-categorical-labels",false);
          trace.event("system","display",getVIEW().toString(),false);
          // TRACE USER EVENT
          //console.log(["user","click","view-button",this.id])
          trace.event("user","click","view-button",this.id);
          // UNSELECT THE USER SELECTED VIEW
          if(_show_snapshots){
            d3.selectAll(".user-snapshot").unSelected();
            d3.selectAll(".each-question").unSelected();
          };
          // HIGHLIGHT THE SELECTED VIEW BUTTON
          // AND DIM ALL OTHER VIEW BUTTONS
          d3.selectAll(".btn.view")
            .attr("disabled",null)
            .unSelected();
          d3.select(this)
            .attr("disabled","disabled")
            .isSelected();
          // UPDATE THE VIEW
          if(this.id==="origin_dep" || this.id==="departement"){
            updateNODESIZES(2000,0);
          }else if(this.id==="profession"){
            updateNODESIZES(2000,50);
          }else{
            updateNODESIZES(2000,100);
          };
          // RESET THE QUESTION SYSTEM
          // HIDE THE RESPONSES TO QUESTIONS
          // THAT MIGHT HAVE BEEN INSPECTED 
          // IN THE PREVIOUS VIEW (QUESTION SYSTEM RELATED)
          d3.select(".response-container")
            .remove();
          // TRACE SYSTEM EVENT
          //console.log(["system","display","responses-system",false])
          trace.event("system","display","responses-system",false);

          // SET THE CURRENT VIEW ID TO DETERMINE
          // WHICH SET OF QUESTIONS TO CALL AND DISPLAY
          // (QUESTION SYSTEM RELATED)
          _c_id = _cs.indexOf(this.id);
          // QUERY FOR EXISTING QUESTIONS FOR THIS VIEW
          // AND DISPLAY THEM IF THEY EXIST (QUESTION SYSTEM RELATED)
          if(_show_question_system){
            $.post("question_system/questions.php",{c_id:_c_id},function(data){
              $(".questions").html(data);
            });
          };
          // SAY HOW MANY QUESTIONS ARE AVAILABLE FOR THE VIEW
          // IN THE QUESTION SYSTEM PROMPTER (QUESTION SYSTEM RELATED)
          if(_show_prompter){
            $.post("question_system/infobubble.php",{c_id:_c_id},function(data){
              $(".infobubble").html(data);
            });
          };
          return;
        });
      // THE USER OPENS THE SCALE-ENCODING MENU
      // THIS STOPS THE ANIMATION OF THE SCALE-ENCODING BUTTON
      // (I.E. THE SCALE-ANIMATED CIRCULAR BUTTON AT THE
      // BOTTOM OF THE CANVAS)
      d3.select(".animate-point-scale")
        .on("click",function(){
          // TRACE USER EVENT
          //console.log(["user","click","scale-menu-button",true])
          trace.event("user","click","scale-menu-button",true);
          d3.select(this)
            .classed("animate-point-scale",false);
          return;
        });
      // THE USER CHANGES THE SCALE-ENCODING FOR THE NODES
      // IN THE SCALE-ENCODING DROPUP MENU
      d3.selectAll("li.scale")
        // SEPARATE THE mousedown/mouseup (INSTEAD OF SIMPLE click)
        // SO THAT THE USER CAN SEE THE HIGHLIGHTING OF THE SELECTED VALUE
        .on("mousedown",function(){
          // TRACE USER EVENT
          //console.log(["user","mousedown","scale-menu-option",d3.select(this).select("a").html()])
          trace.event("user","mousedown","scale-menu-option",d3.select(this).select("a").html());
          // HIGHLIGHT THE SELECTED SCALE-ENCODING VALUE
          // AND DIM ALL OTHER SCALE-ENCODING VALUES
          d3.selectAll(".scale.selected")
            .unSelected();
          d3.selectAll(".more-data.selected")
            .unSelected();
          d3.selectAll(".dropdown-submenu.selected")
            .unSelected();
          d3.select(this)
            .isSelected();
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
          return;
        })
        .on("mouseup",function(){
          // TRACE USER EVENT
          //console.log(["user","mouseup","scale-menu-option",d3.select(this).select("a").html()])
          trace.event("user","mouseup","scale-menu-option",d3.select(this).select("a").html());
          // UNSELECT THE USER SELECTED VIEW
          if(_show_snapshots){
            d3.selectAll(".user-snapshot").unSelected();
            d3.selectAll(".each-question").unSelected();
          };
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
          // TRACE SYSTEM EVENT
          //console.log(["system","display","missing-data-legend",true])
          trace.event("system","display","missing-data-legend",true);
          // UPDATE THE SCALE OF THE NODES
          var scales=getSCALES();
          updateSCALEDOMAIN(scales[0],scales[1],scales[2],scales[3],500);
          // REDRAW THE LAYOUT SO THAT THE NEWLY SCALED NODES
          // DO NOT OVERLAP
          layoutVIEW(getVIEW(),data);
          return;
        });
      // THE USER CHANGES THE SCALE OF THE NODES
      // WITH A SIMPLE CLICK ALONG THE SCALE SLIDER
      // MAY BE CONFLICTUAL WITH THE dragend FUNCTION
      d3.select("#scale-slider")
        .on("click",function(){
          // TRACE USER EVENT
          //console.log(["user","click","scale-slider-range",true])
          trace.event("user","click","scale-slider-range",true);
          // UNSELECT THE USER SELECTED VIEW
          if(_show_snapshots){
            d3.selectAll(".user-snapshot").unSelected();
            d3.selectAll(".each-question").unSelected();
          };
          if(_scale_thumb_drag===false){
            updateNODESIZES(0);
          };
          return;
        });
      // IN THE SCATTERPLOT VIEW, THE USER
      // CHANGES THE Y-AXIS
      d3.selectAll("li.y-range")
        // SEPARATE THE mousedown/mouseup (INSTEAD OF SIMPLE click)
        // SO THAT THE USER CAN SEE THE HIGHLIGHTING OF THE SELECTED VALUE
        .on("mousedown",function(){
          // TRACE USER EVENT
          //console.log(["user","mousedown",getVIEW().toString()+"-y-scale-menu-option",d3.select(this).select("a").html()])
          trace.event("user","mousedown",getVIEW().toString()+"-y-scale-menu-option",d3.select(this).select("a").html());
          d3.selectAll(".y-range.selected")
            .unSelected();
          d3.select(".dropdown-menu-y-axis")
            .selectAll(".more-data.selected")
            .unSelected();
          d3.select(".dropdown-menu-y-axis")
            .selectAll(".dropdown-submenu.selected")
            .unSelected();
          d3.select(this)
            .isSelected();
          // IF THE Y-AXIS-ENCODING VALUE IS IN A SUB-MENU
          if(d3.select(this.parentNode.parentNode).select("a").classed("more-data")===true){
            d3.select(this.parentNode.parentNode)
              .isSelected()
              .select("a")
              .isSelected();
          };
          // IF THE Y-AXIS-ENCODING VALUE IS IN A SUB-SUB-MENU
          if(d3.select(this.parentNode.parentNode.parentNode.parentNode).select("a").classed("more-data")===true){
            d3.select(this.parentNode.parentNode.parentNode.parentNode)
              .isSelected()
              .select("a")
              .isSelected();
          };
          return;
        })
        .on("mouseup",function(){
          // TRACE USER EVENT
          //console.log(["user","mouseup",getVIEW().toString()+"-y-scale-menu-option",d3.select(this).select("a").html()])
          trace.event("user","mouseup",getVIEW().toString()+"-y-scale-menu-option",d3.select(this).select("a").html());
          // UNSELECT THE USER SELECTED VIEW
          if(_show_snapshots){
            d3.selectAll(".user-snapshot").unSelected();
            d3.selectAll(".each-question").unSelected();
          };
          // DON’T DO THE SCALE UPDATE HERE
          // AS USERS MAY HAVE MODIFIED IT MANUALLY
          // AND IT MAY FRUSTRATING TO SEE THE SCALE CHANGE 
          // EVERY TIME A NEW DIMENSION IS SET
          layoutVIEW("scatterplot",data);
          updateYAXIS(d3.select(this).select("a").html());
          return;
        });
      // IN THE SCATTERPLOT VIEW, THE USER
      // CHANGES THE X-AXIS
      d3.selectAll("li.x-range")
        // SEPARATE THE mousedown/mouseup (INSTEAD OF SIMPLE click)
        // SO THAT THE USER CAN SEE THE HIGHLIGHTING OF THE SELECTED VALUE
        .on("mousedown",function(){
          // TRACE USER EVENT
          //console.log(["user","mousedown",getVIEW().toString()+"-x-scale-menu-option",d3.select(this).select("a").html()])
          trace.event("user","mousedown",getVIEW().toString()+"-x-scale-menu-option",d3.select(this).select("a").html());
          d3.selectAll(".x-range.selected")
            .unSelected();
          d3.select(".dropdown-menu-x-axis")
            .selectAll(".more-data.selected")
            .unSelected();
          d3.select(".dropdown-menu-x-axis")
            .selectAll(".dropdown-submenu.selected")
            .unSelected();
          d3.select(this)
            .isSelected();
          // IF THE X-AXIS-ENCODING VALUE IS IN A SUB-MENU
          if(d3.select(this.parentNode.parentNode).select("a").classed("more-data")===true){
            d3.select(this.parentNode.parentNode)
              .isSelected()
              .select("a")
              .isSelected();
          };
          // IF THE X-AXIS-ENCODING VALUE IS IN A SUB-MENU
          if(d3.select(this.parentNode.parentNode.parentNode.parentNode).select("a").classed("more-data")===true){
            d3.select(this.parentNode.parentNode.parentNode.parentNode)
              .isSelected()
              .select("a")
              .isSelected();
          };
          return;
        })
        .on("mouseup",function(){
          // TRACE USER EVENT
          //console.log(["user","mouseup",getVIEW().toString()+"-y-scale-menu-option",d3.select(this).select("a").html()])
          trace.event("user","mouseup",getVIEW().toString()+"-y-scale-menu-option",d3.select(this).select("a").html());
          // UNSELECT THE USER SELECTED VIEW
          if(_show_snapshots){
            d3.selectAll(".user-snapshot").unSelected();
            d3.selectAll(".each-question").unSelected();
          };
          // DON’T DO THE SCALE UPDATE HERE
          // AS USERS MAY HAVE MODIFIED IT MANUALLY
          // AND IT MAY FRUSTRATING TO SEE THE SCALE CHANGE 
          // EVERY TIME A NEW DIMENSION IS SET
          layoutVIEW("scatterplot",data);
          updateXAXIS(d3.select(this).select("a").html());
          return;
        });
      // THE USER OPENS THE COLOR-ENCODING MENU
      // THIS STOPS THE ANIMATION OF THE COLOR-ENCODING BUTTON
      // (I.E. THE COLOR-ANIMATED CIRCULAR BUTTON AT THE
      // BOTTOM OF THE CANVAS)
      d3.select(".animate-point-color")
        .on("click",function(){
          // TRACE USER EVENT
          //console.log(["user","click","color-menu-button",true])
          trace.event("user","click","color-menu-button",true);
          d3.select(this)
            .classed("animate-point-color",false);
          return;
        });
      // THE USER CHANGES THE COLOR-CODING FOR THE NODES
      // IN THE COLOR-CODING DROPUP MENU
      d3.selectAll("li.color")
        // SEPARATE THE mousedown/mouseup (INSTEAD OF SIMPLE click)
        // SO THAT THE USER CAN SEE THE HIGHLIGHTING OF THE SELECTED VALUE
        .on("mousedown",function(){
          // TRACE USER EVENT
          //console.log(["user","mousedown","scale-menu-option",this.id])
          trace.event("user","mousedown","scale-menu-option",this.id);
          d3.selectAll(".color.selected")
            .unSelected();
          d3.select(this)
            .isSelected();
          return;
        })
        .on("mouseup",function(){
          // TRACE USER EVENT
          //console.log(["user","mouseup","scale-menu-option",this.id])
          trace.event("user","mouseup","scale-menu-option",this.id);
          // UNSELECT THE USER SELECTED VIEW
          if(_show_snapshots){
            d3.selectAll(".user-snapshot").unSelected();
            d3.selectAll(".each-question").unSelected();
          };
          // DETERMINE WHICH COLOR-CODING TO USE
          var color_value=this.id.toLowerCase();
          // UPDATE THE NODES’ COLOR
          d3.selectAll(".node")
            .attr("class",function(d){
              // REMOVE PREVIOUS COLOR CODING
              d3.select(this).classed(d.parti_s.toLowerCase(),false);
              d3.select(this).classed(d.sexe.toLowerCase(),false);
              // DETERMINE THE NEW CLASS/COLOR-CODING
              var color_class=d3.select(this).attr("class");
              if(color_value!=="null"){
                color_class+=" "+d[color_value].toLowerCase();
              };
              return color_class;
            });
          // TRACE SYSTEM EVENT
          //console.log(["system","display","node-color-encoding",true])
          trace.event("system","display","node-color-encoding",true);

          // UPDATE THE COLOR-CONDING LEGEND AT THE BOTTOM OF THE CANVAS
          d3.select(".legend")
            .html(_legendes[color_value]);
          // TRACE SYSTEM EVENT
          //console.log(["system","display","node-color-legend",true])
          trace.event("system","display","node-color-legend",true);

          // HIDE THE QUESTION SYSTEM PROMPTER
          // TO MAKE SURE THAT THE LEGEND IS VISIBLE
          if(_show_prompter){
            d3.select(".prompter")
              .hide();
            // TRACE SYSTEM EVENT
            //console.log(["system","display","question-system-prompter",false])
            trace.event("system","display","question-system-prompter",false);
          };

          return;
        });
      // --------------------------------------------------------------------- //
      // BRUSH-SELECTION ACTIONS --------------------------------------------- //
      // --------------------------------------------------------------------- //
      var brush = d3.select(".main-group").insert("g",".map")
        .datum(function(){
          return {selected:false,previouslySelected:false};
        })
        .attr("class","brush")
        .attr("stroke-dasharray","5,5")
        .call(d3.svg.brush()
          .x(d3.scale.identity().domain([0,f_width]))
          .y(d3.scale.identity().domain([0,f_height]))
          .on("brushstart",function(d){
            // TRACE USER EVENT
            //console.log(["user","brush","canvas",true])
            trace.event("user","brush","canvas",true);

            d3.selectAll(".node").each(function(d){ 
              d.previouslySelected=shiftKey && d.selected;
              return;
            });
            d3.selectAll(".map-centroids")
              .classed("no-pointer-evt",true);
          })
          .on("brush",function(){
            // PREVENT ALL NODE POPOVERS
            d3.selectAll(".inspector-object")
              .remove();
            var extent=d3.event.target.extent();
            d3.selectAll(".node").classed("active-dot",function(d){
              return d.selected=d.previouslySelected ^
              (extent[0][0]<=d.temp_x && d.temp_x<extent[1][0]
              && extent[0][1]<=d.temp_y && d.temp_y<extent[1][1]);
            });
            // SHOW POPOVER WITH SELECTED NODES COUNT
            showSelectedPopover();
            // TRACE SYSTEM EVENT
            //console.log(["system","update","selected-nodes",d3.selectAll(".node.active-dot")[0].length])
            trace.event("system","update","selected-nodes",d3.selectAll(".node.active-dot")[0].length);
          })
          .on("brushend",function(){
            // TRACE USER EVENT
            //console.log(["user","brush","canvas",false])
            //console.log(["user","select","nodes",d3.selectAll(".node.active-dot")[0].length])
            trace.event("user","brush","canvas",false);
            trace.event("user","select","nodes",d3.selectAll(".node.active-dot")[0].length);
            // UNSELECT THE USER SELECTED VIEW
            if(_show_snapshots){
              d3.selectAll(".user-snapshot").unSelected();
              d3.selectAll(".each-question").unSelected();
            };
            // REMOVE ALL NODE POPOVERS
            d3.selectAll(".inspector-object")
              .remove();
            // REMOVE THE TUTORIAL
            cleartutorialCLICKDRAG();
            // IF NO NODES ARE SELECTED ADD THE TUTORIAL
            if(d3.selectAll(".active-dot")[0].length===0){
              tutorialCLICKDRAG();
            };
            // IF NOT ALL NODES ARE SELECTED
            // ADD THE SELECT-ALL BUTTON
            if(d3.selectAll(".active-dot")[0].length!==d3.selectAll(".node")[0].length){
              d3.select(".select-all-button").show();
            };
            d3.event.target.clear();
            d3.select(this).call(d3.event.target);
            d3.selectAll(".active-dot").moveToFront();
            d3.selectAll(".label").moveToFront();
            d3.selectAll(".map-centroids")
              .classed("no-pointer-evt",false);
            return;
          })
        );
      return;
    });
  
  });

  // --------------------------------------------------------------------- //
  // LOAD THE QUESTIONS IN THE QUESTION SYSTEM --------------------------- //
  // --------------------------------------------------------------------- //
  // DETERMINE WHETHER TO SHOW THE QUESTION SYSTEM PROMPTER
  // (I.E., IF THE QUESTION SYSTEM IS OUT OF VIEW)
  // FIRST DETERMINE THE HEIGHT OF THE WINDOW 
  var _window_h=window.innerHeight;
  // THEN DETERMINE WHETHER THE WINDOW IS BIG ENOUGH
  //TO SEE THE QUESTION SYSTEM
  if(_window_h>1000 || !_show_prompter){
    d3.select(".prompter").remove();
    // TRACE SYSTEM EVENT
    //console.log(["system","display","question-system-prompter",false])
    trace.event("system","display","question-system-prompter",false);
  }else{
    d3.select(".prompter")
      .classed("prompter-animate-in",true);
    // TRACE SYSTEM EVENT
    //console.log(["system","display","question-system-prompter",true])
    trace.event("system","display","question-system-prompter",true);
  };
  // NEXT DETERMINE WHETHER THE WINDOW IS SCROLLED DOWN
  // (QUESTION SYSTEM RELATED)
  $(window).scroll(function(){
    // TRACE USER EVENT
    //console.log(["user","scroll","continuous",true])
    trace.event("user","scroll","continuous",true);
    if(_show_prompter){
      if($(window).scrollTop()>100){
        d3.select(".prompter").hide();
        // TRACE SYSTEM EVENT
        //console.log(["system","display","question-system-prompter",false])
        trace.event("system","display","question-system-prompter",false);
      }else{
        d3.select(".prompter").show();
        // TRACE SYSTEM EVENT
        //console.log(["system","display","question-system-prompter",true])
        trace.event("system","display","question-system-prompter",true);
      };
    };
  });
  // DISPLAY A LOADING GIF WHILE THE DATA IS BEING QUERIED
  $(".loader").hide()
    .ajaxStart(function(){
      $(this).show();
    })
    .ajaxStop(function(){
      $(this).hide();
    });
  // THE USER SUBMITS A NEW QUESTION
  $("#question-process").click(function(){
    // GET THE USER’S/QUESTION AUTHOR’S NAME
    // AND IF IT IS NOT SET, MAKE IT AN ANONYMOUS ENTRY
    var user_name=$("#q-author-name").val();
    if(user_name.length===0){
      user_name="Anonyme";
    };
    // TRACE USER EVENT
    //console.log(["user","click","submit-question","["+[getVIEW().toString(),user_name,$("#question-text").val()]+"]"])
    trace.event("user","click","submit-question","["+[getVIEW().toString(),user_name,$("#question-text").val()]+"]");

    if($("#question-text").val()!==""){
      // SEND THE USER’S QUESSTION
      var data_pack={question:$("#question-text").val(),author:user_name,c_id:_c_id,uuid:sessionId,action:"post"};

      // IF THE USER HAS CHOSEN TO TAKE A SNAPSHOT OF THE VISUALIZATION
      if(_show_snapshots && d3.select(".q-snapshot").classed("selected")===true){
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

        data_pack={question:$("#question-text").val(),author:user_name,action:"post_question_with_snapshot",uuid:sessionId,c_id:_c_id,view:getVIEW(),scaleindicator:vsindicator,scalesdata:vsdata,scalessdata:vssdata,nodecolor:getCOLORS(),maxscale:getSCALERANGE(),scrutin:getSCRUTIN(),xindicator:vxindicator,xdata:vxdata,xsdata:vxsdata,yindicator:vyindicator,ydata:vydata,ysdata:vysdata,selectednodes:selected_nodes.toString()};
      };      

      /*$.post("question_system/questions.php?action=post",{question:$("#question-text").val(),author:user_name,c_id:_c_id,uuid:sessionId},function(data){
          // TRACE SYSTEM EVENT
          //console.log(["system","post","question-form","["+[getVIEW().toString(),user_name,$("#question-text").val()]+"]"])
          trace.event("system","post","question-form","["+[getVIEW().toString(),user_name,$("#question-text").val()]+"]");

          $(".questions").html(data);
          $("#question-text").val("");
          $("#q-author-name").val("");

          // TRACE SYSTEM EVENT
          //console.log(["system","clear","question-form",true])
          trace.event("system","clear","question-form",true);
      });*/
      $.ajax({
        type: "POST",
        url: "question_system/questions.php",
        data: data_pack
      })
      .done(function(txt){
        // TRACE SYSTEM EVENT
        //console.log(["system","post","response-form",true])
        trace.event("system","post","question-form",true);
        d3.select(".questions").html(txt);
        d3.select(".snapshot").classed("selected",false);
        $("#question-text").val("");
        $("#q-author-name").val("");
            // TRACE SYSTEM EVENT
            //console.log(["system","clear","response-form",true])
            trace.event("system","clear","question-form",true);
            return;
      });
    };
  });
  // THE USER SORTS THE QUESTIONS’ ORDER
  d3.selectAll(".q-sort")
    .on("click",function(){
      // TRACE USER EVENT
      //console.log(["user","click","sort-questions","["+[getVIEW().toString(),this.id]+"]"])
      trace.event("user","click","sort-questions","["+[getVIEW().toString(),this.id]+"]");

      d3.select(".response-container")
        .remove();
      // TRACE SYSTEM EVENT
      //console.log(["system","display","responses-system",false])
      trace.event("system","display","responses-system",false);

      var sort_id=this.id;
      d3.selectAll(".q-sort")
        .attr("disabled",null);
      d3.select(this)
        .attr("disabled","disabled");
      // MAKE A NEW QUERY WITH THE SORT REQUEST
      // AND RE-DISPLAY THE QUESTIONS
      $.post("question_system/questions.php?action=sort",{sort:sort_id,c_id:_c_id},function(data){
          $(".questions").html(data);
          // TRACE SYSTEM EVENT
          //console.log(["system","post","sort-questions","["+[getVIEW().toString(),sort_id]+"]"])
          trace.event("system","post","sort-questions","["+[getVIEW().toString(),sort_id]+"]")
      });
      return;
  });

  // ADDITIONAL INFORMATION
  d3.select(".information-icon")
    .on("click",function(){
      // TRACE USER EVENT
      //console.log(["user","click","sort-questions","["+[getVIEW().toString(),this.id]+"]"])
      trace.event("user","click","show-site-info",true);
      // DRAW THE CONTAINER FOR THE SITE INFO
      var info_container=d3.select("body")
          .append("div")
          .attr("class","site-info-bg");

      var info_box=info_container.append("div")
          .attr("class","site-info-container");

      info_box.append("p")
          .attr("class","lead")
          .html("Ce site fut dessiné par <a href='http://jyby.eu/' target='_blank'>Jeremy Boy</a>, dans le cadre d’un projet de recherche intitulé <a href='http://peopleviz.gforge.inria.fr/trunk/' target='_blank'>«&thinsp;Peopleviz: Information Visualization for the People&thinsp;»</a>. Il a pour but de présenter un ensemble de données concernant nos députés pour mieux comprendre qui sont nos représentants et ce qu’ils font à l’Assemblée Nationale. Ce site est une initiative personnelle qui ne cherche ni à prouver ou convaincre, mais simplement à faciliter l’exploration et l’analyse de ces données.");

      info_box.append("p")
          .attr("class","bio")
          .html("Jeremy Boy est designer graphique, formé à l’EnsAD et actuellement en fin de thèse en visualization d’informations à l’Inria, Telecom ParisTech, et l’EnsadLab. Il est encadré par <a href='https://www.lri.fr/~fekete/' target='_blank'>Jean-Daniel Fekete</a> (Inria) et <a href='http://ses.telecom-paristech.fr/detienne/' target='_blank'>Françoise Détienne</a> (CNRS – Telecom ParisTech), et suivi par <a href='http://remybourganel.com/portfolio_english/bio_%7C.html' target='_blank'>Rémy Brouganel</a> (Orange – EnsadLab). Ce site fut développé à l’aide des bibliothèques <a href='http://d3js.org/' target='_blank'>d3.js</a>, <a href='http://jquery.com/' target='_blank'>jQuery</a>, <a href='http://underscorejs.org/' target='_blank'>underscore.js</a> et <a href='http://getbootstrap.com/' target='_blank'>Bootstrap</a>.");

        info_box.append("p")
          .attr("class","lead text-right")
          .style("color","tomato")
          .style("cursor","pointer")
          .html("Fermer &#8855;")
          .on("click",function(){
            // TRACE USER EVENT
            //console.log(["user","click","sort-questions","["+[getVIEW().toString(),this.id]+"]"])
            trace.event("user","click","show-site-info",false);
            info_container.remove();
            return;
          });

      return;
    });


</script>


</html>