class ArbitragePair 

	attr_accessor :buy_exchange, :sell_exchange, :primary, :secondary, :quantity, :total_cost, :lowest_ask, :highest_bid, :profit

	def initialize(options = {})
		@buy_exchange = options[:buy_exchange]
		@sell_exchange = options[:sell_exchange]
		@primary = options[:primary]
		@secondary = options[:secondary]
		@quantity = options[:quantity]
		@profit = options[:profit]
		@lowest_ask = options[:lowest_ask]
		@highest_bid = options[:highest_bid]
		# @total_cost = options[:total_cost]

	end

	def self.find_arbitrage
		arbitrage_pairs = []
		tested_coinpairs = []
		Exchange.all.each do |exchange|
			exchange.coinpairs.each do |coinpair|
				unless tested_coinpairs.any?{|pair| pair.similar?(coinpair)}
					tested_coinpairs << coinpair
					arbitrage_pair = coinpair.arbitrage
					arbitrage_pairs << arbitrage_pair if arbitrage_pair
				end
			end
		end
		arbitrage_pairs
	end

end