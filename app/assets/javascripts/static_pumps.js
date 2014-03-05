Number.prototype.noExponents= function(){
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0]; 

    var  z= '', sign= this<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;

    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;  
    while(mag--) z += '0';
    return str + z;
}

var pairArray = []
load_width = 0
iteration = 0


//Parsing cryptsy responses

function fetchBtcPairs(pairs){
	console.log('fetching');
	$('#progress').text('Fetching BTC Pairs')
	$.each(pairs, function(index, pair){
			var newPair = new BtcPair()
			newPair.name = pair.primary
			newPair.pairId = pair.market_id
			newPair.label = pair.primary + '/' + pair.secondary
			newPair.lastTradePrice = pair.last_trade
			newPair.volume = pair.volume
			pairArray.push(newPair)
	});

	$('.navbar-brand').click(function(){
			location.reload()
	})

	$('#home').click(function(){
			location.reload()
	})



}

//Creating a constructor

var BtcPair = function(){
	var self = this;

	this.renderTableData = function(){
		console.log(self);
		newRow = $('<tr></tr>');
		newRow.append('<td>' + self.name + '</td>');
		newRow.append('<td>' + self.label + '</td>');
		newRow.append('<td>' + (self.volume * self.lastTradePrice) + '</td>');
		newRow.append('<td>' + self.lastTradePrice.noExponents() + '</td>');
		newRow.append('<td>' + self.doubleWall + '</td>');
		newRow.append('<td>' + self.secondWall + '</td>');
		newRow.append('<td>' + self.thirdWall + '</td>');
		newRow.append('<td>' + self.fourthWall + '</td>');
		newRow.hide().appendTo('#resistance-tbody').fadeIn(1000)
		newRow.click(function(){
			params = self.pairId
			depth = new RenderDepth();
			// history = new RenderHistory();
			$('#resistance-tbody > tr').fadeOut(3000)
			$('#sort-text').fadeOut(3000)
			$('h1').fadeOut(3500)
			setTimeout(function(){
				$('#resistance-tbody > tr').remove()
				$('#sort-text').remove()
				$('#last-update').remove()
				$('h1').text(self.label).fadeIn(3000)
			}, 3000)
			setTimeout(function(){
				self.renderTableData()
			}, 3000)
			setTimeout(function(){
				depth.getData(depth.renderGraphs)
				// history.fetchTrades();
				$('tr').last().unbind()
			}, 4000)

			$('.content').append('<a id="show-line" href="#">Show Line Graph/Candlesticks</a>')
			$('.content').append('<a id="show-depth" href="#">Show Depth Chart</a>')
			$('#show-depth').hide()

			$('#show-line').click(function(){
				$('svg').remove()
				$('#show-depth').show()
				$('#show-line').hide()
				history = new RenderHistory();
				history.fetchTrades();
				clearInterval(depth_interval);
			})

			$('#show-depth').click(function(){
					$('svg').remove()
					depth = new RenderDepth();
					depth.getData(depth.renderGraphs)
					$('#show-depth').hide()
					$('show-line').show()
					clearInterval(history_interval)
			})





		})
		// load_width += ((1 / pairArray.length) * 100);
		// iteration += 1;
		// $('.progress-bar').css('width', load_width + '%' );
		// $('#progress').text("Rendered " + iteration + " of " + pairArray.length);
		$("#pairs").trigger("update");
	};


	this.setDoubleWall = function(){
		$.getJSON('/static_depth', {'pairId': self.pairId}, function(data){
			var data = data
			var doubleIndex;
			var secondIndex;
			var thirdIndex;
			var fourthIndex;
			var doubleSellArray = [];
			var secondSellArray = [];
			var thirdSellArray = [];
			var fourthSellArray = [];

			$.each(data, function(index, order){
				if (order.price > (self.lastTradePrice * 2)){
					doubleIndex = index;
					return false;
				}
			});

			$.each(data, function(index, order){
				if (order.price > (self.lastTradePrice * 2.25)){
					secondIndex = index;
					return false;
				}
			});

			$.each(data, function(index, order){
				if (order.price > (self.lastTradePrice * 2.5)){
					thirdIndex = index;
					return false;
				}
			});

			$.each(data, function(index, order){
				if (order.price > (self.lastTradePrice * 3)){
					fourthIndex = index;
					return false;
				}
			});

			$.each(data.slice(0,doubleIndex), function(index, order){
				var total = order.price * order.quantity;
				doubleSellArray.push(total);
			});

			$.each(data.slice(0,secondIndex), function(index, order){
				var total = order.price * order.quantity;
				secondSellArray.push(total);
			});

			$.each(data.slice(0,thirdIndex), function(index, order){
				var total = order.price * order.quantity;
				thirdSellArray.push(total);
			});

			$.each(data.slice(0,fourthIndex), function(index, order){
				var total = order.price * order.quantity;
				fourthSellArray.push(total);
			});

			self.doubleWall = _.reduce(doubleSellArray, function(memo, num){return memo + num;}, 0);
			self.secondWall = _.reduce(secondSellArray, function(memo, num){return memo + num;}, 0);
			self.thirdWall = _.reduce(thirdSellArray, function(memo, num){return memo + num;}, 0);
			self.fourthWall = _.reduce(fourthSellArray, function(memo, num){return memo + num;}, 0);


			self.renderTableData();

			})
				.fail(function(){
					console.log("trying again")
					self.setDoubleWall();
				})
		};
}
