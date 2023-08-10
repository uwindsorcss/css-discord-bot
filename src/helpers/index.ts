import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  ColorResolvable,
  Colors,
  EmbedBuilder,
} from "discord.js";

export const handleEmbedResponse = async (
  interaction: ChatInputCommandInteraction,
  error: boolean,
  options?: {
    embed?: EmbedBuilder;
    title?: string;
    message?: string;
    color?: ColorResolvable;
    ephemeral?: boolean;
  }
) => {
  let {embed, title, message, color, ephemeral} = options ?? {};

  if (!embed) {
    embed = createEmbed(
      title ?? (error ? ":x: Error" : ":white_check_mark: Success"),
      message ??
        (error
          ? "An error occurred, please try again later."
          : "Command successful."),
      color ?? (error ? Colors.Red : Colors.Green)
    );
  }

  return await interaction.reply({
    embeds: [embed],
    ephemeral: ephemeral ?? true,
  });
};

export const createEmbed = (
  title: string,
  description: string,
  color: ColorResolvable
) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color);
};
