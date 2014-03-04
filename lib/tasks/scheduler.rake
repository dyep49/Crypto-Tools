namespace :update do
  desc "Updates arbitrage opportunities"
  task arbitrage: :environment do
		Order.delete_all
		Order.seed_orders
	end
end