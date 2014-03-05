require 'cryptsy/api'

class HomeController < ApplicationController

	def index
		@updated_at = Order.order(updated_at: :desc).first.updated_at
	end

	def static_pump
		respond_to do |format|
			format.html
			format.json do 
				cryptsy = Exchange.where(name: 'cryptsy').first
				cryptsy_id = cryptsy.id   
				coinpairs = Coinpair.where(exchange_id: cryptsy_id).where(secondary: 'BTC')
				render json: coinpairs.to_json
			end
		end
	end

	def static_depth
		respond_to do |format|
			format.html
			format.json do 
			 market_id = params["pairId"].to_i
			 coinpair_id = Coinpair.where(market_id: market_id).first.id
			 orders = Order.where(coinpair_id: coinpair_id).where(order_type: 'sell')
			 render json: orders.to_json
			end
		end
	end

	def depth_table
		cryptsy = Cryptsy::API::Client.new(ENV["CRYPTSY_PUBLIC_KEY"], ENV["CRYPTSY_PRIVATE_KEY"])
			respond_to do |format|
				format.json do 
						# binding.pry
					response = cryptsy.depth(params["pairId"].to_i)
					parsed_response = response["return"]["sell"]
					render json: parsed_response.to_json
				end
			end
	end

	def history
		cryptsy = Cryptsy::API::Client.new(ENV["CRYPTSY_PUBLIC_KEY"], ENV["CRYPTSY_PRIVATE_KEY"])
		respond_to do |format|
			format.html
			format.json do 
				response = cryptsy.markettrades(params["pairId"])
				parsed_response = response["return"]
				render json: parsed_response.to_json
			end
		end
	end

	def depth
		@pair_id = params["pair_id"]
	end

	def grab_depth
		pair_id = params["pair_id"]
		cryptsy = Cryptsy::API::Client.new(ENV["CRYPTSY_PUBLIC_KEY"], ENV["CRYPTSY_PRIVATE_KEY"])
		respond_to do |format|
			format.html
			format.json do 
				response = cryptsy.depth(pair_id)
				parsed_response = response["return"]
				render json: parsed_response.to_json
			end
		end
	end


	def arbitrage
		@arbitrage = Arbitrage.all
	end




end