import {GuildMember, RoleResolvable} from "discord.js";

export const AddUserRole = async (
  member: GuildMember,
  role: RoleResolvable
): Promise<string> => {
  try {
    await member.roles.add(role);
    return "success";
  } catch (err) {
    return `${err}`;
  }
};

export const RemoveUserRole = async (
  member: GuildMember,
  role: RoleResolvable
): Promise<string> => {
  try {
    await member.roles.remove(role);
    return "";
  } catch (err) {
    return `${err}`;
  }
};
