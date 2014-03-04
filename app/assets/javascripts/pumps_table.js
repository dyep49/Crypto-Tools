// var pairArray = []
// load_width = 0
// iteration = 0

// //Parsing cryptsy responses

// function fetchBtcPairs(pairs){
// 	console.log('fetching');
// 	$('#progress').text('Fetching BTC Pairs')
// 	$.each(pairs.return.markets, function(index, pair){
// 		if (pair.secondarycode === "BTC") {
// 			var newPair = new BtcPair()
// 			newPair.name = pair.primaryname
// 			newPair.pairId = pair.marketid
// 			newPair.label = pair.label
// 			newPair.lastTradePrice = pair.lasttradeprice
// 			newPair.volume = pair.volume
// 			pairArray.push(newPair)
// 		}			
// 	});
// }

// //Creating a constructor

// var BtcPair = function(){
// 	var self = this;

// 	this.renderTableData = function(){
// 		console.log(self);
// 		newRow = $('<tr></tr>');
// 		newRow.append('<td>' + self.name + '</td>');
// 		newRow.append('<td>' + self.label + '</td>');
// 		newRow.append('<td>' + (self.volume * self.lastTradePrice) + '</td>');
// 		newRow.append('<td>' + self.lastTradePrice + '</td>');
// 		newRow.append('<td>' + self.doubleWall + '</td>');
// 		newRow.append('<td>' + self.secondWall + '</td>');
// 		newRow.append('<td>' + self.thirdWall + '</td>');
// 		newRow.append('<td>' + self.fourthWall + '</td>');
// 		$('tbody').append(newRow);
// 		load_width += ((1 / pairArray.length) * 100);
// 		iteration += 1;
// 		$('.progress-bar').css('width', load_width + '%' );
// 		$('#progress').text("Rendered " + iteration + " of " + pairArray.length);
// 		$("#pairs").trigger("update");
// 	};


// 	this.setDoubleWall = function(){
// 		$.getJSON('/depth_table', {'pairId': self.pairId}, function(data){
// 			var data = data
// 			var doubleIndex;
// 			var secondIndex;
// 			var thirdIndex;
// 			var fourthIndex;
// 			var doubleSellArray = [];
// 			var secondSellArray = [];
// 			var thirdSellArray = [];
// 			var fourthSellArray = [];

// 			$.each(data, function(index, order){
// 				if (order[0] > (self.lastTradePrice * 2)){
// 					doubleIndex = index;
// 					return false;
// 				}
// 			});

// 			$.each(data, function(index, order){
// 				if (order[0] > (self.lastTradePrice * 2.25)){
// 					secondIndex = index;
// 					return false;
// 				}
// 			});

// 			$.each(data, function(index, order){
// 				if (order[0] > (self.lastTradePrice * 2.5)){
// 					thirdIndex = index;
// 					return false;
// 				}
// 			});

// 			$.each(data, function(index, order){
// 				if (order[0] > (self.lastTradePrice * 3)){
// 					fourthIndex = index;
// 					return false;
// 				}
// 			});

// 			$.each(data.slice(0,doubleIndex), function(index, order){
// 				var total = order[0] * order[1];
// 				doubleSellArray.push(total);
// 			});

// 			$.each(data.slice(0,secondIndex), function(index, order){
// 				var total = order[0] * order[1];
// 				secondSellArray.push(total);
// 			});

// 			$.each(data.slice(0,thirdIndex), function(index, order){
// 				var total = order[0] * order[1];
// 				thirdSellArray.push(total);
// 			});

// 			$.each(data.slice(0,fourthIndex), function(index, order){
// 				var total = order[0] * order[1];
// 				fourthSellArray.push(total);
// 			});

// 			self.doubleWall = _.reduce(doubleSellArray, function(memo, num){return memo + num;}, 0);
// 			self.secondWall = _.reduce(secondSellArray, function(memo, num){return memo + num;}, 0);
// 			self.thirdWall = _.reduce(thirdSellArray, function(memo, num){return memo + num;}, 0);
// 			self.fourthWall = _.reduce(fourthSellArray, function(memo, num){return memo + num;}, 0);


// 			self.renderTableData();

// 			})
// 				.fail(function(){
// 					console.log("trying again")
// 					self.setDoubleWall();
// 				})
// 		};
// }
