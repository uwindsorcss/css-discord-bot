require 'discordrb'
require 'pry'
require 'json'
require 'fuzzystringmatch'
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
    begin
      arg = event.message.content.split(' ').drop(1).join(' ')
      if building = BuildingService.find_building(arg)
        DiscordMessageSender.send_embedded(
          event.channel,
          title: "Building Search",
          image: Discordrb::Webhooks::EmbedImage.new(url: "#{IMAGE_DIRECTORY_URL}/#{building}.png"),
          description: BuildingService.get_building_name(building),
        )
      elsif arg == "list"
        building_list = BuildingService.gather_building_list
        DiscordMessageSender.send_embedded(
          event.channel,
          title: "Building List",
          fields: [
            Discordrb::Webhooks::EmbedField.new(name: "Codes", value: building_list[:codes], inline: true),
            Discordrb::Webhooks::EmbedField.new(name: "Full Names", value: building_list[:full_names], inline: true)
          ],
        )
      elsif arg == "help"
        DiscordMessageSender.send_embedded(
          event.channel,
          title: "BuildingBot Help",
          fields: $commands.each_with_object([]) do |(command, description), fields|
            fields << Discordrb::Webhooks::EmbedField.new(name: "~whereis #{command}", value: description)
          end
        )
      else
        DiscordMessageSender.send_embedded(
          event.channel,
          title: "Invalid Command",
          description: "Building or command could not be found. :disappointed:\n\nTry using **~whereis help**",
        )
      end
    rescue RestClient::Exception, RestClient::ExceptionWithResponse
      DiscordMessageSender.send_embedded(
        event.channel,
        title: ":bangbang: Error",
        description: "Caught a 400 error from RestClient. Please report this incident to administrator.",
        thumbnail: nil,
      )
    end
  end
  bot.run
  bot.game="~whereis help"
end
