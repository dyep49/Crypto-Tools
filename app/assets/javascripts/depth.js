Order = function(price, quantity){
	this.x = price
	this.y = quantity
}

var RenderDepth = function(){
	
	var self = this;

	this.sell_data_array = []
	this.buy_data_array = []

	this.data = $.ajax({
		url: '/',
		dataType: 'json',
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
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()
			self.buy_data_array.pop()



			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()
			self.sell_data_array.pop()

			self.renderGraphs()
		}
	});	

	this.renderGraphs = function(){
		var width = 1000
		var height = 600

		var x_min = _.min(self.buy_data_array, function(order){return order.x}).x
		var x_max = _.max(self.sell_data_array, function(order){return order.x}).x

		var y_max = _.max(self.sell_data_array.concat(self.buy_data_array), function(order){return order.y}).y

		var x = d3.scale.linear().domain([x_min, x_max]).range([0, width])
		var y = d3.scale.linear().domain([0, y_max]).range([height, 0])


		graph = d3.select('body').append('svg:svg')
			.attr('width', width + 100)
			.attr('height', height + 100)

		var g = graph.append("svg:g")	

		var line = d3.svg.line()
			.x(function(d){return x(d.x)})
			.y(function(d){return y(d.y)})

		var xAxis = d3.svg.axis().scale(x).tickSize(height).tickSubdivide(true);

		var yAxisLeft = d3.svg.axis().scale(y).ticks(5).orient("right");
		
		graph.append("svg:g")
			.attr("class", "x axis")
			// .attr("transform", "translate(0," + 300 + ")")
			.call(xAxis);

		graph.append("svg:g")
			.attr("class", "y axis")
			.attr("transform", "translate(0, 0)")
			.call(yAxisLeft);

		graph.append("svg:path")
			.attr("id", "green")
			.attr("d", line(self.buy_data_array));

		graph.append("svg:path")
			.attr("id", "red")
			.attr("d", line(self.sell_data_array));
	}
}

// 	this.renderGraphs = function(){

// 		var margin = {top: 80, right: 80, bottom: 80, left: 80}
// 		var width = 1000 - margin.right - margin.right;
// 		var height = 800 - margin.top - margin.bottom;


// 		// var max_x = _.max(self.sell_data_array.concat(self.buy_data_array), function(order){return order.x})
// 		var max_y = _.max(self.sell_data_array.concat(self.buy_data_array), function(order){return order.y}) 

// 		var max_x = _.max(self.sell_data_array, function(order){return order.x})
// 		// var max_y = _.max(self.sell_data_array, function(order){return order.y}) 

// 		 // x = d3.scale.linear().domain([_.last(self.buy_data_array).x, max_x.x]).range([0, width])
// 		// y = d3.scale.linear().domain([0, max_y.y]).range([0, height])


// 		// function zoom(d) {        
//   // 		graph.attr("transform",
//   //     "translate(" + d3.event.translate + ")"+ " scale(" + d3.event.scale + ")");
// 		// }


// 		graph = d3.select('body').append('svg:svg')
// 			.attr('width', width + margin.right + margin.left)
// 			.attr('height', height + margin.top + margin.bottom)
// 			// .call(d3.behavior.zoom()
// 			// .x(x)
// 			// .y(y)
// 			// .scaleExtent([0,8])
// 			// .on("zoom", zoom))


// 		var g = graph.append("svg:g")	



// 		var line = d3.svg.line()
// 			.x(function(d){console.log(d); return x(d.x)})
// 			.y(function(d){console.log(y(d.y));return y(d.y)})


// 		var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
// 		graph.append("svg:g")
// 			.attr("class", "x axis")
// 			.attr("transform", "translate(0," + height + ")")
// 			.call(xAxis);

// 		var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("right");
// 		graph.append("svg:g")
// 			.attr("class", "y axis")
// 			.attr("transform", "translate(0, 0)")
// 				.call(yAxisLeft);

// 		graph.append("svg:path")
// 			.attr("id", "green")
// 			.attr("d", line(self.buy_data_array));
// 		// graph.append("svg:path")
// 		// 	.attr("id", "red")
// 		// 	.attr("d", line(self.sell_data_array));
// 	}
// }

$(document).ready(function(){
	test = new RenderDepth();
})