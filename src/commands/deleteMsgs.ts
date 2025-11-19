import { logger } from "@/config";
import { handleEmbedResponse } from "@/helpers";
import {
    type CacheType,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel,
    User,
    Message,
} from "discord.js";

const TIMEOUT_DEFAULT_HOURS = 24;

function buildSelectMenu(messages: Message[]) {
    return new StringSelectMenuBuilder()
        .setCustomId("selectMessages")
        .setPlaceholder("Select messages to delete")
        .setMaxValues(messages.length)
        .addOptions(
            messages.map((msg, idx) => ({
                label: msg.content?.slice(0, 80) || "[Attachment/Embed]",
                value: msg.id,
                description: `Sent: ${msg.createdAt.toLocaleString()}; Channel: ${(msg.channel as TextChannel).name}`,
            }))
        );
}

function buildButtonRow(buttons: ButtonBuilder[]) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
}

function buildSelectMenuRow(selectMenu: StringSelectMenuBuilder) {
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
}

async function getChannelMessages(channel: TextChannel, limit: number): Promise<Message[]> {
    const fetchedMessages: Message[] = [];
    let lastId: string | undefined;

    while (fetchedMessages.length < limit) {
        const options: { limit: number; before?: string } = {
            limit: Math.min(100, limit - fetchedMessages.length),
        };
        if (lastId) {
            options.before = lastId;
        }

        const messages = await channel.messages.fetch(options);
        if (messages.size === 0) {
            break;
        }

        fetchedMessages.push(...messages.values());
        lastId = messages.last()?.id;
    }

    return fetchedMessages;
};

const createChannelMessagesMap = (messages: Message[]): Map<string, Message[]> => {
    const channelMessagesMap = new Map<string, Message[]>();
    messages.forEach((msg) => {
        const channelId = msg.channel.id;
        if (!channelMessagesMap.has(channelId)) {
            channelMessagesMap.set(channelId, []);
        }
        channelMessagesMap.get(channelId)!.push(msg);
    });
    return channelMessagesMap;
};

const deleteMessagesFromMap = async (map: Map<string, Message[]>, interaction: ChatInputCommandInteraction<CacheType>) => {
    for (const [channelId, msgs] of map.entries()) {
        const ch = interaction.guild?.channels.cache.get(channelId) as TextChannel;
        if (ch) {
            await ch.bulkDelete(msgs.map(item => item.id));
        }
    }
}

const deleteMsgsModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("delete-msgs")
        .setDescription("Select recent messages from a user to delete")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addUserOption((option) =>
            option.setName("user-id").setDescription("User whose messages to delete").setRequired(true)
        )
        .addChannelOption((option) =>
            option.setName("channel-id").setDescription("Channel to scan (optional)").setRequired(false)
        )
        .addIntegerOption((option) =>
            option.setName("limit").setDescription("Max messages to display (up to 25)").setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("range")
                .setDescription("Fetch messages from a certain period")
                .setRequired(false)
                .addChoices(
                    { name: "1 hour", value: "1" },
                    { name: "3 hours", value: "3" },
                    { name: "6 hours", value: "6" },
                    { name: "12 hours", value: "12" },
                    { name: "1S day", value: "24" },
                    { name: "2 days", value: "48" },
                    { name: "1 week", value: "168" }
                )
        ),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        try {
            const memberUser = interaction.options.getUser("user-id", true) as User;
            const userId = memberUser.id;

            let textChannels: TextChannel[] = []

            const channel =
                (interaction.options.getChannel("channel-id") as TextChannel) ||
                (interaction.channel as TextChannel);

            const channelFromOption = interaction.options.getChannel("channel-id");

            if (channelFromOption) {
                textChannels = [channelFromOption as TextChannel];
            } else {
                const channels = await interaction.guild?.channels?.fetch();
                textChannels = channels!.filter((ch) => ch!.isTextBased()).map((ch) => ch as TextChannel);
            }

            if (!textChannels?.length) {
                return await handleEmbedResponse(interaction, true, {
                    message: "Invalid or missing channel.",
                    ephemeral: true,
                });
            }

            const limit = Math.min(interaction.options.getInteger("limit") || 10, 25);
            const hours = parseInt(interaction.options.getString("range") || TIMEOUT_DEFAULT_HOURS.toString());
            const cutoff = Date.now() - hours * 60 * 60 * 1000;

            let messages: Message[] = [];

            for (const ch of textChannels) {
                const msgs = await getChannelMessages(ch, 100);
                messages = messages.concat(msgs);
            }

            let userMessages = messages
                .filter((m) => m.author.id === userId && m.createdTimestamp >= cutoff)
                .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
                .slice(0, limit);

            if (userMessages.length === 0) {
                return await handleEmbedResponse(interaction, true, {
                    message: `No messages from <@${userId}> in the last ${hours} hour(s).`,
                    ephemeral: true,
                });
            }

            const selectRow = buildSelectMenuRow(buildSelectMenu(userMessages));
            const buttonRow = buildButtonRow([
                new ButtonBuilder().setCustomId("selectAll").setLabel("Select All").setStyle(ButtonStyle.Primary)
            ]);

            await interaction.reply({
                content: "Select messages to delete:",
                components: [selectRow, buttonRow],
                ephemeral: true,
            });

            let selectedMessages: typeof userMessages = [];

            const collector = channel.createMessageComponentCollector({
                time: 60000,
                filter: (i) => i.user.id === interaction.user.id,
            });

            collector.on("collect", async (i) => {
                if (i.isButton() && i.customId === "selectAll") {
                    selectedMessages = userMessages;
                    await i.update({
                        content: `You selected **all** messages from <@${userId}>:\n\n` +
                            selectedMessages.map((m, idx) => `**${idx + 1}.** ${m.content?.slice(0, 100) || "[Attachment]"}`).join("\n"),
                        components: [
                            buildButtonRow([
                                new ButtonBuilder().setCustomId("confirmDelete").setLabel("Confirm Delete").setStyle(ButtonStyle.Danger),
                                new ButtonBuilder().setCustomId("cancelDelete").setLabel("Cancel").setStyle(ButtonStyle.Secondary),
                            ]),
                        ],
                    });
                    return;
                }

                if (i.isStringSelectMenu() && i.customId === "selectMessages") {
                    const selectedIds = i.values;
                    selectedMessages = userMessages.filter((m) => selectedIds.includes(m.id));

                    await i.update({
                        content: `You selected **${selectedMessages.length}** message(s) from <@${userId}>:\n\n` +
                            selectedMessages.map((m, idx) => `**${idx + 1}.** ${m.content?.slice(0, 100) || "[Attachment]"}`).join("\n"),
                        components: [
                            buildButtonRow([
                                new ButtonBuilder().setCustomId("confirmDelete").setLabel("Confirm Delete").setStyle(ButtonStyle.Danger),
                                new ButtonBuilder().setCustomId("cancelDelete").setLabel("Cancel").setStyle(ButtonStyle.Secondary),
                            ]),
                        ],
                    });
                    return;
                }

                if (i.isButton() && (i.customId === "confirmDelete" || i.customId === "cancelDelete")) {
                    await i.deferUpdate();
                    if (i.customId === "confirmDelete") {
                        const map = createChannelMessagesMap(selectedMessages);
                        await deleteMessagesFromMap(map, interaction);
                        await i.editReply({ content: `🗑️ Deleted **${selectedMessages.length}** message(s) from <@${userId}>.`, components: [] });
                    } else {
                        await i.editReply({ content: "❌ Deletion cancelled.", components: [] });
                    }
                    collector.stop();
                    return;
                }
            });
        } catch (err) {
            logger.error(`Select messages command failed: ${err}`);
            await handleEmbedResponse(interaction, true, {
                message: "Failed to fetch or delete messages.",
                ephemeral: true,
            });
        }
    },
};

export { deleteMsgsModule as command };
