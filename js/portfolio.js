//Global Vars
init_flag=true;
accounts={};
portfolio_attribute_formats = {
	"symbol":"",
	"shares":" numerical ",
	"invested":" numerical ",
	"roi":" change numerical ",
	"roi_perc":" change numerical ",
	"basis":" numerical ",
	"price":" numerical ",
	"change":" change numerical ",
	"change_perc":" change numerical ",
	"last_updated":" numerical ",
}
portfolio_hidden_attributes = {
	"roi":" mobile-hidden ",
	"change":" mobile-hidden ",
	"last_updated":" mobile-hidden ",
	"index":" hidden "
}

function isNull(e){
    return ( e==null || e==undefined || String(e).toUpperCase()=="NULL" || e=="" || String(e).toUpperCase()=="UNDEFINED");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////  DATA PULL  ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
					console.log("total: "+total_holdings+" loaded: "+holdings_loaded);
					//Once all holdings are loaded, generate main content
					if(holdings_loaded==total_holdings){
						if(init_flag == true){
							init_flag = false;
							generate_tabs_pills();
						}else{
							update_portfolio();
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
	//Activate Init Tab-Pill
	/*$('#portfolio-nav .nav-tabs li').eq(0).addClass("active");
	$('#portfolio-content .tab-pane').eq(0).addClass("active in");
	$('.nav-pills li').eq(0).addClass("active");
	$('#portfolio-content .tab-pane .tab-pane').eq(0).addClass("active in");
	*/update_portfolio();
};

var update_portfolio = function (){
	//Iterate Account Holders
	for(var i = 0; i < accounts.length; i++){
		holder = accounts[i].holder;
		//Iterate Account Types
		for(var ii = 0; ii < accounts[i].types.length; ii++){
			type = accounts[i].types[ii];
			//Clear #holder-type content-table
			$('#'+holder+'-'+type+' .content-table').html('<tr class="row header-row"></tr>');
			//Generate Header Row
			for(var attribute in accounts[i][type][0]){
				var format_classes = portfolio_hidden_attributes[attribute];
				$('#'+holder+'-'+type+' .content-table .header-row').append(
					'<td class="'+format_classes+'">'+attribute.replace(/_/,' ','g').replace('perc','%')+'</td>'
				);
			}
			//Iterate Holdings
			for(var iii = 0; iii < accounts[i][type].length; iii++){
				//Generate Content Rows
				$('#'+holder+'-'+type+' .content-table').append('<tr class="row">');
				for(var attribute in accounts[i][type][iii]){
					var format_classes = portfolio_attribute_formats[attribute]+portfolio_hidden_attributes[attribute];
					var value = accounts[i][type][iii][attribute];
					if(isNull(value)){value = '';}
					$('#'+holder+'-'+type+' .content-table .row').last().append('<td class="'+format_classes+'">'+value+'</td>')
				}
				$('#'+holder+'-'+type+' .content-table').append('</tr>');
			}
		}
	}
	$('.change, .percentage').each(function(){
		var value = $(this).text();
		switch(true){
			case value > 0:
				$(this).css("color", "#00ce00");
				break;
			case value < 0:
				$(this).css("color", "red");
				break;
			case value == 0:
				$(this).css("color", "white");
		}
	});
};

var update_stock_chart = function(symbol){
	$('#stock-chart').attr({'src':'static/images/progress.gif', 'alt':'loading...'})
	if(!symbol){var symbol = $('.modal-title').text();}
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
		var stock_url = 'static/images/stock_chart.png';
		var alt = 'https://www.google.com/finance?q=MUTF%3A'+symbol;
	}
	$('#stock-chart').attr({'src':stock_url, 'alt':alt})
	$('.modal-title').text(symbol);
}


//On DOM Ready
$(get_account_data());

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////  EVENT HANDLERS  //////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$('#update-portfolio').on('click', get_account_data);
$('#chart-container').on('click', '#update-chart', function(){update_stock_chart();});


$('#portfolio-content').on('click', '.content-table .row', function(){
	var symbol = $(this).children("td").eq(0).html();
	console.log(symbol);
	update_stock_chart(symbol);
	$('#modal-btn').click();
});

$('#stock-chart').on('click',function(){
	window.open($(this).attr('alt'), '_blank');
});

$(document).keyup(function(e){
	if(e.keyCode == 13 && $(document.activeElement).attr("id") == "chart-period"){
		update_stock_chart();
	}
});