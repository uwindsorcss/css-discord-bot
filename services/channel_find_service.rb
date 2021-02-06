require 'discordrb'

class ChannelFindService
  # returns a file object of encoded id
  # input: String
  # output: Channel
  # example: ChannelFindService.find_channel_by_encoded_id(bot, '<#123321>') => Channel
  def self.find_channel_by_encoded_id(bot, encoded_id)
    # gets rid of the suffix and prefix of the channel
    # for example
    # encoded_id would be `<#123321>`
    # it needs to just be `123321`
    id = encoded_id.delete_prefix('<#')
    id.delete_suffix!('>')

    # discordrb id type is integer
    id = id.to_i

    # returns the channel object from bot
    bot.channel(id)
  end
end
