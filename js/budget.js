//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////  ON DOM READY  //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Generate transaction account autocomplete array
$(function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {"query": "sql/transaction_accounts.sql"}
	})
	.done(function(data){
		//Global Var - also used for transaction insertion
		transaction_account_list = [];
		var data = $.parseJSON(data);
		for(var i = 0; i < data.length; i++){
			transaction_account_list.push(data[i].account);
		};
		$('#transaction-account').autocomplete({
			source: transaction_account_list,
			appendTo: "#transaction-account-autocomplete"
		});
	});
});

//Generate transaction tag autocomplete array
$(function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {"query": "sql/transaction_categories.sql"}
	})
	.done(function(data){
		var transaction_category_list = [];
		var data = $.parseJSON(data);
		for(var i = 0; i < data.length; i++){
			transaction_category_list.push(data[i].category);
		};
		$('#transaction-category').autocomplete({
			source: transaction_category_list,
			appendTo: "#transaction-category-autocomplete"
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
			"category":" uppercase ",
			"expected":" numerical ",
			"actual":" numerical ",
			"delta":" change numerical "
		}
		var data = $.parseJSON(data);
		generate_standard_table('budget', 'expenses', data, attribute_formats, true);
		get_monthly_transactions();
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////  RECENT TRANSACTIONS  //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
//Get Recent Transactions
var get_monthly_transactions = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/monthly_transactions.sql",
			"year": today.getFullYear(),
			"month": budget_month+1
		}
	})
	.done(function(data){
		var attribute_formats = {
			"account":" uppercase ",
			"amount":" numerical change ",
			"category":" uppercase centered ",
			"type":" uppercase centered ",
			"date":" centered "
		};
		var data = $.parseJSON(data);
		generate_standard_table('budget', 'transactions', data, attribute_formats, false);
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////  NEW TRANSACTION  /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var insert_transaction_handler = function(){
	//Get variables and blank out for next instance
	var account = $('#transaction-account').val();$('#transaction-account').val('');
	var category = $('#transaction-category').val();$('#transaction-category').val('');
	var amount = $('#transaction-amount').val();$('#transaction-amount').val('');
	var type = $('#transaction-type').val();
	var date = $('#transaction-date').val();
	//Insert new transaction record
	insert_transaction(account, amount, type, date, category);
}
var insert_transaction = function(account, amount, type, date, category){
	//Insert new transactions into Transactions table
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/new_transaction.sql",
			"account" : account,
			"amount" : amount,
			"type" : type,
			"date" : date,
			"category" : category
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