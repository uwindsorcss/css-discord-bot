import {promises as fs} from "fs";
import path from "path";
import {ClientType} from "@/types";
import {logger} from "@/config";

export default async (client: ClientType) => {
  logger.debug("Loading events...");

  // all event files except index.ts
  const eventFiles: string[] = (await fs.readdir(__dirname))
    .filter((file: string) => file.endsWith(".ts") || file.endsWith(".js"))
    .filter((file: string) => file !== "index.ts" && file !== "index.js");

  // event loader
  for (const file of eventFiles) {
    logger.debug(`Loading event: ${file}`);
    const filePath = path.join(__dirname, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }
};
