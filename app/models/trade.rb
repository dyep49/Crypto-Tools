class Trade < ActiveRecord::Base
	belongs_to :coinpair
	validates_uniqueness_of :trade_id
end
