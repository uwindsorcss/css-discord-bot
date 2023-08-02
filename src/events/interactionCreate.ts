import {logger} from "@/config";
import {DeleteLinkByName} from "@/helpers/linkQueries";
import {ClientType} from "@/types";
import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  Events,
  Interaction,
  StringSelectMenuInteraction,
} from "discord.js";

module.exports = {
  name: Events.InteractionCreate,
  async execute(client: ClientType, interaction: Interaction<CacheType>) {
    if (interaction.isChatInputCommand()) {
      HandleCommandInteraction(client, interaction);
    } else if (interaction.isAutocomplete()) {
      HandleAutoComplete(client, interaction);
    } else if (interaction.isStringSelectMenu()) {
      HandleSelectMenu(interaction);
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

const HandleSelectMenu = async (interaction: StringSelectMenuInteraction) => {
  if (interaction.customId === "delete-confirmation" && interaction.values[0]) {
    let answer = interaction.values[0];
    if (answer == "No") {
      await interaction.update({
        content: "Good call, boss! Your link is safe.",
        components: [],
      });
    } else {
      await DeleteLinkByName(answer);
      await interaction.update({
        content: "Deleted! You're welcome :)",
        components: [],
      });
    }
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
