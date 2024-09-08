import {logger} from "@/config";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  type CacheType,
  EmbedBuilder,
  Colors,
} from "discord.js";

const getDiscordApiPing = async () => {
  const start = Date.now();
  await fetch(
    `https://discord.com/api/v${process.env.DISCORD_API_VERSION}/gateway`
  );
  return Date.now() - start;
};

const pongModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings the bot to check its latency and uptime"),
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

      const pingEmbed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("Pinging...");

      const interactionStartTime = interaction.createdTimestamp;
      const preResponseTime = Date.now();

      // Send the initial response and wait for a reply
      const response = await interaction.reply({
        embeds: [pingEmbed],
        fetchReply: true,
      });

      const postResponseTime = Date.now();
      const discordApiPing = await getDiscordApiPing();
      const apiOffset =
        discordApiPing - (preResponseTime - interactionStartTime);

      pingEmbed.setTitle("Pong").addFields(
        {
          name: ":signal_strength: API Latency",
          value: `${preResponseTime - interactionStartTime + apiOffset}ms`,
        },
        {
          name: ":signal_strength: Round Trip",
          value: `${postResponseTime - interactionStartTime + apiOffset}ms`,
        },
        {
          name: ":arrow_up: Bot Uptime",
          value: timeComponents.join(", "),
        }
      );

      return await response.edit({
        embeds: [pingEmbed],
      });
    } catch (error) {
      logger.error(error);
    }
  },
};

export {pongModule as command};
