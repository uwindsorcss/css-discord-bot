require 'discordrb'
require 'fuzzystringmatch'

# services
require_relative 'services/discord_message_sender'
require_relative 'services/building_service'
require_relative 'services/latex_service'

require_relative 'services/return_error'

require_relative 'services/command_direct_to_bot'


# config module
require_relative './config'

# modules
require_relative 'modules/event_roles'
require_relative 'modules/purge'
require_relative 'modules/equation'

class Main
 
  # startup sequence
  bot = Discordrb::Commands::CommandBot.new(
    token: Config::CONFIG["api_token"],
    client_id: Config::CONFIG["api_client_id"],
    prefix: '~'
  )

  bot.ready() do |event|
    bot.game="~help"
  end

  bot.command(:help) do |event|
    fields = []
    fields << Discordrb::Webhooks::EmbedField.new(
      name: "General Commands",
      value:
        "**`~year <1-4, masters, alumni>`** - add your current academic status to your profile.\n"\
        "**`~purge <2-99>`** - remove the last `n` messages in channel (**admin only**)\n"\
        "**`~equation <latex command>`** - returns an image of a latex equation.\n"\
        "**`~help`** - return the help menu\n"\
        "\n\u200B"
    )

    fields << Discordrb::Webhooks::EmbedField.new(
      name: "Building Search Commands",
      value:
        "**`~whereis <buildingName || buildingCode>`** - return building details and location on map\n"\
        "**`~whereis list`** - return the list of all building codes and their associating names\n"
    )

    DiscordMessageSender.send_embedded(
      event.channel,
      title: "Help Menu",
      description: "Note: Arguments in <this format> do not require the '<', '>' characters\n\u200B",
      fields: fields,
    )
  end

  # run when command is ~equation
  if Config::CONFIG["features"]["equation"]
    bot.include! Equation
  end

  # bot.command(:equation) do |event|
  #   file_name = "formula#{event.user.id}#{event.message.timestamp.to_i}.png"
  #   begin

  #     # Combine every word after 'latex' for multi word arguments (eg \frac{23 a}{32} )
  #     args = event.message.content.split(' ').drop(1).join(' ')

  #     # Clean for escaped latex characters
  #     clean_args = LatexService.sanitize(args)

  #     # if it renders properly then send the image
  #     # else return error
  #     if LatexService.render?(clean_args, Config::LATEX_DIRECTORY_RELATIVE_PATH, file_name)
  #       event.send_file(File.open(File.join('./' ,Config::LATEX_DIRECTORY_RELATIVE_PATH, file_name), 'r'))
  #     else
  #       ReturnError.return_error(event.channel, 'Formula Didnt Compile')
  #     end
  #   rescue Exception => e
  #     puts e.message
  #     puts e.backtrace.inspect
  #   ensure
  #     # cleans file even if error
  #     # delete the files created
  #     LatexService.cleanup(Config::LATEX_DIRECTORY_RELATIVE_PATH, file_name)
  #   end
  # end

  bot.command(:whereis) do |event|
    begin
      # Combine every word after 'whereis' for multi-word arguments (e.g. "Erie Hall")
      args = event.message.content.split(' ').drop(1).join(' ')
      if args == "list"
        building_list = BuildingService.gather_building_list
        DiscordMessageSender.send_embedded(
          event.channel,
          title: "Building List",
          fields: [
            Discordrb::Webhooks::EmbedField.new(name: "Codes", value: building_list[:codes], inline: true),
            Discordrb::Webhooks::EmbedField.new(name: "Full Names", value: building_list[:full_names], inline: true)
          ],
        )

      # If the argument matches a building
      elsif building_code = BuildingService.find_building(args)
        DiscordMessageSender.send_embedded(
          event.channel,
          title: "Building Search",
          image: Discordrb::Webhooks::EmbedImage.new(url: "#{Config::IMAGE_DIRECTORY_URL}/#{building_code}.png"),
          description: BuildingService.get_building_name(building_code) + " (#{building_code})",
        )

      # Arguments did not match a command or building
      else
        ReturnError.return_error(event.channel, "Building or command could not be found."\
          "\n\nList of buildings can be found at **~whereis list**")
      end
    end
  end

  if Config::CONFIG["features"]["purge"]
    bot.include! Purge
  end

  bot.command(:year) do |event|
    return if CommandSentAsDirectMessageToBot.command_sent_as_direct_message_to_bot? (event)

    year = event.message.content.split(' ').drop(1).join(' ').upcase
    server = event.server
    member = server.members.find { |member| member.id == event.user.id }


    year_roles = {
      "1" => server.roles.find { |role| role.name == "1st Year"},
      "2" => server.roles.find { |role| role.name == "2nd Year"},
      "3" => server.roles.find { |role| role.name == "3rd Year"},
      "4" => server.roles.find { |role| role.name == "4th Year"},
      "MASTERS" => server.roles.find { |role| role.name == "Masters"},
      "ALUMNI" => server.roles.find { |role| role.name == "Alumni"},
    }

    if !(year_roles.include? year)
      ReturnError.return_error(event.user.pm, "Invalid option. Please select from: `#{year_roles.keys.to_s}`")
      return
    end

    year_role = year_roles[year]

    if year_role
      begin
        member.add_role(year_role)
        previous_year_roles = member.roles.select { |role| (year_roles.values.include? role) && role != year_role }
        previous_year_roles.each { |role| member.remove_role(role) }
        DiscordMessageSender.send_embedded(
          member.pm,
          title: "Success",
          description: ":white_check_mark: Successfully added your year/status to your profile.",
        )
      rescue Discordrb::Errors::NoPermission
        ReturnError.return_error(member.pm, "Bot has insufficient permissions to modify your roles.")
      end
    else
      ReturnError.return_error(member.pm, "Bot was unable to find the associating role in the server. Please notify admin.")
    end
    event.message.delete
  end

  # event roles featurization
  if Config::CONFIG['features']['eventRoles']
    bot.include! EventRoles
  end

  puts "This bot's invite URL is #{bot.invite_url}."
  puts 'Click on it to invite it to your server.'
  bot.run
end
