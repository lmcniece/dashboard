//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////  DATA PULL AND CONTENT GENERATION /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Beginning of chained updates from top to bottom
//Get Net Worth
var get_net_worth = function(){
	$('#cashflow').empty();
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/net_worth.sql"
		}
	})
	.done(function(data){
		var assets = $.parseJSON(data)[0];
		$('#cashflow').prepend(
			'<table id="assets" class="table table-bordered">'+
				"<tr>"+
					"<th>Capital Investments</th>"+
					"<th>ESPP Escrow</th>"+
					"<th>HSA Account</th>"+
					"<th>Loans Outstanding</th>"+
					"<th>Networth</th>"+
				"<tr>"+
				"</tr>"+
					'<td style="color:#0b0">'+assets.capital_investments+"</td>"+
					'<td style="color:#0b0">'+assets.espp_escrow+"</td>"+
					'<td style="color:#0b0">'+assets.hsa+"</td>"+
					'<td style="color:#f00">'+assets.loans_outstanding+"</td>"+
					'<td style="color:#eee">'+assets.net_worth+"</td>"+
				"</tr>"+
			"</table>"
		);
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
		//Set data to global var bills for use by pay period calculation function
		bills = $.parseJSON(data);
		//Generate Content-Table
		var attribute_formats = {
			account:" uppercase ",
			amount:" numerical ",
			due_day:" numerical "
		};
		generate_standard_table('cashflow', 'bills', bills, attribute_formats, false);
		get_cashflow_data();
	});
}

//Get Cashflow Data
var get_cashflow_data = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {"query": "sql/cashflow.sql"}
	})
	.done(function(data){
		cashflow = $.parseJSON(data)[0];
		$('#cashflow').prepend(
			'<div>Cash on hand: '+cashflow.bank+
				'<span id=cash-edit data-toggle="modal" data-target="#bank-edit-modal">&#x2699</span>'+
			'</div>'
		);

		//Generate Pay Period Object
		pay_periods = [
			{
				pay_day : new Date(),
				income : 0,
				expenses : 0,
				delta : 0,
				cashflow : 0
			},{
				pay_day : new Date(),
				income : cashflow.payroll,
				expenses : 0,
				delta : 0,
				cashflow : 0
			},{
				pay_day : new Date(),
				income : (cashflow.payroll * 2).toFixed(2),
				expenses : 0,
				delta : 0,
				cashflow : 0
			},{
				pay_day : new Date(),
				income : (cashflow.payroll * 3).toFixed(2),
				expenses : 0,
				delta : 0,
				cashflow : 0
			}
		];

		var today = new Date();
		if(today<15 || 30<today){
			pay_periods[0].pay_day.setDate(15);
			pay_periods[1].pay_day.setDate(30);
			pay_periods[2].pay_day.setDate(15); pay_periods[2].pay_day.setMonth(today.getMonth()+1);
			pay_periods[3].pay_day.setDate(30); pay_periods[3].pay_day.setMonth(today.getMonth()+1);
		}else{
			pay_periods[0].pay_day.setDate(30);
			pay_periods[1].pay_day.setDate(15); pay_periods[1].pay_day.setMonth(today.getMonth()+1);
			pay_periods[2].pay_day.setDate(30); pay_periods[2].pay_day.setMonth(today.getMonth()+1);
			pay_periods[3].pay_day.setDate(15); pay_periods[3].pay_day.setMonth(today.getMonth()+2);
		}

		for(var i = 0; i < pay_periods.length; i++){
			for(var ii = 0; ii < bills.length; ii++){
				bills[ii].current_due_date = new Date(today.getFullYear(), today.getMonth(), bills[ii].due_day);
				bills[ii].next_due_date = new Date(today.getFullYear(), today.getMonth()+1, bills[ii].due_day);
				//Add bill amount if coming due
				if((bills[ii].current_due_date > today && bills[ii].current_due_date <= pay_periods[i].pay_day)){
					pay_periods[i].expenses += Number(bills[ii].amount);
				}
				//Add bill if coming due next rotation
				if(bills[ii].next_due_date > today && bills[ii].next_due_date <= pay_periods[i].pay_day){
					pay_periods[i].expenses += Number(bills[ii].amount);
				}
			}
			pay_periods[i].delta = round(pay_periods[i].income - pay_periods[i].expenses,2);
			pay_periods[i].expenses = round(pay_periods[i].expenses,2);
			pay_periods[i].cashflow = round(Number(cashflow.bank) + Number(pay_periods[i].delta),2);
			pay_periods[i].pay_date = date_iso(pay_periods[i].pay_date);
		}

		//Generate Content Rows
		var attribute_formats = {
			pay_period:" ",
			income:" numerical ",
			expenses:" numerical ",
			delta:" change numerical ",
			cashflow:" change numerical "
		}
		generate_standard_table('cashflow', 'pay-periods', pay_periods, attribute_formats, false);
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
			"account":" uppercase ",
			"prior":" numerical ",
			"current":" numerical ",
			"delta":" change numerical ",
			"pro_rated":" numerical "
		};
		var data = $.parseJSON(data);
		generate_standard_table('cashflow', 'annual_revenue', data, attribute_formats, true);
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
				"account":" uppercase ",
				"prior":" numerical ",
				"current":" numerical ",
				"delta":" change numerical ",
				"pro_rated":" numerical "
			};
			var data = $.parseJSON(data);
			generate_standard_table('cashflow', 'annual_expenses', data, attribute_formats, true);
		});
	});
}

$(function(){get_net_worth();});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////  DATABASE UPDATE  ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var update_cash_on_hand = function(account, amount, type, date){
	//Update cashflow table with new bank holdings amount
	var amount = $('#bank-amount').val();
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/bank_edit.sql",
			"amount" : amount
		}
	})
	.done(function(result){
		$('#bank-edit-modal').modal('hide');
		if(result = ' []'){
			result = 'Update Successful!';
		}
		notification_modal(result);
		get_net_worth();
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////  EVENT HANDLERS  /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Click on submit buttons triggers form submit
$('#bank-edit-modal').on('click','#submit-bank-edit', update_cash_on_hand);
