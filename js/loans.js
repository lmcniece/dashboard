$(function(){get_loan_data();});

//Get Loan Data
var get_loan_data = function(){
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/loans.sql"
		}
	})
	.done(function(data){
		loans = $.parseJSON(data);
		
		//Generate Content-Tables
		$('#loans').append(
			'<div id="loan_data">'+
				'<table class="table table-bordered table-hover table-striped table-condensed content-table">'+
					'<tr class="row header-row"></tr>'+
				'</table>'+
			'</div>'
		);
		
		//Generate Header Row
		for(var attribute in loans[0]){
			$('#loans #loan_data .content-table .header-row').append(
				'<td class="">'+attribute.replace(/_/,' ','g')+'</td>'
			);
		}
		//Generate Content Rows
		for(var i = 0; i < loans.length; i++){
			$('#loans #loan_data .content-table').append('<tr class="row">');
			for(var attribute in loans[i]){
				//var format_classes = attribute_formats[attribute]+hidden_attributes[attribute];
				var value = loans[i][attribute];
				if(isNull(value)){value = '';}
				$('#loans #loan_data .content-table .row').last().append('<td class="">'+value+'</td>');
			}
			$('#loans #loan_data .content-table').append('</tr>');
		}
		$('#loans #loan_data .content-table .row').last().css({
			'font-style':'italic',
			'color':'white'
		});
	});
}