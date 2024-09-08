import {Config} from "@/config";
import {Events, Client, Message, type GuildTextBasedChannel} from "discord.js";

module.exports = {
  name: Events.MessageCreate,
  async execute(client: Client, message: Message) {
    try {
      if (message.author.bot || !Config.features.april_fools) return;

      // april fools, react with skull emoji to every message in general channel
      const channel = message.channel as GuildTextBasedChannel;
      if (channel.name === "general") await message.react("💀");
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      return;
    }
  },
};
