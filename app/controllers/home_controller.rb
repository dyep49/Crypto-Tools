require 'cryptsy/api'

class HomeController < ApplicationController

	def index
		cryptsy = Cryptsy::API::Client.new(ENV["CRYPTSY_PUBLIC_KEY"], ENV["CRYPTSY_PRIVATE_KEY"])
		respond_to do |format|
			format.html
			format.json do 
				# binding.pry
				# response = cryptsy.depth(params["pairId"].to_i)
				response = cryptsy.depth(135)
				# binding.pry
				parsed_response = response["return"]
				render json: parsed_response.to_json
			end
		end
	end


end