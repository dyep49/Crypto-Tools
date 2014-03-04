require 'spec_helper'

describe Order do 
	describe "given duplicate trades" do
		before do 
			Trade.create(trade_id: 1)
			Trade.create(trade_id: 1)
			Trade.create(trade_id: 2)
		end
		describe "when adding a duplicate trade" do
			it "gets rejected" do 
				Trade.all.count.should == 2
			end
		end
	end
end

