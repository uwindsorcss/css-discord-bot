import { GuildMember, GuildMemberRoleManager, RoleResolvable } from "discord.js";
import { important_roles } from "../config";
import { logger } from "../logger";

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

export const CheckUserRole = async (
    member: GuildMember
): Promise<boolean> => {
    try {
        let roles = (member.roles as GuildMemberRoleManager).cache;
        let check : boolean = roles.some(role => important_roles.includes(role.name));
        return check
    }
    catch (err) {
        logger.error({err})
        return false;
    }

}