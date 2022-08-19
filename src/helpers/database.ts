import { connect } from "mongoose";
import { Config } from "../config";
import { logger } from "../logger";

export const connectDatabase = async () => {
    //let database_url = Config?.database_url
    let database_url = "mongodb+srv://discordTest:discordTestPassword@thangtran.ckqo8.mongodb.net/discord_test?retryWrites=true&w=majority"

    if (database_url !== null) {
        await connect(Config!.database_url);
        logger.info("Database Connected!")
    }

}