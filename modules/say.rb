require 'discordrb'

require_relative '../services/discord_message_sender'
require_relative '../services/channel_find_service'

module Say
  extend Discordrb::Commands::CommandContainer

  command(:say) do |event, channel, *text|
    # the args come in as an array
    # this changes it to a string
    text = text.join(' ')

    # we do event.bot because we need the Bot object to get the Cache object functions
    channel = ChannelFindService.find_channel_by_encoded_id(event.bot, channel)

    DiscordMessageSender.send(channel, text)
  end
end
