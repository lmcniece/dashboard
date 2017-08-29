//isNull Function
function isNull(e){
    return (e==null || e==undefined || String(e).toUpperCase()=="NULL" || e=="" || String(e).toUpperCase()=="UNDEFINED");
}

//Rounding Function
function round(val, decimalPlaces) {
    var multiplier = Math.pow(10, decimalPlaces);
    return (Math.round(val * multiplier) / multiplier).toFixed(decimalPlaces);
}

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
	//$('#'+table_name).remove();
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
				$('#'+tab+' #'+table_name+' .content-table .row').last().append('<td class="'+format_classes+'">'+value.replace(/_/,' ','g')+'</td>')
			}
			$('#'+tab+' #'+table_name+' .content-table').append('</tr>');
		}
		color_delta('.change');
	}
}

//Takes an array of header strings and a body string to generate a sortable table
var generateSortableTable = function(location,table_id,headers,data,total_flag){
	$("#"+table_id).remove();
	var table_header_string = "";
	var table_body_string = "";
	var table_footer_string = "";
	//Generate Header
	for(var i=0;i<headers.length;i++){
		table_header_string += '<th class="'+headers[i].classes+'">'+headers[i].label+"</th>";
	}
	//Generate Footer
	if(total_flag==true){
		var last_index = data.length-1;
		for(var i=0;i<Object.keys(data[last_index]).length;i++){
			var value = "";
			if(!isNull(data[last_index][Object.keys(data[last_index])[i]])){
				value = data[last_index][Object.keys(data[last_index])[i]];
			}
			table_footer_string += '<td class="'+headers[i].classes+'">'+value+"</td>";
		}
	}
	//Generate Body
	var exclude_last = 0;
	if(total_flag==true){exclude_last = 1;}
	for(var i=0;i<data.length-exclude_last;i++){
		table_body_string += "<tr>";
		for(var ii=0;ii<Object.keys(data[i]).length;ii++){
			table_body_string += '<td class="'+headers[ii].classes+'">'+data[i][Object.keys(data[i])[ii]].replace('_',' ','g')+"</td>";
		}
		table_body_string += "</tr>";
	}
	var table_string = '<div class="container"><table id="'+table_id+'" class="table sortable table-bordered table-hover table-condensed table-striped content-table"><thead>'+table_header_string+"</thead><tfoot>"+table_footer_string+"</tfoot><tbody>"+table_body_string+"</tbody></table></div>";
	$(location).append(table_string);
	$.bootstrapSortable();
	color_delta('.change');
}