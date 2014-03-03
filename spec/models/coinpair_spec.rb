require 'spec_helper'

describe Coinpair do 
	describe "given an arbitrage opportunity" do 
		before do 
			exchange_1 = Exchange.create(name: "cryptsy", buy_fee: 0.1, sell_fee: 0.1)
			exchange_2 = Exchange.create(name: "exchange 2", buy_fee: 0.1, sell_fee: 0.1)
			
			coinpair_1 = Coinpair.create(primary: 'LTC', secondary: 'BTC')
			coinpair_2 = Coinpair.create(primary: 'LTC', secondary: 'BTC')
			
			order_1 = Order.create(order_type:'buy', price: 10, quantity: 6)
			order_2 = Order.create(order_type:'sell', price: 8, quantity: 3)
			order_3 = Order.create(order_type:'sell', price: 12, quantity: 5)
			order_4 = Order.create(order_type:'buy', price: 6, quantity: 5)

			coinpair_1.orders << order_1
			coinpair_1.orders << order_3
			coinpair_2.orders << order_2
			coinpair_2.orders << order_4

			exchange_1.coinpairs << coinpair_1
			exchange_2.coinpairs << coinpair_2
		end
		describe "when checking for arbitrage" do 
			it "should check the opportunities and" do 
				Coinpair.first.arbitrage.lowest_ask.should == 8.0
				Coinpair.first.arbitrage.highest_bid.should == 10.0
				Coinpair.first.arbitrage.quantity.should == 3
				Coinpair.first.arbitrage.profit.round(1).should == 0.6
			end
		end
	end
end


