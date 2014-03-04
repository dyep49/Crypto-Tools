namespace :update do
  desc "Updates arbitrage opportunities"
  task arbitrage: :environment do
		Order.delete_all
		Order.seed_orders
		arbitrage_pairs = ArbitragePair.find_arbitrage
		Arbitrage.delete_all
		arbitrage_pairs.each do |pair|
			Arbitrage.create(buy_exchange: pair.buy_exchange.name, sell_exchange: pair.sell_exchange.name, primary: pair.primary, secondary: pair.secondary, quantity: pair.quantity, profit: pair.profit, lowest_ask: pair.lowest_ask, highest_bid: pair.highest_bid)
		end
	end
end