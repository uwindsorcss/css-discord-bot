# UWindsor CSS Discord Bot

A multi-purpose Discord bot built for the University of Windsor CS program's Discord server. The bot enhances the server experience with a range of features, including the ability to locate campus buildings, generate LaTeX equations, provide frequently requested links, assign academic year roles to students, assist staff in message management tasks, offer fun community commands, and much more!

## Getting Started

_**Warning**: This bot was designed to work on Unix-based OS. We strongly recommend installing with docker._

To get the bot up and running, you need to set up two configuration files: `.env` and `config.yaml`.

### Environment Config (`.env`)

The `.env` file holds environment-specific variables, including sensitive information needed for both Docker and the bot itself.

To set up the `.env` file, you can copy the provided `.env.example` file:

```sh
cp .env.example .env
```

- `DISCORD_API_VERSION`: The version of the Discord API that the bot will interact with.
- `DISCORD_API_TOKEN`: The bot's Discord API token. This token authenticates the bot with Discord servers.
- `DISCORD_CLIENT_ID`: The bot's unique client ID assigned by Discord.
- `DISCORD_GUILD_ID`: The ID of the Discord guild (server) where your bot will operate. In "development" mode, this must be set.
- `POSTGRES_PASSWORD`: Password for accessing the PostgreSQL database.
- `POSTGRES_USER`: Username for the PostgreSQL database.
- `POSTGRES_DB`: Name of the PostgreSQL database.
- `POSTGRES_HOST`: Hostname of the PostgreSQL server.
- `POSTGRES_PORT`: Port number for connecting to the PostgreSQL server.

### Bot Config (`config.yaml`)

The `config.yaml` file contains settings specific to the bot's functionality.

To set up the `.env` file, you can copy the provided `.env.example` file:

```sh
cp config.example.yaml config.yaml
```

- `mode`: The mode your bot is operating in, e.g., `"development"` or `"production"`.
- `debug`: A boolean value indicating whether debugging features are enabled (`true`) or disabled (`false`).
- `image_directory_url`: The base URL for the directory where images are stored.

Next, there's a section related to assigning roles based on academic years:

- `year_roles`: A mapping of academic years to Discord role IDs. This allows the bot to assign roles based on the year of study. Replace the empty strings with the corresponding role IDs.

Finally, there's a section controlling the bot's features:

- `features`: A map of bot features, where you can enable (`true`) or disable (`false`) specific features by setting their values accordingly.

## Build and Run with Docker Compose


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
docker compose stop
```

## Further Documentation

- [FEATURES.md](docs/FEATURES.md) - a description of the bot's features
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - a high level view of bot architecture
- [CONTRIBUTING.md](docs/CONTRIBUTING.md) - things to keep in mind while contributing

## Contribution

**By contributing to this software in any way, you agree to the terms laid out in [CONTRIBUTING.md](docs/CONTRIBUTING.md)**

A huge thank you to all our contributors, who put lots of time 🕜 and care ❤️ into making this bot what it is.

Feel free to contribute, suggest new features, or report any issues. Happy coding! 🚀📚
