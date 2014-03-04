class Coinpair < ActiveRecord::Base
	belongs_to :exchange
	has_many :orders
	has_many :trades

	def similar?(other)
		self.primary == other.primary && self.secondary == other.secondary
	end


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
					if ask_min_with_fees < bid_max_with_fees
						#This is what ask price needs to be to ensure arbitrage
						breakeven_ask_price = bid_max_with_fees - ask_min_pair.exchange.buy_fee * bid_max_with_fees
						#Array of asks that are below the highest bid. Array is sorted by price, low to high
						asks_below_bid_max = ask_min_pair.orders.where("order_type = 'sell' AND price < '#{breakeven_ask_price}'").order(:price)
						
						breakeven_bid_price = ask_min_with_fees + bid_max_pair.exchange.sell_fee * ask_min_with_fees
						bids_above_ask_min = bid_max_pair.orders.where("order_type = 'buy' AND price > #{breakeven_bid_price}").order(:price)

						cloned_asks = []
						asks_below_bid_max.each do |ask|
							cloned_asks << ask.clone 
						end

						cloned_bids = []
						bids_above_ask_min.each do |bid|
							cloned_bids << bid.clone 
						end

						order_array = []
						arbitrage_array = Coinpair.arbitrage_recursion(cloned_bids, cloned_asks, order_array)
						if arbitrage_array.count >= 1
							buy_at = Exchange.find(ask_min_pair.exchange_id)
							sell_at = Exchange.find(bid_max_pair.exchange_id)
							quantity = arbitrage_array.inject(0){|sum, order| sum += order[0]}
							profit = arbitrage_array.inject(0){|sum, order| sum += order[2]}
							ArbitragePair.new(buy_exchange: buy_at, sell_exchange: sell_at, primary:self.primary, secondary:self.secondary, lowest_ask: ask_min_order.price, highest_bid: bid_max_order.price, quantity: quantity, profit: profit)
						end
					end
				end
		rescue
			puts "RESCUED"
		end
	end

	def self.arbitrage_recursion(bids, asks, order_array)
		unless bids.count == 0 || asks.count == 0
			ask_quantity = asks[0].quantity
			bid_quantity = bids[-1].quantity
			ask_price_with_fees = asks[0].price + asks[0].coinpair.exchange.buy_fee * asks[0].price
			bid_price_with_fees = bids[-1].price - bids[-1].coinpair.exchange.sell_fee * bids[-1].price
			arbitrage_price = ask_price_with_fees < bid_price_with_fees
			if ask_quantity >= bid_quantity && arbitrage_price
				profit = bid_price_with_fees * bid_quantity - ask_price_with_fees * bid_quantity
				order_array << [bid_quantity, asks[0].price, profit]
				asks[0].quantity -= bid_quantity  
				bids.delete(bids[-1])
				Coinpair.arbitrage_recursion(bids, asks, order_array)
			elsif ask_quantity < bid_quantity && arbitrage_price
				profit = bid_price_with_fees * ask_quantity - ask_price_with_fees * ask_quantity
				order_array << [ask_quantity, asks[0].price, profit]
				bids[-1].quantity -= ask_quantity  
				asks.delete(asks[0])
				Coinpair.arbitrage_recursion(bids, asks, order_array)
			end
		end
		order_array
	end


end
