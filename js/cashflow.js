//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////  DATA PULL  ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get Net Worth
var get_net_worth = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/net_worth.sql"
		}
	})
	.done(function(data){
		net_worth = $.parseJSON(data)[0].net_worth;
		$('#cashflow').append("Networth: "+net_worth);
	});
}

//Get Bill Data
var get_bill_data = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/bills.sql"
		}
	})
	.done(function(data){
		bills = $.parseJSON(data);
		//Generate Content-Table
		$('#cashflow').append(
			'<div id="bills">'+
				'<table class="table table-bordered table-hover table-striped table-condensed content-table">'+
					'<tr class="row header-row"></tr>'+
				'</table>'+
			'</div>'
		);
		
		//Generate Header Row
		for(var attribute in bills[0]){
			$('#cashflow .content-table .header-row').append(
				'<td class="">'+attribute.replace(/_/,' ','g')+'</td>'
			);
		}
		//Generate Content Rows
		for(var i = 0; i < bills.length; i++){
			$('#cashflow .content-table').append('<tr class="row">');
			for(var attribute in bills[i]){
				//var format_classes = attribute_formats[attribute]+hidden_attributes[attribute];
				var value = bills[i][attribute];
				if(isNull(value)){value = '';}
				$('#cashflow .content-table .row').last().append('<td class="">'+value+'</td>')
			}
			$('#cashflow .content-table').append('</tr>');
		}
	});
}
/*
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
				var format_classes = hidden_attributes[attribute];
				$('#'+holder+'-'+type+' .content-table .header-row').append(
					'<td class="'+format_classes+'">'+attribute.replace(/_/,' ','g').replace('perc','%')+'</td>'
				);
			}
			//Iterate Holdings
			for(var iii = 0; iii < accounts[i][type].length; iii++){
				//Generate Content Rows
				$('#'+holder+'-'+type+' .content-table').append('<tr class="row">');
				for(var attribute in accounts[i][type][iii]){
					var format_classes = attribute_formats[attribute]+hidden_attributes[attribute];
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
*/

$(function(){
	get_net_worth();
	get_bill_data();
});