require 'discordrb'

require_relative '../services/discord_message_sender'
require_relative '../services/utility_service'
require_relative '../services/return_error'
require_relative '../services/command_direct_to_bot'

module Say
  extend Discordrb::Commands::CommandContainer

  command(:say) do |event, channel|
    return if CommandSentAsDirectMessageToBot.command_sent_as_direct_message_to_bot?(event)
    # split 3 times and get the last element of the array
    text = event.message.content.split(' ', 3)[2]
    begin 
      # checks if the user has an important role so they would have perms to use this
      # and if channel is not empty
      # and if text isnt nil
      if UtilityService.important_role?(event.author) && (!channel.empty?) && !text.nil?
        # the args come in as an array
        # this changes it to a string

        # we do event.bot because we need the Bot object to get the Cache object functions
        channel = UtilityService.find_channel_by_encoded_id(event.bot, channel)

        DiscordMessageSender.send(channel, text)
      else
        raise StandardError.new "Message wasnt formatted correctly or user didnt have perms"
      end
    rescue Exception
      ReturnError.return_error(event.channel, "Couldn't say message")
    end
  end
end
