import {CommandType} from "../types";
import {logger} from "@/config";
import {
  CacheType,
  UserResolvable,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

const freeModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("free")
    .setDescription("Free a user from jail (fun command)")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to free")
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const member = interaction.options.getUser("user") as UserResolvable;

      const memberDisplayName = (await interaction.guild?.members.fetch(member))
        ?.displayName;

      if (!memberDisplayName) {
        return interaction.reply({
          content: "Cannot let this member out of jail",
          ephemeral: true,
        });
      }

      const line = "-".repeat(12 + memberDisplayName?.length);
      const response =
        "Okay, time's up, you're free to go (•‿•)\n" +
        "```\n" +
        line +
        "\n" +
        "|||   " +
        memberDisplayName +
        "\n" +
        line +
        "\n```";

      await interaction.reply(response);
    } catch (error) {
      logger.error(`Free command failed: ${error}`);
    }
  },
};

export {freeModule as command};
