import {CommandType} from "../types";
import {logger} from "@/config";
import {createEmbed} from "@/helpers";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  CacheType,
  Colors,
  PermissionsBitField,
  PermissionResolvable,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import {commandArr} from ".";

const helpModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command"),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const memberPermissions = interaction.member
        ?.permissions as PermissionsBitField;
      const generalCommands: string[] = [];
      const staffCommands: string[] = [];

      const formatCommand = (
        command: RESTPostAPIChatInputApplicationCommandsJSONBody
      ) => `**/${command.name}** - ${command.description}.`;

      commandArr.forEach((command) => {
        if (command.name !== "help") {
          if (command.default_member_permissions === undefined) {
            generalCommands.push(formatCommand(command));
          } else if (
            memberPermissions.has(
              command.default_member_permissions as PermissionResolvable
            )
          ) {
            staffCommands.push(formatCommand(command));
          }
        }
      });

      let helpMessage = generalCommands.join("\n");
      if (staffCommands.length > 0) {
        helpMessage += `\n\n ${"=".repeat(30)}\n
        **Staff commands that you have access to:**\n
        ${staffCommands.join("\n")}`;
      }

      await interaction.reply({
        embeds: [createEmbed("Help", helpMessage, Colors.Blue)],
        ephemeral: true,
      });
    } catch (error) {
      logger.error(`Help command failed: ${error}`);
    }
  },
};

export {helpModule as command};
