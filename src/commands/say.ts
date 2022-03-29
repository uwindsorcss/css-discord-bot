import { logger } from "../logger";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, MessageEmbed } from "discord.js";
import { CommandType } from "../types";

const sayModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Say something?")
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName('input')
        .setDescription('The text you want me to say')
        .setRequired(true)
    )
  ,
  execute: async (interaction: CommandInteraction<CacheType>) => {
    logger.info("hello from say");
    // await interaction.reply("hello from say");
    if (interaction.isCommand()) {
      try {
        if (!interaction.memberPermissions!.has(['MANAGE_CHANNELS'])) {
          return interaction.reply({
            content:
              'You need the manage channels permission to run this command',
            ephemeral: true
          });
        }

        const input = interaction.options.getString('input')!;

        await interaction.reply({ content: 'Sending...', ephemeral: true });

        const embed = new MessageEmbed()
          .setColor('BLURPLE')
          .setAuthor(
            interaction.user.tag,
            interaction.user.displayAvatarURL({ dynamic: true })
          )
          .setDescription(input)
          .setTimestamp()
          .setFooter(`Sent using the send command`);

        await interaction.channel?.send({ embeds: [embed] });

        interaction.editReply({ content: 'Sent!' });
      } catch (err) {
        console.error(err);
      }
    }
  },

};

export { sayModule as command };
