$(document).ready(function(){
	// debugger;
  $("#pairs").tablesorter({cssAsc: "headerSortUp", cssDesc: "headerSortDown", cssHeader: "header", sortList: [[4,0]]});
  $("#arbitrage-pairs").tablesorter({cssAsc: "headerSortUp", cssDesc: "headerSortDown", cssHeader: "header", sortList: [[6,0]]});
	

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

	$('.arbitrage').hide()
	$('#arbitrage-li').click(function(){
		$('.content').hide()
		$('.arbitrage').fadeIn(1000).show()
	})

})