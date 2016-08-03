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
		//Set data to global var bills for use by pay period calculation function
		bills = $.parseJSON(data);
		//Generate Content-Table
		var attribute_formats = {
			"account":" uppercase ",
			"amount":" numerical ",
			"due_day":" numerical "
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
			},{
				pay_period : new Date(initial_pay_date.getTime()),
				"income" : (cashflow.payroll * 3).toFixed(2),
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
		pay_periods[3].pay_period.setTime(pay_periods[2].pay_period.getTime()+two_weeks_ms);
		for(var i = 0; i < pay_periods.length; i++){
			for(var ii = 0; ii < bills.length; ii++){
				//Convert Due Days to Full Dates
				if(bills[ii].due_day <= today.getDate()){
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
		var attribute_formats = {
			"pay_period":" ",
			"income":" numerical ",
			"expenses":" numerical ",
			"delta":" change numerical ",
			"cashflow":" change numerical "
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