require 'discordrb'

require_relative '../config'

module EventRoles
  extend Discordrb::EventContainer

  # event roles channel add role system
  # 
  # event messages will have a simple structure
  # first line is the role
  # then a buffer line
  # then a description of the event
  # example: 
  # @name
  #
  # this event exists and some other stuff
 
  # this is the first function to add a reaction if the message fits that format
  message(in: "#event-roles") do |event|
    role = event.message.role_mentions.first
   
    # if role isnt nil and role isnt in IMPORTANT_ROLES
    # !(a || b) == (!a && !b)
    unless role.nil? || Config::IMPORTANT_ROLES.include?(role.name)
      event.message.react("✅")
    end
  end

  # function to add a role to someone who clicked it
  # makes sure its the right emote
  reaction_add(emoji: "✅") do |event|
    role = event.message.role_mentions.first
    channel = event.message.channel
    server = channel.server
    member = server.members.find { |member| member.id == event.user.id }

    # split these up to read easier

    # if channel name is "event-roles" and the user isnt a bot
    if channel.name == "event-roles" && !event.user.bot_account?
      # if role isnt nil and role isnt in IMPORTANT_ROLES
      # !(a || b) == (!a && !b)
      unless role.nil? || Config::IMPORTANT_ROLES.include?(role.name)
        # if the user doesnt have the role
        unless member.role?(role)
          member.add_role(role)
        end
      end
    end
  end

  # function to remove a role from someone who unreacted
  # makes sure its the right emote
  reaction_remove(emoji: "✅") do |event|

    role = event.message.role_mentions.first
    channel = event.message.channel
    server = channel.server
    member = server.members.find { |member| member.id == event.user.id }

    # if user isnt a bot and its in channel "event-roles"
    if !event.user.bot_account? && channel.name == "event-roles"
      # if role isnt nil and role isnt in IMPORTANT_ROLES
      # !(a || b) == (!a && !b)
      unless role.nil? || Config::IMPORTANT_ROLES.include?(role.name)
      # if the user has the role
      # then remove
        if member.role?(role)
          member.remove_role(role)
        end
      end
    end
  end

end
