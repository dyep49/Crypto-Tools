class Coinpair < ActiveRecord::Base
	belongs_to :exchange
	has_many :orders

	def arbitrage
		begin
			matches = Coinpair.where(primary: self.primary, secondary: self.secondary)
				if matches.count > 0
					sell_min_pair = matches.min_by{|match| match.orders.where(order_type: 'sell').first.price}
					sell_min = sell_min_pair.orders.where(order_type:'sell').first.price

					buy_max_pair = matches.max_by{|match| match.orders.where(order_type:'buy').first.price}
					buy_max = buy_max_pair.orders.where(order_type:'buy').first.price

					if buy_max > sell_min 
						buy_at = Exchange.find(sell_min_pair.exchange_id)
						sell_at = Exchange.find(buy_max_pair.exchange_id)
						ArbitragePair.new(buy_exchange: buy_at, sell_exchange: sell_at, primary:self.primary, secondary:self.secondary, lowest_ask: sell_min, highest_bid: buy_max)
					end
				end
		rescue
			nil
		end
	end

end
