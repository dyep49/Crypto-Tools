Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}

var Trade = function(time, price){
	this.datetime = time
	this.price = price
}

var CandleStick = function(open_time, open, close, min, max){
	this.open_datetime = open_time
	// this.close_datetime = close_time
	this.open = open
	this.close = close
	this.min = min
	this.max = max
}

function roundTime(date) {
    date.setHours(date.getHours() + Math.floor(date.getMinutes()/60));
    date.setMinutes(0);
    date.setSeconds(date.getSeconds() + Math.floor(date.getSeconds()/60));
    date.setSeconds(0);
    return date;
}

var RenderHistory = function(){
	var self = this

	this.trade_history = []
	this.candlestick_history = []

	this.fetchTrades = function(){
		$.ajax({
		url: '/',
		dataType: 'json',
		success: function(d){
			self.populate_line_array(d)
			self.renderGraph()
			self.populate_candlestick_array(self.trade_history)
		}
		})
	}

	this.populate_line_array = function(data){
		data.forEach(function(trade){
			datetime = new Date(trade.datetime)
			self.trade_history.push(new Trade(datetime, trade.tradeprice))
		})
	}

	this.populate_candlestick_array = function(data){
		var grouped_history = _.groupBy(data, function(n){return roundTime(n.datetime)})
		
		_.each(grouped_history, function(trades){
			var min = _.min(trades, function(trade){return trade.price}).price
			var max = _.max(trades, function(trade){return trade.price}).price
			var open = trades[0].price
			var close = _.last(trades).price
			var open_time = roundTime(trades[0].datetime)
			// var close_time = open_time.addHours(1)
			self.candlestick_history.push(new CandleStick(open_time, open, close, min, max))
		})
	}

	this.renderGraph = function(){
		var width = 1000
		var height = 600
		var margin = {top: 40, right: 40, bottom: 40, left: 40}

		var x_min = _.last(self.trade_history).datetime
		var x_max = new Date()

		var y_min = _.min(self.trade_history, function(trade){return trade.price}).price
		var y_max = _.max(self.trade_history, function(trade){return trade.price}).price


		var x = d3.time.scale()
			.domain([x_min, x_max])
			.range([0, width - margin.left - margin.right])

		var y = d3.scale.linear()
			.domain([y_min, y_max])
			.range([height - margin.top - margin.bottom, 0])

		var xAxis = d3.svg.axis()
			.scale(x)
			// .ticks(d3.time.hours, 1)
			// .tickSize(height)
			// .tickSubdivide()

		var yAxis = d3.svg.axis()
			.scale(y)
			.ticks(5)
			.orient("right")

		var svg = d3.select('body').append('svg')
			.attr('class', 'history')
			.attr('width', width)
			.attr('height', height)
			.append('g')

		var line = d3.svg.line()
			.x(function(d){return x(d.datetime)})
			.y(function(d){return y(d.price)})

		svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)

		svg.append('g')
			.attr('class', "x axis")
			.call(xAxis)

		svg.append("svg:path")
			.attr("id", "green")
			.attr("d", line(self.trade_history))

	svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", height)
  .attr("width", width)
  .style("stroke", 'black')
  .style("fill", "none")
  .style("stroke-width", 1);
	}
}


$(document).ready(function(){
	test = new RenderHistory();
	test.fetchTrades();
})