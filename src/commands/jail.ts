import {CommandType} from "../types";
import {logger} from "@/config";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  CacheType,
  UserResolvable,
} from "discord.js";

const jailModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("jail")
    .setDescription("Put a user in jail for misbehaving (fun command)")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to put in jail")
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const member = interaction.options.getUser("user") as UserResolvable;

      const memberDisplayName = (await interaction.guild?.members.fetch(member))
        ?.displayName;

      if (!memberDisplayName) {
        return interaction.reply({
          content: "Cannot put this member in jail. Not sure why",
          ephemeral: true,
        });
      }

      const line = "-".repeat(12 + memberDisplayName?.length);
      const response =
        "If you can't do the time, don't do the crime ヽ(ಠ_ಠ)ノ\n" +
        "```\n" +
        line +
        "\n" +
        "|||   " +
        memberDisplayName +
        "   |||\n" +
        line +
        "\n```";

      await interaction.reply(response);
    } catch (error) {
      logger.error(`Jail command failed: ${error}`);
    }
  },
};

export {jailModule as command};
