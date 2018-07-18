require 'discordrb'
require 'pry'
require 'json'

secrets = JSON.parse(File.read('secrets.json'))

SIDE_COLOR = "005696"
IMAGE_DIRECTORY_URL = secets["image_directory_url"]
UWINDSOR_THUMBNAIL = Discordrb::Webhooks::EmbedThumbnail.new(url: "#{IMAGE_DIRECTORY_URL}/uw_logo.png")

bot = Discordrb::Commands::CommandBot.new token: secrets["api_token"], client_id: secrets["api_client_id"], prefix: '~'

puts "This bot's invite URL is #{bot.invite_url}."
puts 'Click on it to invite it to your server.'

$buildings = {
  "AC" => "Assumption Chapel",
  "AR" => "Centre for Automotive Research",
  "BB" => "Biology Building",
  "CC" => "Canterbury College",
  "CE" => "Centre for Engineering Innovation",
  "CN" => "Chrysler Hall North",
  "CS" => "Chrysler Hall South",
  "DB" => "Drama Building",
  "DH" => "Dillon Hall",
  "ED" => "Neal Education Building",
  "ER" => "Erie Hall",
  "HK" => "HK Building",
  "JC" => "Jackman Dramatic Art Centre",
  "LB" => "Ianni Law Building",
  "LE" => "Lebel Building",
  "LL" => "Leddy Library",
  "LT" => "Lambton Tower",
  "MB" => "O'Neil Medical Education Centre",
  "MH" => "Memorial Hall",
  "MU" => "Music Building",
  "OB" => "Odette Building",
  "SD" => "St. Denis Center",
  "TC" => "Toldo Health Education Centre",
  "UC" => "C.A.W. Student Centre",
  "WL" => "West Library"
}

$commands = {
  "<buildingName||buildingCode>" => "returns the name of building and location on map",
  "list" => "returns the list of all building codes and their associating names",
  "help" => "returns the help menu"
}

bot.command(:whereis) do |event|
  arg = event.message.content.split(' ')[1]
  if $buildings[arg]
    building = arg
    embeddedMessageSender(
      event.channel,
      title: "Building Search",
      image: Discordrb::Webhooks::EmbedImage.new(url: "#{IMAGE_DIRECTORY_URL}/#{building}.png"),
      description: $buildings[building],
    )
  elsif arg == "list"
    building_list = gatherBuildingList
    embeddedMessageSender(
      event.channel,
      title: "Building List",
      fields: [
        Discordrb::Webhooks::EmbedField.new(name: "Codes", value: building_list[:codes], inline: true),
        Discordrb::Webhooks::EmbedField.new(name: "Full Names", value: building_list[:full_names], inline: true)
      ],
    )
  else
    embeddedMessageSender(
      event.channel,
      title: "BuildingBot Help",
      fields: $commands.each_with_object([]) do |(command, description), fields|
        fields << Discordrb::Webhooks::EmbedField.new(name: "~whereis #{command}", value: description)
      end
    )
  end
end

def embeddedMessageSender(
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

def gatherBuildingList
  codes, full_names = "", ""
  $buildings.each do |code, full_name|
    codes += "#{code}\n"
    full_names += "#{full_name}\n"
  end
  {
    codes: codes,
    full_names: full_names,
  }
end


bot.run
