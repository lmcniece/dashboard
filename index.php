<html>
	<head>
		<link rel="stylesheet" type="text/css" href="assets/css/global.css">
		<link rel="icon" type="image/png" href="static/img/favicon48.png">
		<!--Standard Script Includes-->
		<script src="assets/lib/jquery-2.1.4.min.js"></script>
		<script src="assets/lib/jquery-ui.js"></script>
		<script src="assets/lib/bootstrap.js"></script>
		<script src="assets/js/global_vars_funcs.js"></script>
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
		#timer{
			font-size:100px;
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
		<div id="timer" class="container"></div>
		<div id="advent-container" class="container"></div>
		<div id="image_overlay-container" class="container"></div>
		<div id="overlay"></div>
	</body>
</html>
<script>

// Set the date we're counting down to
var countDownDate = new Date("Dec 15, 2017 13:30:25").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("timer").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "DADDY IS HERE!";
  }
}, 1000);

function openDays(){
	var endtime = new Date("Dec 15, 2017 13:30:25").getTime();
	var t = endtime - Date.parse(new Date());
	var days_remaining = Math.floor(t / (1000 * 60 * 60 * 24))+1;
	for(var i=days_remaining;i<41;i++){
		$("#cell-"+i).css("background","#aaa");
		$("#cell-"+i).addClass("opened_day");
		$("#cell-"+i).html('<img class="advent-image" src="assets/img/advent-imgs/'+i+'.gif">');
	}
}

function generateTable(rows, columns, container){
	var table = '<table>';
	for(var i=0;i<rows;i++){
		table += '<tr>';
		for(var ii=0;ii<columns;ii++){
			var image_num = String((rows*columns)-(i*columns+ii));
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
generateTable(7,3,$("#advent-container"));
calculateCSS(3);
openDays();

</script>