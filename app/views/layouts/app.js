$(document).ready(function(){
  $("#pairs").tablesorter({cssAsc: "headerSortUp", cssDesc: "headerSortDown", cssHeader: "header", sortList: [[4,0]]});
	
	$.getJSON('/static_pump', function(data){
		console.log("Success");
		fetchBtcPairs(data);
		$.each(pairArray, function(index, pair){
			pair.setDoubleWall();
		});
	})
		.fail(function(){
			console.log("fetching failed")
		})
})


