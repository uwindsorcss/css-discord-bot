require 'discordrb'
require 'pry'
require 'json'
require_relative 'services/discord_message_sender'
require_relative 'services/building_service'

class Main
  secrets = JSON.parse(File.read('secrets.json'))
  IMAGE_DIRECTORY_URL = secrets["image_directory_url"]

  bot = Discordrb::Commands::CommandBot.new(
    token: secrets["api_token"],
    client_id: secrets["api_client_id"],
    prefix: '~',
  )

  puts "This bot's invite URL is #{bot.invite_url}."
  puts 'Click on it to invite it to your server.'

  $commands = {
    "<buildingName||buildingCode>" => "returns the name of building and location on map",
    "list" => "returns the list of all building codes and their associating names",
    "help" => "returns the help menu"
  }

  bot.command(:whereis) do |event|
    arg = event.message.content.split(' ')[1]
    if BuildingService.new.getBuilding(arg)
      building = arg
      DiscordMessageSender.new.send_embedded(
        event.channel,
        title: "Building Search",
        image: Discordrb::Webhooks::EmbedImage.new(url: "#{IMAGE_DIRECTORY_URL}/#{building}.png"),
        description: BuildingService.new.getBuilding(arg),
      )
    elsif arg == "list"
      building_list = BuildingService.new.gatherBuildingList
      DiscordMessageSender.new.send_embedded(
        event.channel,
        title: "Building List",
        fields: [
          Discordrb::Webhooks::EmbedField.new(name: "Codes", value: building_list[:codes], inline: true),
          Discordrb::Webhooks::EmbedField.new(name: "Full Names", value: building_list[:full_names], inline: true)
        ],
      )
    else
      DiscordMessageSender.new.send_embedded(
        event.channel,
        title: "BuildingBot Help",
        fields: $commands.each_with_object([]) do |(command, description), fields|
          fields << Discordrb::Webhooks::EmbedField.new(name: "~whereis #{command}", value: description)
        end
      )
    end
  end

  bot.run
end
