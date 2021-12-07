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

`api_token`: the token for your Bot User from the Bot section of the Discord Developer Portal.

`api_client_id`: the Client ID from the Application page of the Discord Developer Portal.

`bot_user_id`: the "permission integer", usually 8 (administrator).

`debug`: when true, extra messages will be logged in the terminal to aid debugging.

##### Customizing the Commands

`self_roles_channel`: indicates which channel the "self roles" command should use.

`prompt.channel`: indicates which channel prompts should be sent to.

`prompt.top_text`: the text that should appear before a prompt.

`prompt.bottom_text`: the text that should appear after a prompt.

`urls.image_directory_url`: the URL at which the images used for the "whereis" command are located. **Must be a valid URL for the bot to work correctly.**

`urls.mc_address_url`: (work-in-progress feature) the address for the Minecraft Server the MC-Ping service should use.

`features`: an array of the different features that can be turned on and off with true and false respectively.

`per_user_cooldown`: an array of the different features with cooldowns. When set to true, the feature will enforce cooldowns on a per user basis. When false, the cooldown will be enforced server-wide.

`cooldowns`: an array of the cooldown lengths (in seconds) for features with cooldowns. See `per_user_cooldown` for how cooldowns are enforced.

## Dependencies

### Runtime Dependencies

- Docker

### Developer Dependencies

- prettier latest version
- yarn latest version
- node.js v16.13.1

## Build

```sh
docker build -t CssBot .
```

## Run

You can choose to run the bot detached (in the background) or not.

**Detached**: `docker run -d CssBot`

**Not Detached**: `docker run CssBot`

### Stopping a Detached Bot

You need the container ID, which can be found with `docker ps`, under the first column.

You can then stop the bot with `docker stop <container id>`.

## Further Documentation

- API and version: `discord.js v13.3.1`

- ARCHITECTURE.md - a high level view of bot architecture

- CONTRIBUTING.md - things to keep in mind while contributing
