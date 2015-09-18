<?php
    $project_name = 'Finance Dashboard';
?>

<html>
	<title><?php echo $project_name ?></title>
	<head>
		<link rel="stylesheet" type="text/css" href="static/css/global.css">
		<link rel="icon" type="image/png" href="static/images/favicon16.png" sizes="16x16">
		<link rel="icon" type="image/png" href="static/images/favicon32.png" sizes="32x32">
		<!--Standard Script Includes-->
		<script src="static/libs/jquery-2.1.4.min.js"></script>
		<script src="static/libs/jquery-ui.js"></script>
		<script src="static/libs/bootstrap.js"></script>
		<!--<script src="static/libs/autocomplete.js"></script>-->
		<script src="static/libs/typeahead.jquery.js"></script>
		<!--Standard Style Includes-->
		<link rel="stylesheet" type="text/css" href="static/css/bootstrap.css">
	</head>
<!--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////  STATIC NAVBAR  ////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
	<nav class="navbar navbar-inverse navbar-fixed-top">
		<div class="container">
		  <div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
			  <span class="sr-only">Toggle navigation</span>
			  <span class="icon-bar"></span>
			  <span class="icon-bar"></span>
			  <span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#"><?php echo $project_name ?></a>
		  </div>
		  <div class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
			  <li class="active"><a data-toggle="tab" href="#portfolio">Portfolio</a></li>
			  <li><a data-toggle="tab" href="#budget">Budget</a></li>
			  <li><a data-toggle="tab" href="#cashflow">Cashflow</a></li>
			</ul>
		  </div>
		</div>
	</nav>
	
<!--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////  MAIN CONTENT  /////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
	<body>	
		<div class="container">
			<div id="site-content" class="tab-content">
				<div id="portfolio" class="tab-pane fade active in">
					<h1 class="page-header DT_page-header block_center">
						<span class="emphasize">
							Portfolio <img id="update-portfolio"  class="icon" src="./static/images/refresh.png">
						</span>
					</h1>
					<div id="portfolio-nav">
						<ul class="nav nav-tabs"></ul>
					</div>
					<div id="portfolio-content" class="tab-content"></div>
				</div>
				<div id="budget" class="tab-pane fade"></div>
				<div id="cashflow" class="tab-pane fade"></div>
				<div id="loading_container"><img id="loading_spinner" src="static/images/progress.gif"></div>
			</div>
		</div>
<!--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////  MODAL  /////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
		<button type="button" id="modal-btn" class="btn btn-info btn-lg" data-toggle="modal" data-target="#modal-container">Open Modal</button>
		<div id="modal-container" class="modal fade" role="dialog">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title"></h4>
						</div>
						<div class="modal-body">
							<div id="chart-container" class="form-inline">
								<div class="form-group">
									<input type="number" class="form-control" id="chart-period" placeholder="Period">
									<select class="form-control" id="chart-period-type">
										<option value="d">Days</option>
										<option value="M">Month</option>
										<option value="Y">Year</option>
									</select>
									<img id="update-chart" class="icon" src="./static/images/refresh.png">
								</div>
								<p id="current-stock-chart"></p>
								<div><img id="stock-chart"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>

<!--Main JS-->
<script src="js/portfolio.js"></script>
<script src="js/cashflow.js"></script>
<!--Loading Screen-->
<script>
$(function(){
	$(document).ajaxStart(function() {
		$( "#loading_container" ).show();
		$("body").css("overflow", "hidden");
	});
	
    $(document).ajaxStop(function() {
		$( "#loading_container" ).hide();
		$("body").css("overflow", "auto");
    }); 
});
</script>

<!-- For New Transaction div
	<div id="account-search">
		<input class="typeahead" type="text" placeholder="States of USA">
	</div>
-->