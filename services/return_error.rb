require_relative 'discord_message_sender'

module ReturnError
  def return_error(channel, message)
    DiscordMessageSender.send_embedded(
      channel,
      title: "Error",
      description: ":bangbang: " + message,
    )
  end
end
