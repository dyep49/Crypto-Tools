Order = function(price, quantity){
	this.price = price
	this.quantity = quantity
}

var RenderDepth = function(){
	
	var self = this;

	this.sell_data_array = []

	this.buy_data_array = []

	this.getData = function(callback){
		self.sell_data_array = []
		self.buy_data_array = []

		$.ajax({
		url: '/grab_depth',
		dataType: 'json',
		data: {pair_id: params},
		success: function(d){
			console.log(d)
			var sell_total = 0
			d.sell.forEach(function(order, index){
				var price = parseFloat(order[0])
				sell_total += parseFloat(order[1])
				var quantity = sell_total

				self.sell_data_array.push(new Order(price, quantity))
			})

			var buy_total = 0
			d.buy.forEach(function(order, index){
				var price = parseFloat(order[0])
				buy_total += parseFloat(order[1])
				var quantity = buy_total
				self.buy_data_array.push(new Order(price, quantity))
			})

			if(typeof callback === 'function' && callback()){
				callback()
			}
		}
		});	
	}

	this.renderGraphs = function(){
		var margin = {top: 20, right: 40, bottom: 20, left: 90};
		var width = 960 - margin.left - margin.right
		var height = 500 - margin.top - margin.bottom;

		var x_min = d3.min(self.buy_data_array, function(order){return order.price})
		var x_max = d3.max(self.sell_data_array, function(order){return order.price})

		var y_max = d3.max(self.sell_data_array.concat(self.buy_data_array), function(order){return order.quantity})

		var x = d3.scale.linear()
			.domain([x_min, x_max])
			.range([0, width])

		var y = d3.scale.linear()
			.domain([0, y_max])
			.range([height, 0])

		function make_x_axis() {		
	    return d3.svg.axis()
	        .scale(x)
	        .orient("bottom")
	        .ticks(8)
		}

		function make_y_axis() {		
	    return d3.svg.axis()
	        .scale(y)
	        .orient("left")
	        .ticks(8)
		}


		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(8)

		var yAxis = d3.svg.axis()
			.scale(y)
			.ticks(8)
			.orient("left");

		var svg = d3.select('body')
			.append('svg')
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		var	area = d3.svg.area()
	    .x(function(d) { return x(d.price);})
	    .y0(height)
	    .y1(function(d) { return y(d.quantity);});

		var line = d3.svg.line()
			.x(function(d){return x(d.price)})
			.y(function(d){return y(d.quantity)})


    var bid_fill = svg.append("path")
        .datum(self.buy_data_array)
        .attr("class", "bid")
        .attr("d", area)
        .style('fill', 'green')
        .style('opacity', 0.8)

    var ask_fill = svg.append("path")
        .datum(self.sell_data_array)
        .attr("class", "ask")
        .attr("d", area)
        .style('fill', 'red')
        .style('opacity', 0.8)

		svg.append("path")
			.attr("id", "green")
			.attr("d", line(self.buy_data_array));

		svg.append("path")
			.attr("id", "red")
			.attr("d", line(self.sell_data_array));
	
		svg.append("g")
			.attr("class", "x axis")
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);

		svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)

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
		// 	.translate([100,50]).scale(.5)
  // 		.on("zoom", function() {
  // 		console.log(d3.event.translate[0])
  //   	svg.attr("transform", "translate(" + d3.event.translate[0] + "," + d3.event.translate[1] + ") scale(" + d3.event.scale + ")")
  // 		})
		// )







		var updateGraph = function(){
			console.log('UPDATING DEPTH')
			self.getData(function(){
				var updated_x_min = d3.min(self.buy_data_array, function(order){return order.price})
				var updated_x_max = d3.max(self.sell_data_array, function(order){return order.price})
				var updated_y_max = d3.max(self.sell_data_array.concat(self.buy_data_array), function(order){return order.quantity})
				

				x.domain([updated_x_min, updated_x_max])
				y.domain([0, updated_y_max])

				var graph = d3.select('body').transition()

				graph.select('#green')
					.duration(750)
					.attr("d", line(self.buy_data_array))
				graph.select('#red')
					.duration(750)
					.attr("d", line(self.sell_data_array))
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

	  		bid_fill.transition().attr("d", area(self.buy_data_array))
	  		ask_fill.transition().attr("d", area(self.sell_data_array))



			})
			
		}

		depth_interval = setInterval(function(){
			updateGraph()
			$.getJSON('/last_price', {pair_id: params}, function(d){
				previous = $('.last-price').text()
				$('.last-price').text(d)
				if(previous > d){
					$('.last-price').css('color', 'red')
				} else{
					$('.last-price').css('color', 'green')
				}
			})

		}, 5000)


	}

}

