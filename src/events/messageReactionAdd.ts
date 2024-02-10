import {logger, Config} from "@/config";
import {Events, User, MessageReaction, Client, TextChannel} from "discord.js";

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(client: Client, reaction: MessageReaction, user: User) {
    try {
      if (user.bot || !Config.pin.enabled) return;
      if (reaction.partial) await reaction.fetch();

      // Pin feature
      if (
        reaction.emoji.name === "📌" &&
        reaction.count >= 1 &&
        reaction.message.pinnable &&
        !reaction.message.pinned
      ) {
        const channel = (await reaction.message.channel.fetch()) as TextChannel;
        const category = channel.parent;

        if (
          category &&
          Config.pin.categories.toString().includes(category.id) &&
          reaction.count >= Config.pin.count
        ) {
          await reaction.message.pin();
          logger.info(
            `Pinned message | channel: ${channel.name}, message: ${reaction.message}`
          );
        }
      }
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      return;
    }
  },
};
