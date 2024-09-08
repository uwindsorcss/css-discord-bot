# UWindsor CSS Discord Bot

A multi-purpose Discord bot built for the University of Windsor CS program's Discord server. The bot enhances the server experience with a range of features, including the ability to locate campus buildings, generate LaTeX equations, provide frequently requested links, assign academic year roles to students, assist staff in message management tasks, offer fun community commands, and much more!

## Getting Started

_**Warning**: This bot was designed to work on a Unix-based OS. We strongly recommend installing with docker._


### Bot Config (`config.json`)

To get the bot up and running, you need to create a `config.json` which contains the necessary configuration for the bot to function.

To set up the `config.json` file, you can copy the provided `config.example.json` file:

```sh
cp config.example.json config.json
```

#### Root Configuration

- `environment`
  - **Type**: `development` | `production`
  - **Description**: Specifies the environment in which the application is running.

- `debug`
  - **Type**: `boolean`
  - **Description**: Determines whether the application should run in debug mode. If set to `true`, additional debug information may be logged.

- `seed`
  - **Type**: `boolean`
  - **Description**: Specifies whether the database should be seeded with initial sample data. 

- `image_directory_url`
  - **Type**: `string`
  - **Description**: URL where images related to buildings are hosted.

---

#### Discord Server Configuration
Configuration for Discord API integration.

- `discord.api_version`
  - **Type**: `string`
  - **Description**: Specifies the Discord API version used by the application.

- `discord.api_token`
  - **Type**: `string`
  - **Description**: Token used to authenticate with the Discord API. This field must be populated with a valid token for proper functionality.

- `discord.client_id`
  - **Type**: `string`
  - **Description**: Client ID for the Discord application.

- `discord.guild_id`
  - **Type**: `string`
  - **Description**: Guild ID (Server ID) where the bot will operate.

- `discord.status`
  - **Type**: `string`
  - **Description**: Status message displayed for the bot on Discord.

---

#### Google Search Configuration
Configuration for Google Search API.

- `google.search_key`
  - **Type**: `string`
  - **Description**: API key used to authenticate with the Google Search API.

- `google.search_id`
  - **Type**: `string`
  - **Description**: Search engine ID used in conjunction with the Google Search API.

---

#### Features Configuration

- `features`
  - **Type**: `object`
  - **Description**: A map of bot features, where you can enable (`true`) or disable (`false`) specific features by setting their values accordingly.

---

#### Roles Configuration
Defines roles that can be assigned to users.

- `roles.years`
  - **Type**: `object`
  - **Description**: The role IDs for each academic year.

- `roles.other`
  - **Type**: `object`
  - **Description**: The role IDs for other miscellaneous roles.

---

#### Pin Feature Configuration
Controls pinning behavior in channels.

- `pin.enabled`
  - **Type**: `boolean`
  - **Description**: Determines if the pinning feature is enabled.

- `pin.count`
  - **Type**: `number`
  - **Description**: Specifies how many pin reactions are required to pin a message.

- `pin.general_count`
  - **Type**: `number`
  - **Description**: Specifies how many pin reactions are required to pin a message in the general channel.

- `pin.categories`
  - **Type**: `array of strings`
  - **Description**: List of categories where pinning is enabled.

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
