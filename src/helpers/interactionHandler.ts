import { AutocompleteInteraction, CommandInteraction, SelectMenuInteraction } from "discord.js"
import { logger } from "../logger"
import { ClientType } from "../types"
import { DeleteLinkById } from "./linkQueries"

const HandleSelectMenu = async (interaction: SelectMenuInteraction) => {
    if (interaction.customId === 'delete-confirmation') {
        let answer = interaction.values[0]
        if (answer == "No") {
            await interaction.update({ content: "Good call, boss! Your link is safe.", components: [] });
        } else {
            await DeleteLinkById(answer)
            await interaction.update({ content: "Deleted! You're welcome :)", components: [] });
        }
    }
}
const HandleAutoComplete = async (client: ClientType, interaction: AutocompleteInteraction) => {
    const command = client.commands.get(interaction.commandName);
    if (!command?.autoComplete) return;

    try {
        await command.autoComplete(interaction);
    } catch (error) {
        logger.debug("Autocomplete Error:", error);
    }
}

const HandleCommandInteraction = async (client: ClientType, interaction: CommandInteraction) => {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        logger.error(error);
        return interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
}

export { HandleSelectMenu, HandleAutoComplete, HandleCommandInteraction }