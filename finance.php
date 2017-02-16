<?php $project_name = 'Finance Dashboard';?>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<html>
	<title><?php echo $project_name ?></title>
	<head>
		<link rel="stylesheet" type="text/css" href="assets/css/global.css">
		<link rel="icon" type="image/png" href="assets/img/favicon48.png">
		<!--Standard Script Includes-->
		<script src="assets/lib/jquery-2.1.4.min.js"></script>
		<script src="assets/lib/jquery-ui.js"></script>
		<script src="assets/lib/bootstrap.js"></script>
		<script src="assets/lib/bootstrap-sortable.js"></script>
		<script src="js/global_vars_funcs.js"></script>
		<!--Vector Map Includes-->
		<script src="assets/lib/jquery-jvectormap-2.0.4.min.js"></script>
		<script src="assets/lib/jquery-jvectormap-north_america-mill.js"></script>
		<script src="assets/lib/jquery-jvectormap-europe-mill.js"></script>
		<script src="assets/lib/jquery-jvectormap-asia-mill.js"></script>
		<script src="js/jvectormap_maker.js"></script>
		<link rel="stylesheet" type="text/css" href="assets/css/jquery-jvectormap-2.0.4.css">
		<!--Standard Style Includes-->
		<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="assets/css/bootstrap-sortable.css">
		<link rel="stylesheet" type="text/css" href="assets/css/font-awesome.min.css">
		
	</head>
	<!-- Nav Bar -->
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
			  <li><a data-toggle="tab" href="#loans">Loans</a></li>
			</ul>
		  </div>
		</div>
	</nav>
	<!-- Main Content -->
	<body>	
		<div class="container">
			<div id="loading_container">
				<img id="loading_spinner" src="assets/img/progress.gif">
				<button id="loading-cancel">Cancel</button>
			</div>
			<div id="site-content" class="tab-content">
				<div id="portfolio" class="tab-pane fade active in">
					<h1 class="page-header">
						<span class="emphasize">
							Portfolio <i id="update-portfolio" class="fa fa-refresh" aria-hidden="true"></i>
						</span>
					</h1>
					<div id="map-container"></div>
					<div id="portfolio-nav">
						<ul class="nav nav-tabs"></ul>
					</div>
					<div id="portfolio-content" class="tab-content"></div>
				</div>
				<div id="budget" class="tab-pane fade">
					<h1 class="page-header">
						<span class="emphasize">Budget</span>
					</h1>
					<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#transaction-entry-modal">
						New Transaction
					</button>
					<h1>
					<nav>
						<ul class="pager">
							<li><i id="budget-month-retreat" class="fa fa-step-backward" aria-hidden="true"></i></li>
							<span id="budget-month"></span>
							<li><i id="budget-month-advance" class="fa fa-step-forward" aria-hidden="true"></i></li>
					  </ul>
					</nav>
					</h1>
				</div>
				<div id="cashflow" class="tab-pane fade">
					<h1 class="page-header">
						<span class="emphasize">Cashflow</span>
					</h1>
				</div>
				<div id="loans" class="tab-pane fade">
					<h1 class="page-header">
						<span class="emphasize">Loans</span>
					</h1>
				</div>
			</div>
		</div>
		
		<!-- Modals -->
		<?php include 'assets/templates/modals.php';?>
	</body>
</html>

<!--Post Load Includes-->
<!--Main JS-->
<script src="js/portfolio.js"></script>
<script src="js/budget.js"></script>
<script src="js/cashflow.js"></script>
<script src="js/loans.js"></script>
<!--Loading Screen-->
<script>
<!--NavBar Fix-->
$('.navbar a').click(function() {
    var navbar_toggle = $('.navbar-toggle');
    if (navbar_toggle.is(':visible')) {
        navbar_toggle.trigger('click');
    }
});

//Ajax Loading Screen
$(function(){
    $(document).ajaxStart(function(){
		$("#loading_container").show();
		$("body").css("overflow", "hidden");
    });
    $(document).ajaxStop(function(){
		$( "#loading_container" ).hide();
		$("body").css("overflow", "auto");
    });
	$('#loading-cancel').on('click', function(){
		$( "#loading_container" ).hide();
		$("body").css("overflow", "auto");
	});
	setTimeout(function(){open_account();},500);
});

<!--Tab URI Fix-->
$(function(){
  var hash = window.location.hash;
  hash && $('ul.nav a[href="' + hash + '"]').tab('show');

  $('.navbar-nav a').click(function (e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });
});
</script>