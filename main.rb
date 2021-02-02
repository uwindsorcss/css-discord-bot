# discordrb api
require 'discordrb'

# services
require_relative 'services/discord_message_sender'

# config module
require_relative './config'

# modules
require_relative 'modules/event_roles'
require_relative 'modules/purge'
require_relative 'modules/equation'
require_relative 'modules/year'
require_relative 'modules/where_is'

class Main

  # startup sequence
  bot = Discordrb::Commands::CommandBot.new(
    token: Config::CONFIG["api_token"],
    client_id: Config::CONFIG["api_client_id"],
    prefix: '~'
  )

  bot.ready do
    bot.game = '~help'
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
  if Config::FEATURES["equation"]
    bot.include! Equation
  end

  # whereis featurization
  # runs when command is ~whereis
  if Config::FEATURES["whereis"]
    bot.include! WhereIs
  end

  # purge featurization
  # runs when command is ~purge
  if Config::FEATURES["purge"]
    bot.include! Purge
  end

  # year featurization
  # runs when command is ~year
  if Config::FEATURES["year"]
    bot.include! Year
  end

  # event roles featurization
  if Config::FEATURES['eventRoles']
    bot.include! EventRoles
  end

  puts "This bot's invite URL is #{bot.invite_url}."
  puts 'Click on it to invite it to your server.'
  bot.run
end
