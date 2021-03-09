require 'discordrb'

require_relative '../services/utility_service'
require_relative '../services/discord_message_sender'

module Jail
	extend Discordrb::Commands::CommandContainer

	# prepare the cooldowns for the two commands
	cooldown = Config::COOLDOWNS["jail"]
	use_user_cooldown = Config::PER_USER_COOLDOWN["jail"]

	jail_limiter = bucket(:jail_limit, delay: cooldown)
	free_limiter = bucket(:free_limit, delay: cooldown)
	
	# jail command
	# creates a jail cell (closed) around the given text:
	# ----------------
	# |||   text   |||
	# ----------------
	command(:jail) do |event|
		# first, we want to make sure this is a valid call. If its not, we don't want to start the cooldown
		text = event.message.content.split(' ', 2)[1]
		return ReturnError.return_error(event.channel, "You can't put nothing in jail!") unless text != nil
		
		return if use_user_cooldown && rate_limited?(:jail_limit, event.message.author.id)
		return if !use_user_cooldown && rate_limited?(:jail_limit, 0)

		text = decode_users(text, event)

		line = "-" * (12 + text.length)
		resp  = "```\n" + line + "\n"
		resp += "|||   " + text + "   |||\n"
		resp += line + "\n```"
		
		DiscordMessageSender.send(event.channel, resp)
	end
	
	# free command
	# creates a jail cell (open) around the given text:
	# ----------------
	# |||   text
	# ----------------
	command(:free) do |event|
		# first, we want to make sure this is a valid call. If its not, we don't want to start the cooldown
		text = event.message.content.split(' ', 2)[1]
		return ReturnError.return_error(event.channel, "You can't free nothing from jail!") unless text != nil
		
		return if use_user_cooldown && rate_limited?(:free_limit, event.message.author.id)
		return if !use_user_cooldown && rate_limited?(:free_limit, 0)
		
		text = decode_users(text, event)

		line = "-" * (12 + text.length)
		resp  = "```\n" + line + "\n"
		resp += "|||   " + text + "\n"
		resp += line + "\n```"
		
		DiscordMessageSender.send(event.channel, resp)
	end

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
end