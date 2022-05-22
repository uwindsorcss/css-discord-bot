import {Collection} from "discord.js";

/** Maps a Guild onto a map from name to ID */
const GuildCommandIDs = new Collection<string, Collection<string, string>>();

/** Maps a command name onto its ID */
const GlobalCommandIDs = new Collection<string, string>();

export {GuildCommandIDs, GlobalCommandIDs};
