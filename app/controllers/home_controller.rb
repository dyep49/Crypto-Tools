require 'cryptsy/api'

class HomeController < ApplicationController

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

	def index
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


end