import {
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

  //If no embed is provided, create one
  if (!embed) {
    embed = new EmbedBuilder();

    if (message) embed.setDescription(message);
    else {
      embed.setDescription(
        error
          ? "An error occurred, please try again later."
          : "Command successful."
      );
    }

    if (title) embed.setTitle(title);
    else embed.setTitle(error ? ":x: Error" : ":white_check_mark: Success");

    if (color) embed.setColor(color);
    else embed.setColor(error ? Colors.Red : Colors.Green);
  }

  return await interaction.reply({
    embeds: [embed],
    ephemeral: ephemeral ?? true,
  });
};
