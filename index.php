<html>
	<head>
		<link rel="stylesheet" type="text/css" href="assets/css/global.css">
		<link rel="icon" type="image/png" href="static/img/favicon48.png">
		<!--Standard Script Includes-->
		<script src="assets/lib/jquery-2.1.4.min.js"></script>
		<script src="assets/lib/jquery-ui.js"></script>
		<script src="assets/lib/bootstrap.js"></script>
		<script src="js/global_vars_funcs.js"></script>
	</head>
	<style>
		body{
			text-align: center;
			background: #000;
			font-family: sans-serif;
			font-weight: 100;
			color: #0ff;
		}
		td{
			background: #0af;
			color:#000;
			font-size:4em;
			text-align:center;
			border:2px solid black;
		}
		.advent-image{
			max-width:100%;
		}
		.opened_day{
			z-index: 11;
			position:relative;
		}
		.container{
			margin-right:auto;
			margin-left:auto;
		}
		#quote-container{
			width:50%;
		}
		#jona_lisa{
			height:400px;
			width: 295px;;
		}
		#archon{
			height:400px;
			width: 310px;;
		}
		#image_overlay-container{
			position: absolute;
			width:500px;
			z-index: 11;
		}
		#overlay{
			background-color: rgba(0,0,0,.4);
			position: absolute;
			top: 0;
			left: 0;
			width:100%;
			height:100%;
			z-index: 10;
		}
	</style>
	<body>
		<div id="king_queen-container" class="container">
			<img id="archon" src="assets/img/archon.jpg">
			<img id="jona_lisa" src="assets/img/jona_lisa.jpg">
		</div>
		<div id="quote-container" class="container">
			<h3 style="text-align:left">
				"Thou must persist through forty days and forty nights, forty suns and forty moons. If thou doest this for me, heaven's gate will open unto thee and basketballs will fall from the sky." 
			</h3>
			<h5 style="text-align:right">
				~ Third Book of the Revelations of Jona Lisa 17:9
			</h5>
		</div>
		<div id="advent-container" class="container"></div>
		<div id="image_overlay-container" class="container"></div>
		<div id="overlay"></div>
	</body>
</html>
<script>

function openDays(){
	var endtime = "Fri Mar 16 2017 00:00:00 GMT-0600 (Central Standard Time)";
	var t = Date.parse(endtime) - Date.parse(new Date());
	var days_remaining = Math.floor(t / (1000 * 60 * 60 * 24));
	for(var i=days_remaining;i<41;i++){
		$("#cell-"+i).css("background","#f00");
		$("#cell-"+i).addClass("opened_day");
		$("#cell-"+i).html('<img class="advent-image" src="assets/img/advent-imgs/'+i+'.gif">');
	}
	$(".opened_day" ).mouseover(function(){
		$("#image_overlay-container").css("display","block");
		$("#overlay").css("display","block");
		$("#image_overlay-container").css("left",$( window ).width()/2-250);
		$("#image_overlay-container").css("top",$(window).scrollTop()+50);
		$("#image_overlay-container").html('<img class="advent-image" src="assets/img/advent-imgs/'+$(this).attr("image_num")+'.gif">');
	});
	$(".opened_day" ).mouseout(function(){
		$("#image_overlay-container").css("display","none");
		$("#overlay").css("display","none");
	});
}

function generateTable(rows, columns, container){
	var table = '<table>';
	for(var i=0;i<rows;i++){
		table += '<tr>';
		for(var ii=0;ii<columns;ii++){
			var image_num = String(40-(i*columns+ii));
			table += '<td id="cell-'+image_num+'" image_num="'+image_num+'">'+image_num+'</td>'
		}
		table += '</tr>';
	}
	table += '</table>';
	container.html(table);
	
}

function calculateCSS(columns){
	var win_width = $( window ).width();
	$("td").css("height",(win_width*.9)/columns).css("width",(win_width*.9)/columns);
	$("#advent-container").css("width", (win_width*.9));
}

$("#overlay").css("display","none");
generateTable(5,8,$("#advent-container"));
calculateCSS(8);
openDays();

</script>