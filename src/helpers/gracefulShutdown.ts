import { Client } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/config";
import "shutdown-handler";

export const initializeGracefulShutdown = (
  client: Client,
  prisma: PrismaClient,
  process: NodeJS.Process
) => {
  require("shutdown-handler").on("exit", (e: Event) => {
    e.preventDefault();
    logger.info("Gracefully shutting down...");
    client.destroy();
    prisma.$disconnect();
    process.exit();
  });
};
