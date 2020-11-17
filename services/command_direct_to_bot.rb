require_relative 'return_error'
include ReturnError

module CommandSentAsDirectMessageToBot
  def command_sent_as_direct_message_to_bot?(event)
    if event.server.nil?
      return_error(event.user.pm, "This command can only be used in the Discord server. Try sending this command in the #bot-commands channel in the CSS server.")
      return true
    end
    return false
  end
end
