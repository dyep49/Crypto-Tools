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
	this.open = open
	this.close = close
	this.min = min
	this.max = max
}

function roundTime(date) {
		var copied_date = new Date(date.getTime());
    copied_date.setHours(date.getHours() + Math.floor(date.getMinutes()/60));
    copied_date.setMinutes(0);
    copied_date.setSeconds(date.getSeconds() + Math.floor(date.getSeconds()/60));
    copied_date.setSeconds(0);
    return copied_date;
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
			alert('got the data')
			self.populate_line_array(d)
			self.populate_candlestick_array(self.trade_history)
			self.renderGraph()
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
		var margin = {top: 20, right: 40, bottom: 20, left: 200}

		var x_min = _.last(self.trade_history).datetime
		var x_max = new Date()

		var y_min = _.min(self.trade_history, function(trade){return trade.price}).price
		var y_max = _.max(self.trade_history, function(trade){return trade.price}).price

		// var candlestick_max = _.max(self.trade_history, function(candlestick){return candlestick.max - candlestick.min})
		// var candlestick_difference = Math.abs(candlestick_max.open - candlestick_max.close)

		var x = d3.time.scale()
			.domain([x_min, x_max])
			.range([0 + margin.left, width - margin.right])

		var y = d3.scale.linear()
			.domain([y_min, y_max])
			.range([height - margin.top, 0 + margin.bottom])

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('top')
			// .tickSize(-height)
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
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)

		svg.append("svg:path")
			.attr("id", "black")
			.attr("d", line(self.trade_history))

		svg.append("rect")
	  .attr("x", 0)
	  .attr("y", 0)
	  .attr("height", height)
	  .attr("width", width)
	  .style("stroke", 'black')
	  .style("fill", "none")
	  .style("stroke-width", 1);

		svg.selectAll('rect')
			.data(self.candlestick_history)
			.enter().append("svg:rect")
			.attr('x', function(d) {return x(d.open_datetime)})
			.attr('y', function(d) {return y(_.max([d.open, d.close]))})
			.attr('height', function(d) {return Math.abs(y(d.open)-y(d.close))})
			.attr('width', function(d){return .1 * (width - 2*margin.top)/self.candlestick_history.length})
			.attr('fill', function(d){return d.open > d.close ? "green" : "red"})
		
		svg.selectAll('line.stem')
			.data(self.candlestick_history)
			.enter().append('svg:line')
			.attr('class', 'stem')
			.attr('x1', function(d){return x(d.open_datetime) + .05 * (width - 2 * margin.top)/ self.candlestick_history.length})
			.attr('x2', function(d){return x(d.open_datetime) + .05 * (width - 2 * margin.top)/ self.candlestick_history.length})
			.attr('y1', function(d){return y(d.max)})
			.attr('y2', function(d){return y(d.min)})
			.attr('stroke', function(d){return d.open > d.close ? "green" : "red"})

		}


}


$(document).ready(function(){
	test = new RenderHistory();
	test.fetchTrades();
})