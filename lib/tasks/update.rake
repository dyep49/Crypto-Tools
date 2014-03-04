namespace :update do
  desc "Adds cryptsy order history to database"
  task order_history: :environment do
  	def get_ids
			cryptsy = Cryptsy::API::Client.new(ENV["CRYPTSY_PUBLIC_KEY"], ENV["CRYPTSY_PRIVATE_KEY"])
  		markets = cryptsy.getmarkets["return"]
  		market_ids = []
  		markets.each do |market|
  			market_ids << market['marketid'].to_i
  		end
  		market_ids
  	end

  	def update_orders
			cryptsy = Cryptsy::API::Client.new(ENV["CRYPTSY_PUBLIC_KEY"], ENV["CRYPTSY_PRIVATE_KEY"])
  		cryptsy_exchange = Exchange.where(name: 'cryptsy').first
  		market_ids = get_ids
  		market_ids.each do |market_id|
  			coinpair = Coinpair.where(market_id: market_id)
  			if coinpair.empty?
  				response = cryptsy.marketdata(market_id)["return"]["markets"]
  				primary = response.values[0]["primarycode"]
  				secondary = response.values[0]["secondarycode"]
  				coinpair = Coinpair.create(primary: primary, secondary: secondary, market_id: market_id)
  				cryptsy_exchange.coinpairs << coinpair
  			end
  			trades = cryptsy.markettrades(market_id)["return"]
  			trades.each do |trade|
  				tradeid = trade["tradeid"]
  				datetime = trade["datetime"]
  				tradeprice = trade["tradeprice"]
  				quantity = trade["quantity"]
  				order_type = trade["initiate_ordertype"]
  				trade = Trade.create(trade_id: tradeid, datetime: datetime, price: tradeprice, quantity: quantity, order_type: order_type)
  				coinpair.orders << trade
  			end
  		end
	  end

	  update_orders



	end
 end
