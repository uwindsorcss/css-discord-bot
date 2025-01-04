import { logger, Config } from "@/config";
import { EmbedBuilder } from "@discordjs/builders";

import {
  CacheType,
  SlashCommandBuilder,
  GuildMember,
  ChatInputCommandInteraction,
  Message,
} from "discord.js";


const minigameModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("minigame")
        .setDescription("Play a minigame in the channel")
        .addSubcommand((game) =>
            game
            .setName("wordbomb")
            .setDescription("Find as much words as possible before time is up!")
        ),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        if (interaction.channel?.id !== Config.discord.bot_channel) {
            return await interaction.reply(
                {content: `You can only use this command in <#${Config.discord.bot_channel}>`, 
                ephemeral: true}
            );
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "wordbomb") {
            let players: Array<GuildMember> = []
            let previousMessage: Message;
        }

    }
}

export {minigameModule as command}