class Exchange < ActiveRecord::Base
	has_many :coinpairs
	validates_uniqueness_of :name
end
