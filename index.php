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
			width:100px;
			height:100px;
			background: #0f0;
			color:#000;
			font-size:40px;
			text-align:center;
		}
		#advent-container{
			margin-right:auto;
			margin-left:auto;
		}
		#jona_lisa{
			height:600px;
			width: 447px;;
		}
	</style>
	<body>
		<div id="jona_lisa-container">
			<img id="jona_lisa" src="assets/img/jona_lisa.jpg">
		</div>
		<h3>
			"Thou must persist through forty days and forty nights, forty suns and forty moons, forty periods of abject gloom. If thou does this, heaven's gate will open unto thee." 
		</h3>
		<h5 style="text-align:right">
			~ Third Book of the Revelations of Jona Lisa 17:9
		</h5>
		<div id="advent-container"></div>
		<!--<div class="image-container">
			<img src="assets/img/fire_dude.gif" alt="Not Ready" height="300" width="450">
			<img src="assets/img/tiger.gif" alt="Cherry" height="300" width="450">
			<div class="image-container"><img src="assets/img/spring_2017.jpg" alt="Cherry" height="315" width="600"></div>
		</div>-->
	</body>
</html>
<script>

function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
	'total': t,
	'days': days,
	'hours': hours,
	'minutes': minutes,
	'seconds': seconds
	};
}

function initializeClock(id, endtime) {
	var clock = document.getElementById(id);
	var daysSpan = clock.querySelector('.days');
	var hoursSpan = clock.querySelector('.hours');
	var minutesSpan = clock.querySelector('.minutes');
	var secondsSpan = clock.querySelector('.seconds');

	function updateClock() {
		var t = getTimeRemaining(endtime);

		//daysSpan.innerHTML = t.days;
		//hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
		//minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
		//secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

		if (t.total <= 0) {
			clearInterval(timeinterval);
		}
	}

	updateClock();
	var timeinterval = setInterval(updateClock, 1000);
}

function generateTable(rows, columns, container){
	var table = '<table>';
	for(var i=0;i<rows;i++){
		table += '<tr>';
		for(var ii=0;ii<columns;ii++){
			table += '<td id="cell-'+i+'-'+ii+'">'+String(40-(i*10+ii))+'</td>'
		}
		table += '</tr>';
	}
	table += '</table>';
	container.html(table);
	
}
var deadline = "Fri Mar 16 2017 00:00:00 GMT-0600 (Central Standard Time)";
//initializeClock('clockdiv', deadline);
generateTable(4,10,$("#advent-container"));
</script>