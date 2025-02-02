import { logger, Config } from "@/config";
<<<<<<< Updated upstream
import { EmbedBuilder } from "@discordjs/builders";
import { readFile } from 'fs';
=======
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
>>>>>>> Stashed changes

import {
  CacheType,
  SlashCommandBuilder,
  GuildMember,
  ChatInputCommandInteraction,
  Message,
  Colors,
  ComponentType,
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

        console.log(subcommand);

        const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle(`${"Word Bomb! 💣"}`)
        .setDescription(`${"Click to join the Word-Bomb game!"}`)

        const response = await interaction.reply({
            embeds: [embed],
            fetchReply: true,
          });

        if (subcommand === "wordbomb") {

            type Player = {
                Member: GuildMember,
                Chances: Number, // # number of chances until eliminated
            }

            let players: Array<Player> = []
            let previousMessage: Message;
<<<<<<< Updated upstream

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
=======
            
            const collector = interaction.channel.createMessageComponentCollector(
                { 
                componentType: ComponentType.Button,
                //filter: (i) => i.user,
                time: 7_000,    
                }
            )

            collector.on("collect", async (i) => {

                if (players.find(p => p.Member.id === i.member.id)) {
                    return await i.reply({ content: "You are already in the game!" });
                }

                players.push({
                    Member: i.member as GuildMember,
                    Chances: 2
                } as Player);

                await i.reply({ content: "You have joined the game!" });
            })

            const joinButton = new ButtonBuilder()
                .setCustomId("join-minigame")
                .setLabel("Join")
                .setStyle(3);



            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                joinButton
            );

            await interaction.editReply({ embeds: [embed], components: [row] });

        } else {
            await interaction.editReply({ content: "Invalid game", embeds: [embed] });

>>>>>>> Stashed changes
        }

    }
}

export {minigameModule as command}