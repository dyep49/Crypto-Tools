require 'cryptsy/api'
require 'btce'

def cryptsy_depth
	exchange = Exchange.create(name: 'cryptsy', buy_fee: 0.002, sell_fee: 0.003)
	cryptsy = Cryptsy::API::Client.new(ENV["CRYPTSY_PUBLIC_KEY"], ENV["CRYPTSY_PRIVATE_KEY"])
	response = cryptsy.orderdata["return"].values
	response.each do |coinpair|
		primary = coinpair["primarycode"]
		secondary = coinpair["secondarycode"]
		new_coin_pair = Coinpair.create(primary: primary, secondary: secondary)
		sells = coinpair["sellorders"]
		sells.each do |sell|
			type = "sell"
			price = sell["price"]
			quantity = sell["quantity"]
			total = sell["total"]
			order = Order.create(order_type: type, price: price, quantity: quantity, total: total)
			new_coin_pair.orders << order
		end
		buys = coinpair["buyorders"]
		buys.each do |buy|
			type = "buy"
			price = buy["price"]
			quantity = buy["quantity"]
			total = buy["total"]
			order = Order.create(order_type: type, price: price, quantity: quantity, total: total)
			new_coin_pair.orders << order
		end

		exchange.coinpairs << new_coin_pair
	end
end

def bter_depth
	bter = Exchange.create(name: 'bter', buy_fee: 0.002, sell_fee: 0.002)
	pairs = HTTParty.get('http://data.bter.com/api/1/pairs')
	pairs.each do |pair|
		code = pair.scan(/[a-z]+/)
		primary = code[0].upcase
		secondary = code[1].upcase
		new_coin_pair = Coinpair.create(primary: primary, secondary: secondary)
		depth = HTTParty.get('http://data.bter.com/api/1/depth/' + primary + '_' + secondary)
		depth["asks"].each do |ask|
			type = "sell"
			price = ask[0].to_f
			quantity = ask[1]
			order = Order.create(order_type: type, price: price, quantity: quantity)
			new_coin_pair.orders << order
		end
		depth["bids"].each do |bid|
			type = "buy"
			price = bid[0].to_f
			quantity = bid[1]
			order = Order.create(order_type: type, price: price, quantity: quantity)
			new_coin_pair.orders << order
		end
	bter.coinpairs << new_coin_pair
	end
end

def btce_depth
	btce = Exchange.create(name: 'btce', buy_fee: 0.002, sell_fee: 0.002)
	pairs = Btce::API::CURRENCY_PAIRS
	pairs.each do |pair|
		code = pair.scan(/[a-z]+/)
		primary = code[0].upcase
		secondary = code[1].upcase
		new_coin_pair = Coinpair.create(primary: primary, secondary: secondary)
		depth = Btce::Depth.new(pair).json[pair]
		depth["asks"].each do |ask|
			type = "sell"
			price = ask[0]
			quantity = ask[1]
			order = Order.create(order_type: type, price: price, quantity: quantity)
			new_coin_pair.orders << order
		end
		depth["bids"].each do |bid|
			type = "buy"
			price = bid[0]
			quantity = bid[1]
			order = Order.create(order_type: type, price: price, quantity: quantity)
			new_coin_pair.orders << order
		end
		btce.coinpairs << new_coin_pair
	end
end






# def cryptorush_depth
# 	key = ENV["CRYPTORUSH_KEY"]
# 	id = ENV["CRYPTORUSH_ID"]
# 	response = HTTParty.get("https://cryptorush.in/api.php?get=all&key=#{key}&id=#{id}")
# 	parsed_response = JSON.parse(response)


# end


btce_depth
cryptsy_depth
bter_depth
