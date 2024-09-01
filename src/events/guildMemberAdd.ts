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
      if (Config?.features?.welcome_week_role) {
        await assignWelcomeWeekRole(member);
      }
    } catch (error) {
      console.error(`Error adding Welcome Week role to ${member.user.tag}:`, error);
    }
  },
};

async function assignWelcomeWeekRole(member: GuildMember): Promise<void> {
  const welcomeWeekRoleID: RoleResolvable | undefined = Config?.other_roles?.welcome_week;

  if (!welcomeWeekRoleID) {
    console.warn("Welcome Week role ID is not defined in the config.");
    return;
  }

  try {
    await member.roles.add(welcomeWeekRoleID);
  } catch (error) {
    console.error(`Failed to assign Welcome Week role to ${member.user.tag}:`, error);
  }
}
