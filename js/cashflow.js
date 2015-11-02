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
		$('#cashflow').prepend("<div>Networth: "+net_worth+'</div>');
		get_bill_data();
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
		//Generate Content-Tables
		$('#cashflow').append(
			'<div id="bills">'+
				'<table class="table table-bordered table-hover table-striped table-condensed content-table">'+
					'<tr class="row header-row"></tr>'+
				'</table>'+
			'</div>'+
			'<div id="pay_periods">'+
				'<table class="table table-bordered table-hover table-striped table-condensed content-table">'+
					'<tr class="row header-row">'+
						'<td>Pay Date</td>'+
						'<td>Income</td>'+
						'<td>Expenses</td>'+
						'<td>Delta</td>'+
						'<td>Cashflow</td>'+
					'</tr>'+
				'</table>'+
			'</div>'
		);
		
		//Generate Header Row
		for(var attribute in bills[0]){
			$('#cashflow #bills .content-table .header-row').append(
				'<td class="">'+attribute.replace(/_/,' ','g')+'</td>'
			);
		}
		//Generate Content Rows
		for(var i = 0; i < bills.length; i++){
			$('#cashflow #bills .content-table').append('<tr class="row">');
			for(var attribute in bills[i]){
				//var format_classes = attribute_formats[attribute]+hidden_attributes[attribute];
				var value = bills[i][attribute];
				if(isNull(value)){value = '';}
				$('#cashflow #bills .content-table .row').last().append('<td class="">'+value+'</td>')
			}
			$('#cashflow #bills .content-table').append('</tr>');
		}
		get_cashflow_data();
	});
}

//Get Cashflow Data
var get_cashflow_data = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/cashflow.sql"
		}
	})
	.done(function(data){
		cashflow = $.parseJSON(data)[0];
		$('#cashflow').prepend("<div>Cash on hand: "+cashflow.bank+'</div>');
		
		//Generate Pay Period Object
		var initial_pay_date = new Date('2015','00','09');
		var two_weeks_ms = 14 * 86400000;
		pay_periods = [
			{
				pay_period : new Date(initial_pay_date.getTime()),
				"income" : 0,
				"expenses" : 0,
				"delta" : 0,
				"cashflow" : 0
			},{
				pay_period : new Date(initial_pay_date.getTime()),
				"income" : cashflow.payroll,
				"expenses" : 0,
				"delta" : 0,
				"cashflow" : 0
			},{
				pay_period : new Date(initial_pay_date.getTime()),
				"income" : (cashflow.payroll * 2).toFixed(2),
				"expenses" : 0,
				"delta" : 0,
				"cashflow" : 0
			}
		];
		pay_periods[0].pay_period.setTime(
			two_weeks_ms*(
				Math.floor(
					(today.getTime()-initial_pay_date.getTime())
					/
					two_weeks_ms
				)
			) + initial_pay_date.getTime() + two_weeks_ms);
		pay_periods[1].pay_period.setTime(pay_periods[0].pay_period.getTime()+two_weeks_ms);
		pay_periods[2].pay_period.setTime(pay_periods[1].pay_period.getTime()+two_weeks_ms);
		for(var i = 0; i < pay_periods.length; i++){
			for(var ii = 0; ii < bills.length; ii++){
				//Convert Due Days to Full Dates
				if(bills[ii].due_day < today.getDate()){
					bills[ii].due_date = new Date(today.getFullYear(), today.getMonth()+1, bills[ii].due_day);
				}else{
					bills[ii].due_date = new Date(today.getFullYear(), today.getMonth(), bills[ii].due_day);
				}
				if(bills[ii].due_date > today && bills[ii].due_date <= pay_periods[i].pay_period){
					pay_periods[i].expenses += Number(bills[ii].amount);
				}
			}
			pay_periods[i].delta = round(pay_periods[i].income - pay_periods[i].expenses,2);
			pay_periods[i].expenses = round(pay_periods[i].expenses,2);
			pay_periods[i].cashflow = round(Number(cashflow.bank) + Number(pay_periods[i].delta),2);
			pay_periods[i].pay_period = date_iso(pay_periods[i].pay_period);
		}
		
		//Generate Content Rows
		var cashflow_attribute_formats = {
			"pay_period":"",
			"income":" numerical ",
			"expenses":" numerical ",
			"delta":" change numerical ",
			"cashflow":" change numerical "
		}
		for(var i = 0; i < pay_periods.length; i++){
			$('#cashflow #pay_periods .content-table').append('<tr class="row">');
			for (attribute in pay_periods[i]){
				var format_classes = cashflow_attribute_formats[attribute];
				$('#cashflow #pay_periods .content-table .row').last().append('<td class="'+format_classes+'">'+pay_periods[i][attribute]+'</td>');
			}
			$('#cashflow #pay_periods .content-table').append('</tr>');
		}
		color_delta('.change');
		get_annual_reports();
	});	
}


//Get Annual Reports
var get_annual_reports = function(){
	//Generate Annual Revenue Report
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/annual_revenue.sql"
		}
	})
	.done(function(data){
		var attribute_formats = {
			"fy14":" numerical ",
			"fy15":" numerical ",
			"delta":" change numerical ",
			"fy14_pr":" numerical "
		};
		var hidden_attributes = {
			"index":" hidden "
		};
		generate_standard_table('cashflow', 'annual_revenue', data, attribute_formats, hidden_attributes, true);
		//Generate Annual Expenses Report
		$.ajax({
			url: "services/php_query_handler.php",
			method: "GET",
			data: {
				"query": "sql/annual_expenses.sql"
			}
		})
		.done(function(data){
			var attribute_formats = {
				"fy14":" numerical ",
				"fy15":" numerical ",
				"delta":" change numerical ",
				"fy14_pr":" numerical "
			};
			var hidden_attributes = {
				"index":" hidden "
			};
			generate_standard_table('cashflow', 'annual_expenses', data, attribute_formats, hidden_attributes, true);
		});
	});
}

$(function(){get_net_worth();});



























