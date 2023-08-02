import {promises as fs} from "fs";
import path from "path";
import {ClientType} from "@/types";

export default async (client: ClientType) => {
  // all event files except index.ts
  const eventFiles: string[] = (await fs.readdir(__dirname))
    .filter((file: string) => file.endsWith(".ts"))
    .filter((file: string) => file !== "index.ts");

  // event loader
  for (const file of eventFiles) {
    const filePath = path.join(__dirname, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }
};
