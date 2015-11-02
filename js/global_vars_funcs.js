//Current Date
monthNames = [
	"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
today = new Date();
date_iso = function(date){
	return $.datepicker.formatDate('yy-mm-dd', date);
}

//isNull Function
function isNull(e){
    return (e==null || e==undefined || String(e).toUpperCase()=="NULL" || e=="" || String(e).toUpperCase()=="UNDEFINED");
}

//Ajax Loading Screen
$(function(){
	$(document).ajaxStart(function() {
		$( "#loading_container" ).show();
		$("body").css("overflow", "hidden");
	});
	
    $(document).ajaxStop(function() {
		$( "#loading_container" ).hide();
		$("body").css("overflow", "auto");
    }); 
});

//Rounding Function
function round(val, decimalPlaces) {
    var multiplier = Math.pow(10, decimalPlaces);
    return (Math.round(val * multiplier) / multiplier).toFixed(decimalPlaces);
}

//Colorize Deltas
function color_delta(selector){
	$(selector).each(function(){
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
}

//Standard Table Generator
function generate_standard_table(tab, name, data, attribute_formats, hidden_attributes, has_total){
	var data = $.parseJSON(data);
	if(!isNull(data)){
		var columns = Object.keys(data[0]).length;
		//Clear and Generate Content-Table
		$('#'+tab+' #'+name+' .content-table').remove();
		$('#'+tab+'').append(
			'<div id="'+name+'">'+
				'<table class="table table-bordered table-hover table-striped table-condensed content-table">'+
					'<tr class="row title-row"><td colspan="'+columns+'">'+name.replace(/_/,' ','g')+'</td></tr>'+
					'<tr class="row header-row"></tr>'+
				'</table>'+
			'</div>'
		);
		//Populate Header Row
		for(var attribute in data[0]){
			var format_classes = hidden_attributes[attribute];
			$('#'+tab+' #'+name+' .content-table .header-row').append(
				'<td class="'+format_classes+'">'+attribute.replace(/_/,' ','g')+'</td>'
			);
		}
		//Generate Content Rows
		for(var i = 0; i < data.length; i++){
			$('#'+tab+' #'+name+' .content-table').append('<tr class="row">');
			for(var attribute in data[i]){
				var format_classes = attribute_formats[attribute]+hidden_attributes[attribute];
				var value = data[i][attribute].toUpperCase();
				if(isNull(value)){value = '';}
				$('#'+tab+' #'+name+' .content-table .row').last().append('<td class="'+format_classes+'">'+value+'</td>')
			}
			$('#'+tab+' #'+name+' .content-table').append('</tr>');
		}
		color_delta('.change');
		if(has_total == true){
			$('#'+tab+' #'+name+' .content-table .row').last().css({
				'font-style':'italic',
				'color':'white'
			});
		}
	}
}