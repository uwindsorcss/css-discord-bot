import {logger, Config} from "@/config";
import {
  Events,
  User,
  MessageReaction,
  TextChannel,
  GuildChannel,
  Client,
} from "discord.js";

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(client: Client, reaction: MessageReaction, user: User) {
    try {
      if (user.bot || !Config.pin.enabled) return;

      if (reaction.emoji.name === "📌") {
        await tryPinMessage(reaction, user);
      }
    } catch (error) {
      logger.error("Something went wrong when fetching the message:", error);
    }
  },
};

async function shouldPinInChannel(channel: GuildChannel) {
  return (
    channel.parent !== null &&
    Config.pin.categories.toString().includes(channel.parent.id)
  );
}

async function tryPinMessage(reaction: MessageReaction, user: User) {
  if (reaction.partial) await reaction.fetch();
  if (!reaction.message.pinnable || reaction.message.pinned) return;

  const channel = reaction.message.channel as TextChannel;
  if (!(channel instanceof TextChannel) || !(await shouldPinInChannel(channel)))
    return;

  const isGeneralChannel = channel.name === "general";
  const reactionThreshold = isGeneralChannel
    ? Config.pin.general_count
    : Config.pin.count;
  if (reaction.count >= reactionThreshold) {
    await reaction.message.pin();
    logger.info(
      `Pinned message | channel: ${channel.name}, message ID: ${reaction.message.id}`
    );
  }
}
