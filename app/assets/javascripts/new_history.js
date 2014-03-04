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
		url: '/history',
		dataType: 'json',
		success: function(d){
			// alert('got the data')
			self.populate_line_array(d)
			self.populate_candlestick_array(self.trade_history)
			self.renderGraph()
		}
		})
	}

	this.populate_line_array = function(data){
		data.forEach(function(trade){
			datetime = new Date(trade.datetime)
			self.trade_history.push(new Trade(datetime, parseFloat(trade.tradeprice)))
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
		var margin = {top: 20, right: 30, bottom: 20, left: 80};
		var width = 960 - margin.left - margin.right;
		var height = 500 - margin.top - margin.bottom;


		var min_x = d3.min(self.candlestick_history, function(d){return d.open_datetime})
		var max_x = new Date()

		

		var x = d3.time.scale()
			.domain([min_x, max_x])
			.range([0, width])

		var y = d3.scale.linear()
			.domain(d3.extent(self.trade_history, function(d){return d.price}))
			.range([height - 20, 0 + 20])

		function make_x_axis() {		
	    return d3.svg.axis()
	        .scale(x)
	        .orient("bottom")
	        .ticks(5)
		}

		function make_y_axis() {		
	    return d3.svg.axis()
	        .scale(y)
	        .orient("left")
	        .ticks(8)
		}


		var svg = d3.select('body')
				.append('svg')
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  	.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom").ticks(5);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left").ticks(8)

		var line = d3.svg.line()
			.x(function(d){return x(d.datetime)})
			.y(function(d){return y(d.price)})

		svg.append("path")
			.attr("id", "black")
			.attr("d", line(self.trade_history))

		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis)

		svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)

		svg.selectAll('rect')
			.data(self.candlestick_history)
			.enter().append("svg:rect")
			.attr('x', function(d) {return x(d.open_datetime)})
			.attr('y', function(d) {return y(_.max([d.open, d.close]))})
			.attr('height', function(d) {return Math.abs(y(d.open)-y(d.close))})
			.attr('width', function(d){return .1 * (width - 2*margin.top)/self.candlestick_history.length})
			.attr('fill', function(d){return d.open < d.close ? "green" : "red"})
		
		svg.selectAll('line.stem')
			.data(self.candlestick_history)
			.enter().append('svg:line')
			.attr('class', 'stem')
			.attr('x1', function(d){return x(d.open_datetime) + .05 * (width - 2 * margin.top)/ self.candlestick_history.length})
			.attr('x2', function(d){return x(d.open_datetime) + .05 * (width - 2 * margin.top)/ self.candlestick_history.length})
			.attr('y1', function(d){return y(d.max)})
			.attr('y2', function(d){return y(d.min)})
			.attr('stroke', 'black')

    var x_grid = svg.append("g")			
	    .attr("class", "grid")
	    .attr("transform", "translate(0," + height + ")")
	    .call(make_x_axis()
	        .tickSize(-height, 0, 0)
	        .tickFormat("")
    )

    var y_grid = svg.append("g")			
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )	

		// svg.call(d3.behavior.zoom()
  // 		.on("zoom", function() {
  // 		console.log(d3.event.translate[0])
  //   	svg.attr("transform", "translate(" + d3.event.translate[0] + "," + d3.event.translate[1] + ") scale(" + d3.event.scale + ")")
  // 		})
		// )
	var updateGraph = function(){
		console.log('updating')
		var updated_min_x = d3.min(self.candlestick_history, function(d){return d.open_datetime})
		var updated_max_x = new Date()

		x.domain([updated_min_x, updated_max_x])
		y.domain(d3.extent(self.trade_history, function(d){return d.price}))

		var graph = d3.select('body').transition()


		graph.select("path")
			.duration(750)
			.attr("d", line(self.trade_history))
		graph.select("line.stem")
			.duration(750)
			.attr('x1', function(d){return x(d.open_datetime) + .05 * (width - 2 * margin.top)/ self.candlestick_history.length})
			.attr('x2', function(d){return x(d.open_datetime) + .05 * (width - 2 * margin.top)/ self.candlestick_history.length})
			.attr('y1', function(d){return y(d.max)})
			.attr('y2', function(d){return y(d.min)})
		graph.select("rect")
			.attr('x', function(d) {return x(d.open_datetime)})
			.attr('y', function(d) {return y(_.max([d.open, d.close]))})
			.attr('height', function(d) {return Math.abs(y(d.open)-y(d.close))})
			.attr('width', function(d){return .1 * (width - 2*margin.top)/self.candlestick_history.length})
			.attr('fill', function(d){return d.open < d.close ? "green" : "red"})
		graph.select(".x.axis")
			.duration(750)
			.call(xAxis)
		graph.select(".y.axis")
			.duration(750)
			.call(yAxis)

		x_grid
	    .attr("class", "grid")
	    .attr("transform", "translate(0," + height + ")")
	    .call(make_x_axis()
	        .tickSize(-height, 0, 0)
	        .tickFormat("")
	    )

    y_grid			
	    .attr("class", "grid")
	    .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat("")
    )	

	}

		setInterval(function(){
			updateGraph()
		}, 5000)


	}


}


