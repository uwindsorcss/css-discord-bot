require_relative '../config'

class DiscordMessageSender
  SIDE_COLOR = "005696"
  UWINDSOR_THUMBNAIL = Discordrb::Webhooks::EmbedThumbnail.new(url: "#{Config::IMAGE_DIRECTORY_URL}/uw_logo.png")

  def self.send_embedded(
    channel,
    title: nil,
    description: nil,
    author: nil,
    color: SIDE_COLOR,
    fields: nil,
    footer: nil,
    image: nil,
    thumbnail: UWINDSOR_THUMBNAIL,
    timestamp: nil,
    url: nil
  )
    channel.send_embed do |embed|
      embed.title = title
      embed.description = description
      embed.author = author
      embed.color = color
      fields.each { |field| embed.fields << field } unless fields.nil?
      embed.footer = footer
      embed.image = image
      embed.thumbnail = thumbnail
      embed.timestamp = timestamp
      embed.url = url
    end
  end

  def self.send(channel,
                content,
                tts: false,
                attachments: nil
               )

    channel.send_message(content, tts, attachments)
  end
end
