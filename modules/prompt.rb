require 'discordrb'

require_relative '../services/discord_message_sender'
require_relative '../services/utility_service'
require_relative '../services/return_error'
require_relative '../services/command_direct_to_bot'

module Prompt
  extend Discordrb::Commands::CommandContainer

  command(:prompt) do |event|
    return if CommandSentAsDirectMessageToBot.command_sent_as_direct_message_to_bot?(event)

    begin
      # split 2 times and get the second split
      # this gets the text after the command
      text = event.message.content.split(' ', 2)[1]


      # check if the user has an important role
      if UtilityService.important_role?(event.author)
        prompt_channel = event.bot.find_channel(Config::PROMPT["channel"]).first

        prompt_text = Config::PROMPT["top_text"] + text + Config::PROMPT["bottom_text"]

        DiscordMessageSender.send(prompt_channel, prompt_text)
      end
    rescue Exception
      ReturnError.return_error(event.channel, "Couldn't say message")
    end
  end
end
