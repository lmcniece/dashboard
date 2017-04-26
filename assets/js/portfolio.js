//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////  ON DOM READY  ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//On DOM Ready
$(function(){
	get_account_data();
	map_maker();
	//Save width to determine when map redraw necessary
	init_width = $(window).width();
});

var open_account = function(){
	var holder = getCookie('holder');
	var account = getCookie('account');
	if(!isNull(holder)){
		$('.nav-tabs a[href="'+holder+'"]').click();
		if(!isNull(account)){
			$('.nav-pills a[href="'+account+'"]').click();
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////  DATA PULL  ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Global Vars
init_flag=true;
accounts={};

//Get Account Data
var get_account_data = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/accounts.sql"
		}
	})
	.done(function(data){
		accounts = $.parseJSON(data);
		for(var i = 0; i < accounts.length; i++){
			accounts[i].types = accounts[i].types.split("|");
		}
		get_holdings_data();
	});
}
	
//Get Holdings Data
var get_holdings_data = function(){
	//Vars to tracking loading status
	var total_holdings = 0;
	var holdings_loaded	= 0;
	for(var i = 0; i < accounts.length; i++){
		for(var ii = 0; ii < accounts[i].types.length; ii++){	
			total_holdings++;
			(function(i,ii){
				$.ajax({
					url: "services/php_query_handler.php",
					method: "GET",
					data: {
						"query": "sql/holdings.sql",
						"holder":accounts[i].holder,
						"type":accounts[i].types[ii]
					}
				})
				.done(function(data){
					accounts[i][accounts[i].types[ii]]=$.parseJSON(data);
					holdings_loaded++;
					//Once all holdings are loaded, generate main content
					if(holdings_loaded==total_holdings){
						if(init_flag == true){
							init_flag = false;
							generate_tabs_pills();
						}else{
							update_portfolio();
							map_maker();
						}
					}
				});
			})(i,ii); //Closure captures index for each loop
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////  CONTENT GENERATION  ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Generate Tabs and Pills
var generate_tabs_pills = function(){
	//Generate Summary Tab
	$('#portfolio-nav .nav-tabs').append(
		'<li><a data-toggle="tab" href="#summary-nav">Summary</a></li>'
	);
	$('#portfolio-content').prepend(
		'<div id="summary-nav" class="tab-pane fade in">'+
			'<ul class="nav nav-pills">'+				
			'</ul>'+
			'<div id="summary-content" class="tab-content"></div>'+
		'</div>'
	);
	//Make tabs/pills for each unique account holder and type
	for(var i = 0; i < accounts.length; i++){
		holder = accounts[i].holder;
		//Generate Account Holder Tabs
		$('#portfolio-nav .nav-tabs').append(
			'<li><a data-toggle="tab" href="#'+holder+'-nav">'+holder+'</a></li>'
		);
		$('#portfolio-content').prepend(
			'<div id="'+holder+'-nav" class="tab-pane fade in">'+
				'<ul class="nav nav-pills">'+				
				'</ul>'+
				'<div id="'+holder+'-content" class="tab-content"></div>'+
			'</div>'
		);
		//Generate Account Type Pills
		for(var ii = 0; ii < accounts[i].types.length; ii++){
			type = accounts[i].types[ii];
			$('#'+holder+'-nav .nav-pills').append(
				'<li><a data-toggle="pill" href="#'+holder+'-'+type+'">'+type+'</a></li>'
			);
			//Generate Content-Tables
			$('#'+holder+'-content').append(
				'<div id="'+holder+'-'+type+'" class="tab-pane fade">'+
					'<table class="table table-bordered table-hover table-striped table-condensed content-table"></table>'+
				'</div>'
			);
		}
	}
	update_portfolio();
};

var update_portfolio = function (){
	//Generate Lifetime Performance Report
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {"query": "sql/summary_performance.sql"}
	})
	.done(function(data){
		var headers= [
			{"label":"holder","classes":"uppercase"},
			{"label":"type","classes":"uppercase centered"},
			{"label":"cost basis","classes":"numerical"},
			{"label":"current value","classes":"numerical"},
			{"label":"roi","classes":"change numerical"}
		];
		var data = $.parseJSON(data);
		generateSortableTable('#summary-content','summary',headers,data,false);

		//Generate Account Reports
		var headers = [
			{"label":"symbol","classes":"uppercase"},
			{"label":"shares","classes":"numerical mobile-hidden"},
			{"label":"invested","classes":"numerical"},
			{"label":"value","classes":"numerical"},
			{"label":"div","classes":"numerical mobile-hidden"},
			{"label":"roi","classes":"change numerical mobile-hidden"},
			{"label":"roi perc","classes":"change numerical"},
			{"label":"basis","classes":"numerical"},
			{"label":"price","classes":"numerical"},
			{"label":"change","classes":"change numerical"},
			{"label":"change perc","classes":"change numerical mobile-hidden"},
			{"label":"last updated","classes":"numerical mobile-hidden"}
		]
		for(var i = 0; i < accounts.length; i++){
			var holder = accounts[i].holder;
			for(var ii = 0; ii < accounts[i].types.length; ii++){
				type = accounts[i].types[ii];
				generateSortableTable("#"+holder+'-'+type,holder+"-"+type+"-content",headers,accounts[i][accounts[i].types[ii]],true);
			}
		}
	});
};

var update_stock_chart = function(symbol){
	$('#stock-chart').attr({'src':'static/img/progress.gif', 'alt':'loading...'});
	var symbol = symbol.toUpperCase();
	var period = $('#chart-period').val();
	var period_type = $('#chart-period-type').val();
	var interval = '';
	if (period_type == "d"){
		var interval = '&i=1800';
	}
	if(!String(symbol).match(/X$/)){
		var stock_url = 'https://www.google.com/finance/getchart?q='+symbol+'&p='+period+period_type+interval;
		var alt = 'https://www.google.com/finance?q='+symbol
	}else{
		var stock_url = 'static/img/stock_chart.png';
		var alt = 'https://www.google.com/finance?q=MUTF%3A'+symbol;
	}
	$('#stock-chart').attr({'src':stock_url, 'alt':alt})
	$('#stock-chart-modal .modal-title').text(symbol);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////  EVENT HANDLERS  //////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//On Window Resize
$(window).resize(function(){
	var current_width = $(window).width();
	if (Math.abs(init_width-current_width)>150){
		map_maker();
		init_width = current_width;
	}
});

//Redraw map maker when accessing portfolio tab
$('.nav').on('click', function(e){
	var target = $(e.target).attr("href");
	if(target=='#portfolio'){
		setTimeout(function(){map_maker();open_account();},1000);
	}
});

//Set cookie to retrieve last viewed account on portfolio page
$(document).on('click', '.nav-tabs', function(e){
	var holder = $(e.target).attr("href");
	setCookie('holder', holder, 365);
	setCookie('account', '', 365);
});
$(document).on('click', '.nav-pills', function(e){
	var account = $(e.target).attr("href");
	setCookie('account', account, 365);
});

//Update portfolio button
$('body').on('click', '#update-portfolio', get_account_data);

//Update Google chart button
$('#chart-container').on('click', '#update-chart', function(){
	var symbol = $('#stock-chart-modal .modal-title').text();
	update_stock_chart(symbol);
});

$('#portfolio-content').on('click', 'tbody tr', function(){
	var symbol = $(this).children("td").eq(0).html();
	update_stock_chart(symbol);
	$('#stock-chart-modal').modal('show');
});

$('#stock-chart').on('click',function(){
	window.open($(this).attr('alt'), '_blank');
});

$(document).keyup(function(e){
	if(e.keyCode == 13 && $(document.activeElement).attr("id") == "chart-period"){
		var symbol = $('#stock-chart-modal .modal-title').text();
		update_stock_chart(symbol);
	}
});