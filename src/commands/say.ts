import { logger } from "../logger";
import { inlineCode, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, MessageEmbed, Client, TextChannel, Intents, Message, GuildMemberRoleManager, GuildMember } from "discord.js";
import { ClientType, CommandType } from "../types";
import { important_roles } from "../config";
import { CheckUserRole } from "../helpers/userRoles";

const sayModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Say something?")
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName('message')
        .setDescription('The text you want me to say')
        .setRequired(true)
    )
    .addChannelOption((option: SlashCommandChannelOption) =>
      option
        .setName('destination')
        .setDescription('Select a channel')
        .setRequired(true)
        .addChannelType(0) //text channel
    ),
  execute: async (interaction: CommandInteraction<CacheType>, message: Message | null | undefined) => {

    const ephemeral = true;
    try {

      let check = await CheckUserRole(interaction.member! as GuildMember)
      
      if (check) {
        let channelId = interaction.options.getChannel('destination') as TextChannel;

        let message = interaction.options.getString('message')!;
        logger.debug(`channelId is: ${channelId}`);

        channelId?.send({ content: message })


        const embed = new MessageEmbed()
          .setColor('DARK_GREEN')
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
          })
          .setTitle('Successfully Say Messages')
          .setDescription(`Successfully say ${inlineCode(message)} in ${inlineCode(channelId.name)}!`)
          .setTimestamp()
          .setFooter({ text: `Version 9` });

        interaction.reply({ embeds: [embed], ephemeral });
      }
      else {
        return interaction.reply({
          content: 'You need the admin role to run this command',
          ephemeral
        });
      }


    } catch (error) {
      console.error(error);
    }



  },

};

export { sayModule as command };
