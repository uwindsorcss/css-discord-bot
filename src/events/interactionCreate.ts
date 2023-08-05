import {logger} from "@/config";
import {ClientType} from "@/types";
import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  Events,
  Interaction,
} from "discord.js";

module.exports = {
  name: Events.InteractionCreate,
  async execute(client: ClientType, interaction: Interaction<CacheType>) {
    if (interaction.isChatInputCommand()) {
      HandleCommandInteraction(client, interaction);
    } else if (interaction.isAutocomplete()) {
      HandleAutoComplete(client, interaction);
    }
  },
};

const HandleCommandInteraction = async (
  client: ClientType,
  interaction: ChatInputCommandInteraction
) => {
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    logger.error(`Command ${interaction.commandName} not found!`);
    return false;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    return interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
};

const HandleAutoComplete = async (
  client: ClientType,
  interaction: AutocompleteInteraction
) => {
  const command = client.commands.get(interaction.commandName);
  if (!command?.autoComplete) return;

  try {
    await command.autoComplete(interaction);
  } catch (error) {
    logger.error("Autocomplete Error:", error);
  }
};
