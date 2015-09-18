var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

//function to return company id from selected account
var dropdown_callback = function(){
};

//selects accounts from list    
$(function(){       
    $("body").on("click", ".ui-menu-item", function () {
        dropdown_callback();
    });
    $(document).keyup(function(e){
        if(e.keyCode == 13 && $(document.activeElement).attr("id") != "note_text"){
            dropdown_callback();
        }
    });
});

//passes account json to autocomplete function    
$(function(){
	var account_list = [];
	$.ajax({
		url: "services/php_query_handler.php",
		method: "GET",
		data: {
			"query": "sql/get_accounts.sql"
		}
	})
	.done(function(data){
		var account_list = [];
		data=$.parseJSON(data);
		for(var i = 0; i < data.length; i++){
			account_list.push(data[i].account);
		};
		$('#account-search .typeahead').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 1
		},
		{
		  name: 'states',
		  source: substringMatcher(account_list)
		});
//		$("#account-search").autocomplete({
//			source: account_list
//		});
    });
});

$(document).ready(function () {
	//Clear account selector on focus
	$("#account-search").click(function(){$(this).val('');});
});