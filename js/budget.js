//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////  ON DOM READY  //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Hide tag entry by default
$('#transaction-tag').css('display','none');
//Generate autocomplete array
$(function(){
	transaction_account_list = [];
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/transaction_accounts.sql"
		}
	})
	.done(function(data){
		transaction_account_list = [];
		data=$.parseJSON(data);
		for(var i = 0; i < data.length; i++){
			transaction_account_list.push(data[i].account);
		};
		$('#transaction-account').autocomplete({
			source: transaction_account_list,
			appendTo: "#transaction-account-autocomplete",
			change: function() {
				var selected_account = $('#transaction-account').val();
				if(!isNull(selected_account) && transaction_account_list.indexOf(selected_account)==-1){
					$('#transaction-tag').css('display','initial');
				}else{
					$('#transaction-tag').css('display','none');
				}
			}
		});
	});
});

$(function(){
	//Declare global index for current viewed month and set name to selector
	budget_month = today.getMonth();
	$('#budget-month').text(monthNames[budget_month]);
	//Expense data is first in a cascade of data requests and table creations
	get_expense_data();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////  EVENT HANDLERS  /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Click on submit buttons triggers form submit
$('#transaction-entry-modal').on('click','#submit-new-transaction', insert_transaction_handler);

//Blank out all input boxes on click
$('body').on("click", '.fresh-input', function(){
	$(this).val('');
});

//Controls Month Selection and Data Pull
$('#budget-month-retreat').on('click', function(){
	if(budget_month == 0){
		budget_month = 11;
	}else{
		budget_month -= 1;
	}
	$('#budget-month').text(monthNames[budget_month]);
	get_expense_data();
});
$('#budget-month-advance').on('click', function(){
	if(budget_month == 11){
		budget_month = 0;
	}else{
		budget_month += 1;
	}
	$('#budget-month').text(monthNames[budget_month]);
	get_expense_data();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////  BUDGET STATUS  //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get Expense Data
var get_expense_data = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/expenses.sql",
			"year": today.getFullYear(),
			"month": budget_month+1
		}
	})
	.done(function(data){
		var attribute_formats = {
			"expected":" numerical ",
			"actual":" numerical ",
			"delta":" change numerical "
		}
		var hidden_attributes = {
			"index":" hidden "
		}
		generate_standard_table('budget', 'expenses', data, attribute_formats, hidden_attributes, true);
		get_recent_transactions();
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////  RECENT TRANSACTIONS  //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
//Get Recent Transactions
var get_recent_transactions = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/recent_transactions.sql",
			"year": today.getFullYear(),
			"month": today.getMonth()+1
		}
	})
	.done(function(data){
		var attribute_formats = {
			"amount":" numerical change "
		}
		generate_standard_table('budget', 'recent_transactions', data, attribute_formats, {});
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////  NEW TRANSACTION  /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var insert_transaction_handler = function(){
	//Get variables and blank out for next instance
	var account = $('#transaction-account').val();$('#transaction-account').val('');
	var tag = $('#transaction-tag').val();$('#transaction-tag').val('');
	var amount = $('#transaction-amount').val();$('#transaction-amount').val('');
	var type = $('#transaction-type').val();//Don't blank date or type
	var date = $('#transaction-date').val();
	//If new transaction account, first insert new tag pair into Tags table
	if(transaction_account_list.indexOf(account) == -1){
		console.log("New account");
		$.ajax({
			url: "services/php_query_handler.php",
			method: "GET",
			data: {
				"query": "sql/new_transaction_account.sql",
				"account" : account,
				"tag" : tag
			}
		})
		.done(function(result){
			$('#transaction-entry-modal').modal('hide');
			if(isNull(result)){
				result = 'Insertion Successful!';
			}
			notification_modal(result);
			insert_transaction(account, amount, type, date);
		});
	}else{
		insert_transaction(account, amount, type, date);
	}
}
var insert_transaction = function(account, amount, type, date){
	//Insert new transactions into Transactions table
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/new_transaction.sql",
			"account" : account,
			"amount" : amount,
			"type" : type,
			"date" : date
		}
	})
	.done(function(result){
		$('#transaction-entry-modal').modal('hide');
		if(result = ' []'){
			result = 'Insertion Successful!';
		}
		notification_modal(result);
		get_expense_data();
	});
}




























