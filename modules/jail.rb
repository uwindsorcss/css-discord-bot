require 'discordrb'

require_relative '../services/utility_service'
require_relative '../services/discord_message_sender'

module Jail
	extend Discordrb::Commands::CommandContainer

	# checks a string for encoded users (<@!number>) and replaces
	# them with the user's display name
	# Input: String
	# Output: String
	def self.decode_users(text, event)
		# look for users in the string
		enc_ids = text.scan(/<@![0-9]+>/)
		for id in enc_ids
			user = UtilityService.find_user_by_id(id, event)
			text = text.sub(id, UtilityService.get_user_display_name(user))
		end
		return text
	end

	# jail command
	# creates a jail cell (closed) around the given text:
	# ----------------
	# |||   text   |||
	# ----------------
	command(:jail) do |event|
		text = decode_users(event.message.content.split(' ', 2)[1], event)
		t_len = text.length
		
		resp  = "```\n" + "-" * (12 + t_len) + "\n"
		resp += "|||   " + text + "   |||\n"
		resp += "-" * (12 + t_len) + "\n```"
		
		DiscordMessageSender.send(event.channel, resp)
	end

	# free command
	# creates a jail cell (open) around the given text:
	# ----------------
	# |||   text
	# ----------------
	command(:free) do |event|
		text = decode_users(event.message.content.split(' ', 2)[1],event)
		t_len = text.length
		
		cell_border = "-" * (12 + t_len)
		resp  = "```\n" + cell_border + "\n"
		resp += "|||   " + text + "\n"
		resp += cell_border + "\n```"
		
		DiscordMessageSender.send(event.channel, resp)
	end
end