require 'cryptsy/api'

class HomeController < ApplicationController

	def index
		# respond_to do |format|
		# 	format.html
		# 	format.json do 
		# 		response = HTTParty.get('http://pubapi.cryptsy.com/api.php?method=marketdatav2')
		# 		binding.pry
		# 		render json: response.to_json
		# 	end
		# end
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
				response = cryptsy.markettrades(132)
				parsed_response = response["return"]
				render json: parsed_response.to_json
			end
		end
	end

	def depth
		cryptsy = Cryptsy::API::Client.new(ENV["CRYPTSY_PUBLIC_KEY"], ENV["CRYPTSY_PRIVATE_KEY"])
		respond_to do |format|
			format.html
			format.json do 
				# binding.pry
				# response = cryptsy.depth(params["pairId"].to_i)
				response = cryptsy.depth(132)
				# binding.pry
				parsed_response = response["return"]
				render json: parsed_response.to_json
			end
		end
	end

	def arbitrage
		@arbitrage = ArbitragePair.find_arbitrage
	end




end