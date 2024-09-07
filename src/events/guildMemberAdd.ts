import { Config } from "@/config";
import {
  Client,
  Events,
  GuildMember,
  RoleResolvable
} from "discord.js";

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(client: Client, member: GuildMember) {
    try {
      if (Config?.features?.assign_role_on_join) {
        await assignEventPingRole(member);
      }
    } catch (error) {
      console.error(`Error adding Event Ping role to ${member.user.tag}:`, error);
    }
  },
};

async function assignEventPingRole(member: GuildMember): Promise<void> {
  const eventPingRoleID: RoleResolvable | undefined = Config?.other_roles?.event_ping;

  if (!eventPingRoleID) {
    console.warn("Event Ping role ID is not defined in the config.");
    return;
  }

  try {
    await member.roles.add(eventPingRoleID);
  } catch (error) {
    console.error(`Failed to assign Event Ping role to ${member.user.tag}:`, error);
  }
}
