# UWindsor CSS Discord Bot

## **THIS IS A WORK IN PROGRESS**

**By contributing to this software in any way, you agree to the terms laid out in CONTRIBUTING.md**

_Warning: This bot was designed to work on Unix-based OS'._
_Your milage may vary and it may be a nightmare to install without Docker on Windows._

## Setting Up the Configuration

Copy the `config.example.yaml` file to `config.yaml`. You can do this with `cp config.example.conf config.conf`.

Once you've copied your config, you'll need to configure it to work with the Discord API.

### Configuring the Bot

##### Connecting with the Discord API

- `api_token`: the token for your Bot User from the Bot section of the Discord Developer Portal.
- `api_client_id`: the Client ID from the Application page of the Discord Developer Portal.
- `bot_user_id`: the "permission integer", usually 8 (administrator).
- `debug`: when true, extra messages will be logged in the terminal to aid debugging.
- `development_guild_id`: the ID of the server you want the bot to register commands in while developing. This allows faster iteration as commands can take up to an hour to register globally.

##### Customizing the Commands

- `prompt.channel`: The ID of the channel to send prompts to
- `prompt.top_text`: a prefix to put on all prompts
- `prompt.bottom_text`: a postfix to put on all prompts
- `features`: a map of commands to enable

## Dependencies

### Runtime Dependencies

- Docker

### Developer Dependencies

- prettier latest version
- yarn latest version
- node.js v16.13.1

## Build and Run with Docker

1. Start a postgres instance: `docker run --name postgres-docker -p 5432:5432 -e POSTGRES_PASSWORD=passwrd -e POSTGRES_USER=root -e POSTGRES_DB=discord_db -d postgres`
This will pull [Postgres image](https://hub.docker.com/_/postgres) from Docker hub and start an instance,
    - `postgres-docker` is the name of the container, 
    - `-p 5432:5432` the first `5432` is the exposed port, the second `5432` is the internal port which the app is running on. 
    - `-e POSTGRES_PASSWORD=passwrd` is the environment variable that sets username to the Postgres database.
    - `-e POSTGRES_PASSWORD=root` is the environment variable that sets the password of the Postgres database.
    - `-e POSTGRES_DB=discord_db` is the environment variable that sets the name to the database in Postgres
* If you change any of these variables, you will need to change them in `docker-compose.yml` as well.
2. Build or rebuild the service: `docker compose build`
3. Create and start containers: `docker compose up`

### Stopping a Detached Bot

You can then stop the bot with `docker compose stop`.

## Further Documentation

- API and version: `discord.js v13.3.1`
- [FEATURES.md](FEATURES.md) - a description of the bot's features
- [ARCHITECTURE.md](ARCHITECTURE.md) - a high level view of bot architecture
- [CONTRIBUTING.md](CONTRIBUTING.md) - things to keep in mind while contributing

## Contributors

A huge thank you to all our contributors, who put lots of time 🕜 and care ❤️ into making this bot what it is. In no particular order:

- [Ryan Prairie](https://github.com/prairir)
- [Eric Pickup](https://github.com/EricPickup)
- [Harshdip Deogan](https://github.com/HarshdipD)
- [Thang Tran](https://github.com/phucthang1101)
- [Isaac Kilbourne](https://github.com/kilbouri)
