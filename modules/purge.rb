require 'discordrb'

require_relative '../services/return_error'
include ReturnError

require_relative '../services/command_direct_to_bot'
include CommandSentAsDirectMessageToBot

module Purge
  extend Discordrb::Commands::CommandContainer

  command(:purge) do |event|
    return if command_sent_as_direct_message_to_bot? (event)

    # Number of messages is the command argument + 1 to delete command message itself
    num_messages = event.message.content.split(' ')[1].to_i + 1
    member = event.server.members.find { |member| member.id == event.user.id }

    if num_messages < 2 || num_messages > 100
      return_error(member.pm, "Invalid number of messages to be removed.\n\nCorrect usage: `~purge <2-99>`")
      return
    end

    unless member.permission?(:administrator)
      return_error(member.pm, "You do not have permission to use this command.")
      return
    end

    event.channel.prune(num_messages)
    return
  end
end
