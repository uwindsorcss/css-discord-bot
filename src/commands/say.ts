import { logger } from "../logger";
import { inlineCode, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, MessageEmbed, TextChannel, GuildMember } from "discord.js";
import { CommandType } from "../types";
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
  execute: async (interaction: CommandInteraction<CacheType>) => {

    const ephemeral = true;
    try {

      let checkImpRoles: boolean = await CheckUserRole(interaction.member! as GuildMember)

      // If the user's role is in the important roles
      if (checkImpRoles) {
        let channelId = interaction.options.getChannel('destination') as TextChannel;

        let message = interaction.options.getString('message')!;
        logger.debug(`channelId is: ${channelId}`);

        channelId?.send({ content: message })


        const embed = new MessageEmbed()
          .setTitle('Successfully Say Messages')
          .setDescription(`Successfully say ${inlineCode(message)} in ${inlineCode(channelId.name)}!`);


        interaction.reply({ embeds: [embed], ephemeral });
      }
      else {
        return interaction.reply({
          content: 'You need the admin role to run this command',
          ephemeral
        });
      }
    } catch (error) {
      logger.error(`Say command failed: ${error}`);
    }
  },

};

export { sayModule as command };
