import { Config } from "@/config";
import {
  Events,
  Client,
  Message,
  GuildTextBasedChannel,
} from "discord.js";
import { predict } from "../helpers/automod";

module.exports = {
  name: Events.MessageCreate,
  async execute(client: Client, message: Message) {
    try {
      if (message.author.bot) 
        return;
      if (Config.features.aprilfools) {
        // april fools, react with skull emoji to every message in general channel
        const channel = message.channel as GuildTextBasedChannel;
        if (channel.name === "general") await message.react("💀");
      }
      if (Config.automod.enabled) {
        // check message using our AI content filter
        predict(message.content)
          .then(response => {
            console.log(`response ${response}`)
            if (response > 0.5) {
              const channel = client.channels.cache.get(Config.automod.channel_id);
              if (channel) {
                channel.send(`Message from ${message.author.tag} was flagged as inappropriate: ${message.content}`);
              }
              else {
                console.error("Channel not found");
              }
            }
        })
      }
      
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      return;
    }
  },
};
