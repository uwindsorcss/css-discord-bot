import {CommandType} from "../types";
import {logger} from "../logger";
import {SlashCommandBuilder} from "@discordjs/builders";

const purgeModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("print hello"),
  execute: async () => {
    logger.info("hello");
  },
};

export default purgeModule;
