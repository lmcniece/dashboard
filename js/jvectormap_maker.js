//Map Maker
var map_maker = function(){
	$(".map").remove();
	var target_regions = {
		"north_america":{
			"focus":{
				'x':'0.5',
				'y':'0.8',
				'scale':'2'
			}
		},
		"europe":{
			"focus":{
				'x':'0.5',
				'y':'0.5',
				'scale':'1.5'
			}
		},
		"asia":{
			"focus":{
				'x':'0.9',
				'y':'0.5',
				'scale':'1.2'
			}
		}
	}
	$("#map-container").append(
		'<div class="map" id="north_america-map"></div>'+
		'<div class="map" id="europe-map"></div>'+
		'<div class="map" id="asia-map"></div>'
	);
	//Set map-container and map size
	$("#map-container").css({
		"height" : $("#portfolio").width()*(2/3)*(1/3)
	});
	$(".map").css({
		"width" : $("#portfolio").width()*(1/3)-6,
		"height" : $("#portfolio").width()*(2/3)*(1/3)
	});
	var country_data = {};
	var full_country_data = {};
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/world_market_data.sql"
		}
	})
	.done(function(data){
		raw_data = $.parseJSON(data);
		//Construct country_data object and switch region to world if non-NA country code detected
		for(var i = 0; i < raw_data.length; i++){
			country_data[raw_data[i]["country"].toUpperCase()] = raw_data[i]["change_perc"];
			full_country_data[raw_data[i]["country"].toUpperCase()] = {"change_perc":raw_data[i]["change_perc"],"label":raw_data[i]["label"]};
		};
		
		for(var region in target_regions){
			$('#'+region+'-map').vectorMap({
			map: region+'_mill',
				series:{
					regions: [{
						scale: ['#ff0000','#eeffee','#00ff00'],
						max:  2,
						min: -2,
						values: country_data
					}]
					
				},
				zoomButtons : false,
				focusOn:target_regions[region].focus,
				onRegionTipShow: function(e, tip, code){
					if(!isNull(full_country_data[code])){
						var change = Math.round(full_country_data[code]['label']*100)/100;
					}
					tip.html(tip.html()+' '+change+'%');
				}
			});
		}
	});	
}