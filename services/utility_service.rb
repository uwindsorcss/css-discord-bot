require 'discordrb'

######################
# this is a series of utility functions
# that make discordrb better to use
# and give us functionality that we reuse
######################
class UtilityService
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

  # returns whether the member has an important role 
  # input: Member(or Author)
  # output: Bool
  def self.important_role?(member)
    # array of role objects to array or role names
    member_role_names = member.roles.map(&:name)

    # returns whether the intersection of
    # the array of names and the array of important
    # role names has any values
    (member_role_names & Config::IMPORTANT_ROLES).any?
  end
end
