class ArbitragePair 

	attr_accessor :buy_exchange, :sell_exchange, :primary, :secondary, :quantity, :total_cost, :lowest_ask, :highest_bid

	def initialize(options = {})
		@buy_exchange = options[:buy_exchange]
		@sell_exchange = options[:sell_exchange]
		@primary = options[:primary]
		@secondary = options[:secondary]
		@quantity = options[:quantity]
		@total_cost = options[:total_cost]
		@lowest_ask = options[:lowest_ask]
		@highest_bid = options[:highest_bid]
	end

	# def self.find_arbitrage
	# 	arbitrage_pairs = []
	# 	cryptsy = Exchange.where(name:'cryptsy')[0]
	# 	cryptsy.coinpairs.each do |coinpair|
	# 		arbitrage_pair = coinpair.arbitrage
	# 		arbitrage_pairs << arbitrage_pair if arbitrage_pair
	# 	end
	# 	arbitrage_pairs
	# end

		def self.find_arbitrage
		arbitrage_pairs = []
		Exchange.all.each do |exchange|
		exchange.coinpairs.each do |coinpair|
				arbitrage_pair = coinpair.arbitrage
				arbitrage_pairs << arbitrage_pair if arbitrage_pair
			end
		end
		arbitrage_pairs
	end

end