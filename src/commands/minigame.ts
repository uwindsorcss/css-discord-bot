import { logger, Config } from "@/config";
import { readFile } from 'fs';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";

import {
  CacheType,
  SlashCommandBuilder,
  GuildMember,
  ChatInputCommandInteraction,
  Message,
  Colors,
  ComponentType,
  Collection,
} from "discord.js";

// game config
const WORDBOMB_TURN_TIME = 10_000; // time each player gets in their turn
const JOIN_TIME = 8_000; // amt of time for people to join
const REQUIRED_PLAYERS = 1; // (CHANGE IN PRODUCTION) required players in order for the game to start and continue
let WORD_LIST: string[] = [];
// hello
// hi 🙂

function InitWordList(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        readFile("data/wordlist.txt", (error, text) => {
            if (error) {
                logger.debug(error);
                reject(error);
                return;
            }
            const words = text.toString().split("\n").map((dWord) => dWord.trim());
            resolve(words);
        });
    });
}

function getSubstring(words: string[]): string {
    const eligibleWords = words.filter(word => word.length >= 3);
    const word = eligibleWords[Math.floor(Math.random() * eligibleWords.length)];
    const startIndex = Math.floor(Math.random() * (word.length - 2));

    return word.substring(startIndex, startIndex + 3);
}

function validateWord(word: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (WORD_LIST.length === 0) {
            logger.debug("Word list is empty");
            reject("Word list is empty");
            return;
        }
        let low: number = 0;
        let high: number = WORD_LIST.length - 1;
        while (low <= high) {
            let mid: number = Math.floor((low + high) / 2);
            let currentWord = WORD_LIST[mid];
            if (currentWord === word) {
                logger.info("found word: " + currentWord)
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
}

const minigameModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("minigame")
        .setDescription("Play a minigame in the channel")
        .addSubcommand((game : any) =>
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
        const {channel} = interaction

        console.log(subcommand);
        
        if (subcommand === "wordbomb") {
            InitWordList().then((words) => {
                logger.info(`Word list initialized with ${words.length} words`);
                WORD_LIST = words;
            });

            type Player = {
                Member: GuildMember,
                Chances: number, // # number of chances until eliminated
                CorrectGuess: Boolean,
                Score: number,
            }

            let players: Array<Player> = []
            let joinEmbed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(`${"Word Bomb! 💣"}`)
            .setDescription(`Click to join the Word-Bomb game! \n\n**${players.length}/${REQUIRED_PLAYERS} players required to start!**`)
            .addFields({name: "Rules", value: "1. Guess a word with a substring\n2. Wait for your turn to be announced\n3. You get a strike if you fail to guess a word or run out of time.\n4. You cannot use a word already used\n5. 2 strikes and you're out!", inline: false});
    
            let joinGame = await interaction.reply({
                embeds: [joinEmbed],
                fetchReply: true,
            });


            const collector = interaction.channel.createMessageComponentCollector({ 
                componentType: ComponentType.Button,
                //filter: (i) => i.user,
                time: JOIN_TIME,    
            });

            collector.on("collect", async (i : ChatInputCommandInteraction) => {
                if (players.find(p => p.Member.id === i.member.id)) {
                    return await i.reply({ content: "You are already in the game!", ephemeral: true});
                }

                players.push({
                    Member: i.member as GuildMember,
                    Chances: 2,
                    CorrectGuess: false,
                    Score: 0
                } as Player);

                await i.reply({ content: "You have joined the game!", ephemeral: true});
                
                if (players.length > 1) {
                    joinEmbed.setFields({name: "Players", value: `${players.map(player => player.Member).join("\n")}`});
                } else {
                    joinEmbed.addFields({ name: "Players", value: `${players.map(player => player.Member).join("\n")}`, inline: false });
                }

                joinEmbed.setDescription(`Click to join the Word-Bomb game! \n\n**${players.length}/${REQUIRED_PLAYERS} players required to start!**`);

                joinGame.edit({embeds: [ joinEmbed ]});
            })

            const joinButton = new ButtonBuilder()
                .setCustomId("join-minigame")
                .setLabel("Join")
                .setStyle(3);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton);

            await interaction.editReply({ embeds: [joinEmbed], components: [row] });

            let resolveTurn : any;
            let currentPlayer : Player;

            async function wait(ms : number) : Promise<void> {
                return new Promise(resolve => {
                    resolveTurn = resolve
                    setTimeout(resolve, ms)
                })
            }

            setTimeout(async () => {

                // checks for atleast two palyers
                if (players.length < REQUIRED_PLAYERS){
                    interaction.channel.send(`Atleast ${REQUIRED_PLAYERS} people are required for this game 😔`)
                    return
                }
                
                let usedWords: string[] = [];

                // This is to keep track of scores since original player list is updated.
                let scoreboard: Player[] = players;

                while (players.length >= REQUIRED_PLAYERS){
                    for (let i in players){

                        currentPlayer = players[i];
                        const subString: string = getSubstring(WORD_LIST);
                        channel.send(`**It's ${currentPlayer.Member}'s turn!**\n\n**Substring: ${subString}**`);
                        let guessedCorrectly : Boolean = false;

                        const filter = (msg : Message) => (msg.member.id === currentPlayer.Member.id);
                        const collector = channel.createMessageCollector({filter, time: WORDBOMB_TURN_TIME});

                        collector.on('collect', async (msg : Message) => {
                            let wordIsValid : Boolean = await validateWord(msg.content.toLowerCase());
                            if (wordIsValid && msg.content.includes(subString)) {
                                console.log(`${msg.content} is a valid word? : ${wordIsValid}` );
                                if (msg.content.toLowerCase() in usedWords) {
                                    channel.send("Can't use a word that has already been used, -1 Chance.");
                                    wordIsValid = false;
                                } else {
                                    console.log("VALID WORD!");
                                    usedWords.push(msg.content.toLowerCase());
                                    currentPlayer.Score += 1;
                                    collector.stop();
                                    resolveTurn();
                                    guessedCorrectly = true;
                                    channel.send(`${currentPlayer.Member} **Correct! 👍**, your current score is **${currentPlayer.Score}**`);
                                }
                            } else {
                                guessedCorrectly = false;
                            }
                        });
                        
                        await wait(WORDBOMB_TURN_TIME);
                        if (!guessedCorrectly) {
                            currentPlayer.Chances -= 1;
                            if (currentPlayer.Chances <= 0) {
                                const index = players.findIndex(p => p.Member.id === currentPlayer.Member.id);

                                scoreboard[index].Score = currentPlayer.Score;
                                
                                if (index > -1) {
                                    players.splice(index, 1);
                                } else {
                                    logger.info("could not find player");
                                }


                                channel.send(`**No more chances left, you have been Eliminated ❌**`);
                            
                            } else{
                                channel.send(`Times up! 😕\n-1 Chance 👎`);
                            }

                        }

                    }
                }

                if (players.length > 0) {
                    scoreboard.sort((a, b) => b.Score - a.Score);
                    interaction.channel.send(`The Winner is: ${players[0].Member.user} 🥳🏆\n\n**Scoreboard:** ${scoreboard.map(scores => `${scores.Member}: ${scores.Score}`).join("\n")}`);
                } else {
                    interaction.channel.send(`No one Won 😞`)
                }

            }, JOIN_TIME);


        } else {
            await interaction.editReply({ content: "Invalid game", embeds: [embed] });

        }

    }
}

export {minigameModule as command}