import {APIGuildMember} from "discord-api-types";
import {GuildMember} from "discord.js";
import {Config} from "../config";

/**
 * Determines the most permissive role the user has, and returns its permission level.
 * @param user the user to calculate the permission level for
 * @returns the permission level for the user (0 = no special permissions)
 */
const userPermissionLevel = (user: GuildMember): number => {
  let rolePermLevels = Config?.role_permission_levels;
  if (!rolePermLevels) return 0;

  let userRoles: Array<string> = user.roles.cache.map((value) => value.name);

  let level = 0;
  for (var i in userRoles) {
    let roleName = userRoles[i];
    let roleLevel = rolePermLevels[roleName];
    if (roleLevel) level = Math.max(level, roleLevel);
  }

  return level;
};

/**
 * Determines the permission level a user must have to use the given feature
 * @param feature name of the feature to find the permission level for
 * @returns the permission level of the feature, or 0 if the config doesn't specify
 */
const featurePermissionLevel = (feature: string): number => {
  let featurePermlevels = Config?.feature_permissions;
  if (!featurePermlevels) return 0;

  let featureLevel = featurePermlevels[feature];
  return featureLevel ? featureLevel : 0;
};

/**
 * Determines whether or not the provided user can use the provided feature.
 * Null users will always return false, and are allowed for ease of use.
 * Typically, you will get the user argument from `Interaction.member`.
 * @param user the member to check permission for
 * @param feature the feature name as it appears in the config
 * @returns `true` if `userPermissionlevel >= featurePermissionLevel`
 */
const userCanUseFeature = (
  user: GuildMember | APIGuildMember | null,
  feature: string
): boolean => {
  if (user === null) return false;

  user = user as GuildMember;
  return userPermissionLevel(user) >= featurePermissionLevel(feature);
};

export {userPermissionLevel, featurePermissionLevel, userCanUseFeature};
