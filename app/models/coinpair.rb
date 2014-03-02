class Coinpair < ActiveRecord::Base
	belongs_to :exchange
	has_many :orders

	def similar?(other)
		self.primary == other.primary && self.secondary == other.secondary
	end


	# def arbitrage
	# 	begin
	# 		matches = Coinpair.where(primary: self.primary, secondary: self.secondary)
	# 			if matches.any?
	# 				sell_min_pair = matches.min_by{|match| match.orders.where(order_type: 'sell').first.price}
	# 				sell_min_pair = matches.min_by do |match| 
	# 					price = match.orders.where(order_type: 'sell').first.price
	# 					price_with_fees = price + match.exchange.buy_fee * price
	# 				end

	# 				sell_min = sell_min_pair.orders.where(order_type:'sell').first.price 
	# 				sell_min_with_fees = sell_min + sell_min_pair.exchange.buy_fee * sell_min


	# 				buy_max_pair = matches.max_by do |match| 
	# 					price = match.orders.where(order_type:'buy').first.price
	# 					price_with_fees = price - match.exchange.sell_fee * price
	# 				end
	# 				buy_max = buy_max_pair.orders.where(order_type:'buy').first.price
	# 				buy_max_with_fees = buy_max - buy_max_pair.exchange.sell_fee * buy_max





	# 				if buy_max_with_fees > sell_min_with_fees
	# 					buy_at = Exchange.find(sell_min_pair.exchange_id)
	# 					sell_at = Exchange.find(buy_max_pair.exchange_id)
	# 					ArbitragePair.new(buy_exchange: buy_at, sell_exchange: sell_at, primary:self.primary, secondary:self.secondary, lowest_ask: sell_min, highest_bid: buy_max)
	# 				end
	# 			end
	# 	rescue
	# 		nil
	# 	end
	# end

	def arbitrage
		begin
			matches = Coinpair.where(primary: self.primary, secondary: self.secondary)
				if matches.count > 1

#---------------------------------------------------------------------------------------------------------------------

					bid_max_pair = matches.max_by do |match| 
						price = match.orders.where(order_type:'buy').first.price
						price_with_fees = price - match.exchange.sell_fee * price
					end

					bid_max_order = bid_max_pair.orders.where(order_type:'buy').order(:price).last
					bid_max_with_fees = bid_max_order.price - bid_max_pair.exchange.sell_fee * bid_max_order.price

# --------------------------------------------------------------------------------------------------------------------

					ask_min_pair = matches.min_by do |match| 
						price = match.orders.where(order_type: 'sell').first.price
						price_with_fees = price + match.exchange.buy_fee * price
					end

					ask_min_order = ask_min_pair.orders.where(order_type: 'sell').order(:price).first
					#Real price after purchasing exchange fee
					ask_min_with_fees = ask_min_order.price + ask_min_pair.exchange.buy_fee * ask_min_order.price

#----------------------------------------------------------------------------------------------------------------------

					#This is what ask price needs to be to ensure arbitrage
					breakeven_ask_price = bid_max_with_fees - ask_min_pair.exchange.buy_fee * bid_max_with_fees
					#Array of asks that are below the highest bid. Array is sorted by price, low to high
					asks_below_bid_max = ask_min_pair.orders.where("order_type = 'sell' AND price < '#{breakeven_ask_price}'").order(:price)
					
					breakeven_bid_price = ask_min_with_fees + bid_max_pair.exchange.sell_fee * ask_min_with_fees
					bids_above_ask_min = bid_max_pair.orders.where("order_type = 'buy' AND price > #{breakeven_bid_price}")

					test = asks_below_bid_max.sum(&:quantity)
					binding.pry


					if buy_max_with_fees > sell_min_with_fees

						buy_at = Exchange.find(sell_min_pair.exchange_id)
						sell_at = Exchange.find(buy_max_pair.exchange_id)
						ArbitragePair.new(buy_exchange: buy_at, sell_exchange: sell_at, primary:self.primary, secondary:self.secondary, lowest_ask: sell_min, highest_bid: buy_max, quantity: quantity)
					end
				end
		rescue
			nil
		end
	end



end
