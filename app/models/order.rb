class Order < ActiveRecord::Base
	belongs_to :coinpair

	def self.seed_orders
		Order.cryptsy_depth
		Order.bter_depth
		Order.btce_depth
	end

	def self.cryptsy_depth
		exchange = Exchange.where(name: 'cryptsy').first
		cryptsy = Cryptsy::API::Client.new(ENV["CRYPTSY_PUBLIC_KEY"], ENV["CRYPTSY_PRIVATE_KEY"])
		response = cryptsy.orderdata["return"].values
		markets = cryptsy.marketdata["return"]["markets"]
		response.each do |coinpair|
			marketid = coinpair["marketid"].to_i
			new_coin_pair = Coinpair.where(market_id: marketid)
			if new_coin_pair.any?
				new_coin_pair = new_coin_pair.first
			else
				primary = coinpair["primarycode"]
				secondary = coinpair["secondarycode"]
				market = markets[primary]
				last_trade_time = market["lasttradetime"]
				last_trade = market["lasttradeprice"].to_f
				volume = market["volume"].to_f

				new_coin_pair = Coinpair.create(primary: primary, secondary: secondary, market_id: marketid, last_trade: last_trade, volume: volume, last_trade_time: last_trade_time)
			end
			sells = coinpair["sellorders"]
			sells.each do |sell|
				type = "sell"
				price = sell["price"]
				quantity = sell["quantity"]
				total = sell["total"]
				datetime = sell
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

	def self.bter_depth
		bter = Exchange.where(name: 'bter').first
		pairs = HTTParty.get('http://data.bter.com/api/1/pairs')
		pairs.each do |pair|
			code = pair.scan(/[a-z]+/)
			primary = code[0].upcase
			secondary = code[1].upcase
			new_coin_pair = Coinpair.where(primary: primary).where(secondary: secondary).where(exchange_id: bter.id)
			if new_coin_pair.any?
				new_coin_pair = new_coin_pair.first
			else
				new_coin_pair = Coinpair.create(primary: primary, secondary: secondary)
			end
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

	def self.btce_depth
		btce = Exchange.where(name: 'btce').first
		pairs = Btce::API::CURRENCY_PAIRS
		pairs.each do |pair|
			code = pair.scan(/[a-z]+/)
			primary = code[0].upcase
			secondary = code[1].upcase
			new_coin_pair = Coinpair.where(primary: primary).where(secondary: secondary).where(exchange_id: btce.id)
			if new_coin_pair.any?
				new_coin_pair = new_coin_pair.first
			else
				new_coin_pair = Coinpair.create(primary: primary, secondary: secondary)
			end
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

end
