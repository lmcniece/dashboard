$(function(){get_loan_data();});

//Get Loan Data
var get_loan_data = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {"query": "sql/loans.sql"}
	})
	.done(function(data){
		loans = $.parseJSON(data);
		var attribute_formats = {
			"account":" uppercase centered ",
			"principle":" numerical ",
			"outstanding":" numerical ",
			"rate":" numerical "
		};
		var data = $.parseJSON(data);
		generate_standard_table('loans', 'loan_list', data, attribute_formats, true);
	});
}