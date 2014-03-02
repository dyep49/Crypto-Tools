require 'spec_helper'

describe Coinpair do 
	describe "given an arbitrage opportunity" do 
		before do 
			exchange_1 = Exchange.create(name: "cryptsy")
			exchange_2 = Exchange.create(name: "exchange 2")
			
			coinpair_1 = Coinpair.create(primary: 'LTC', secondary: 'BTC')
			coinpair_2 = Coinpair.create(primary: 'LTC', secondary: 'BTC')
			
			order_1 = Order.create(order_type:'buy', price: 10, quantity: 5)
			order_2 = Order.create(order_type:'sell', price: 8, quantity: 5)
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
			end
		end
	end
end


