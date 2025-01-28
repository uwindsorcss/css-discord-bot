import { logger, Config } from "@/config";
import { EmbedBuilder } from "@discordjs/builders";
import { readFile } from 'fs';

import {
  CacheType,
  SlashCommandBuilder,
  GuildMember,
  ChatInputCommandInteraction,
  Message,
} from "discord.js";

function validateWord(word: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        readFile("data/words.txt", (error, text) => {
            if (error) {
                logger.log(error);
                reject(error);
                return;
            }
    
            const words = text.toString().split("\n").map((dWord) => dWord.trim());

            let low: number = 0;
            let high: number = words.length - 1;
            while (low <= high) {
                let mid: number = Math.floor((low + high) / 2);
                let currentWord = words[mid];
                if (currentWord === word) {
                    resolve(true);
                    return;
                }
    
                if (currentWord < word) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
                
            }

            resolve(false);
        });
    });
}

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

            // Test Case Sigma
            let sigmaValid = validateWord("sigma")
                .then(async (valid) => {
                    if (valid) {
                        await interaction.reply("sigma is a word");
                    } else {
                        await interaction.reply("sigma is not a word");
                    }
                })
                .catch((error) => {
                    logger.log(error);
                })
        }

    }
}

export {minigameModule as command}