import { logger } from "@/config";
import { handleEmbedResponse } from "@/helpers";
import {
  type CacheType,
  ChatInputCommandInteraction,
  ButtonInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  TextChannel,
} from "discord.js";

const TIMEOUT_OPTIONS = [
  { label: "10m", minutes: 10 },
  { label: "1h", minutes: 60 },
  { label: "3h", minutes: 180 },
  { label: "6h", minutes: 360 },
  { label: "1d", minutes: 1440 },
  { label: "2d", minutes: 2880 },
  { label: "1w", minutes: 10080 },
];

export function buildButtonRow(buttons: ButtonBuilder[]) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
}

const timeoutUserModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user for a certain duration")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to timeout").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration of the timeout")
        .setRequired(true)
        .addChoices(...TIMEOUT_OPTIONS.map((o) => ({ name: o.label, value: o.minutes.toString() })))
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the timeout").setRequired(false)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const user = interaction.options.getUser("user", true);
      const guildMember = await interaction.guild?.members.fetch(user.id);
      const channel = interaction.channel as TextChannel;

      if (!channel || !channel.isTextBased()) {
        return handleEmbedResponse(interaction, true, {
          message: "This command must be used in a text channel.",
          ephemeral: true,
        });
      }

      if (!guildMember) {
        return handleEmbedResponse(interaction, true, {
          message: "User not found in this server.",
          ephemeral: true,
        });
      }

      const durationMinutes = parseInt(interaction.options.getString("duration", true));
      const reason = interaction.options.getString("reason") || "No reason provided";
      const durationMs = durationMinutes * 60 * 1000;

      const confirmRow = buildButtonRow([
        new ButtonBuilder()
          .setCustomId(`confirmTimeout_${user.id}`)
          .setLabel(`Timeout ${user.tag} for ${durationMinutes}m`)
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cancelTimeout_${user.id}`)
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Secondary),
      ]);

      await interaction.reply({
        content: `⚠️ You are about to timeout <@${user.id}> for **${durationMinutes} minute(s)**. Reason: ${reason}`,
        components: [confirmRow],
        ephemeral: true,
      });

      const collector = channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 30000,
        filter: (i) => i.user.id === interaction.user.id,
      });

      collector?.on("collect", async (btn: ButtonInteraction) => {
        if (!guildMember) return;

        if (btn.customId === `confirmTimeout_${user.id}`) {
          await guildMember.timeout(durationMs, reason).catch((err) => {
            logger.error(`Failed to timeout ${user.id}: ${err}`);
            return handleEmbedResponse(interaction, true, {
              message: "Failed to timeout the user.",
              ephemeral: true,
            });
          });

          await btn.update({
            content: `✅ <@${user.id}> has been timed out for **${durationMinutes} minute(s)**.`,
            components: [],
          });
        } else if (btn.customId === `cancelTimeout_${user.id}`) {
          await btn.update({
            content: "⛔ Timeout cancelled.",
            components: [],
          });
        }

        collector.stop();
      });
    } catch (error) {
      logger.error(`Timeout command failed: ${error}`);
      await handleEmbedResponse(interaction, true, {
        message: "An error occurred while trying to timeout the user.",
        ephemeral: true,
      });
    }
  },
};

export { timeoutUserModule as command };
