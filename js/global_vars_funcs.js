//Cookie Set
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//Cookie Get
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

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
function generate_standard_table(tab, table_name, data, attribute_formats, has_total){
	$('#'+tab+' #'+table_name+' .content-table').remove();
	if(!isNull(data)){
		var columns = Object.keys(data[0]).length;
		//Clear and Generate Content-Table
		$('#'+tab+'').append(
			'<div id="'+table_name+'">'+
				'<table class="table table-bordered table-hover table-striped table-condensed content-table">'+
					'<tr class="row title-row"><th colspan="'+columns+'">'+table_name.replace(/_/,' ','g')+'</th></tr>'+
					'<tr class="row header-row"></tr>'+
				'</table>'+
			'</div>'
		);
		//Populate Header Row
		for(var attribute in data[0]){
			var format_classes = attribute_formats[attribute] || '';
			$('#'+tab+' #'+table_name+' .content-table .header-row').append(
				'<th class="'+format_classes+'">'+attribute.replace(/_perc/,' %','g').replace(/_/,' ','g')+'</th>'
			);
		}
		//Generate Content Rows
		for(var i = 0; i < data.length; i++){
			if(has_total == true && i+1 == data.length){
				$('#'+tab+' #'+table_name+' .content-table').append('<tr class="row total-row">');
			}else{
				$('#'+tab+' #'+table_name+' .content-table').append('<tr class="row">');
			}
			for(var attribute in data[i]){
				var format_classes = attribute_formats[attribute];
				var value = data[i][attribute] ? data[i][attribute] : '';
				$('#'+tab+' #'+table_name+' .content-table .row').last().append('<td class="'+format_classes+'">'+value+'</td>')
			}
			$('#'+tab+' #'+table_name+' .content-table').append('</tr>');
		}
		color_delta('.change');
	}
}

//Takes an array of header strings and a body string to generate a sortable table
var generateSortableTable = function(headers,data,id){
	var header_string = "";
	var table_body_string = "";
	global_date = data;
	for(var i=0;i<headers.length;i++){
		header_string += "<th>"+headers[i].label+"</th>";
	}
	for(var i=0;i<data.length;i++){
		table_body_string += "<tr>";
		for(var ii=0;ii<Object.keys(data[i]).length;ii++){
			table_body_string += '<td class="'+headers[ii].classes+'">'+data[i][Object.keys(data[i])[ii]]+"</td>";
		}
		table_body_string += "</tr>";
	}
	return '<table id="'+id+'" class="table sortable table-bordered table-hover table-striped table-condensed content-table"><thead>'+header_string+"</thead><tbody>"+table_body_string+"</tbody></table>";
}