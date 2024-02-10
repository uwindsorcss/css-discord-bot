# UWindsor CSS Discord Bot

A multi-purpose Discord bot built for the University of Windsor CS program's Discord server. The bot enhances the server experience with a range of features, including the ability to locate campus buildings, generate LaTeX equations, provide frequently requested links, assign academic year roles to students, assist staff in message management tasks, offer fun community commands, and much more!

## Getting Started

_**Warning**: This bot was designed to work on a Unix-based OS. We strongly recommend installing with docker._


### Bot Config (`config.yaml`)

To get the bot up and running, you need to set the configuration file `config.yaml` which contains settings specific to the bot's functionality.

To set up the `config.yaml` file, you can copy the provided `config.example.yaml` file:

```sh
cp config.example.yaml config.yaml
```

- `debug`: A boolean value indicating whether debugging features are enabled (`true`) or disabled (`false`).
- `image_directory_url`: The base URL for the directory where images are stored.

#### Discord Credentials

- `discord_api_version`: The Discord API version to use.
- `discord_api_token`: The Discord API token to use.
- `discord_client_id`: The Discord client ID to use.
- `discord_guild_id`: The Discord guild ID to use.

#### Google API Credentials

- `google_search_key`: The Google API search key to use.
- `google_search_id`: The Google API search ID to use.

#### Year Roles

- `year_roles`: A mapping of academic years to Discord role IDs. This allows the bot to assign roles based on the year of study. Replace the empty strings with the corresponding role IDs.

#### Pin Reaction Configuration

- `pin`
  - `enabled`: A boolean value indicating whether reaction pinning is enabled (`true`) or disabled (`false`).
  - `count`: The number of reactions required to pin a message.
  - `channels`: The channel IDs where reaction pinning is enabled.

#### Features Configuration

- `features`: A map of bot features, where you can enable (`true`) or disable (`false`) specific features by setting their values accordingly.

## Build and Run with Docker Compose

Docker Compose simplifies the process of setting up the bot by creating and managing containers for both the Node.js application and the accompanying PostgreSQL database. It utilizes the variables from the `.env` file for configuration.

1. **Build or rebuild the service:**    
```sh
docker compose build
```

2. **Create and start containers:** 
```sh
docker compose up
```

### Stopping the Bot

If you would like to halt the bot's operation, you can stop the container with:
```sh
docker compose down
```

## Further Documentation

- [FEATURES.md](docs/FEATURES.md) - a description of the bot's features
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - a high level view of bot architecture
- [CONTRIBUTING.md](docs/CONTRIBUTING.md) - things to keep in mind while contributing

## Contribution

**By contributing to this software in any way, you agree to the terms laid out in [CONTRIBUTING.md](docs/CONTRIBUTING.md)**

A huge thank you to all our contributors, who put lots of time 🕜 and care ❤️ into making this bot what it is.

Feel free to contribute, suggest new features, or report any issues.
