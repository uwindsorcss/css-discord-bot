import {logger} from "@/config";
import {CommandType} from "../types";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  CacheType,
  EmbedBuilder,
} from "discord.js";

const pongModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings the bot and gets the latency"),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const uptime = interaction.client.uptime as number;

      const days = Math.floor(uptime / 86400000);
      const hours = Math.floor(uptime / 3600000) % 24;
      const minutes = Math.floor(uptime / 60000) % 60;
      const seconds = Math.floor(uptime / 1000) % 60;
      const milliseconds = uptime % 1000;

      const timeComponents: string[] = [];
      if (days) timeComponents.push(`${days}d`);
      if (hours) timeComponents.push(`${hours}h`);
      if (minutes) timeComponents.push(`${minutes}m`);
      if (seconds) timeComponents.push(`${seconds}s`);
      if (milliseconds) timeComponents.push(`${milliseconds}ms`);

      const responseEmbed = new EmbedBuilder()
        .setColor("#00BFFF")
        .setTitle("Pong")
        .addFields(
          {
            name: ":signal_strength: API Latency",
            value: `${Math.round(interaction.client.ws.ping)}ms`,
          },
          {
            name: ":signal_strength: Bot Latency",
            value: `${Math.round(Date.now() - interaction.createdTimestamp)}ms`,
          },
          {
            name: ":arrow_up: Bot Uptime",
            value: timeComponents.join(", "),
          }
        );

      return interaction.reply({embeds: [responseEmbed]});
    } catch (error) {
      logger.error(error);
    }
  },
};

export {pongModule as command};
