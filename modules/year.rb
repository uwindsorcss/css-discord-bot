require 'discordrb'

require_relative '../config'

require_relative '../services/command_direct_to_bot'

module Year
  extend Discordrb::Commands::CommandContainer

  command(:year) do |event|
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
end
