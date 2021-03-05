# UWindsor CSS Discord Bot

**By contributing to this software in any way, you agree to the terms laid out in CONTRIBUTING.md**

*Warning: This bot was designed to work on Unix-based OS'.*
*Your milage may vary and it may be a nightmare to install without Docker on Windows.*


## Setting Up the Configuration

Copy the `config.example.conf` file to `config.conf`. You can do this with `cp config.example.conf config.conf`.

Once you've copied your config, you'll need to configure it to work with the Discord API.

### Configuring the Bot
##### Connecting with the Discord API
`api_token`: the token for your Bot User from the Bot section of the Discord Developer Portal.

`api_client_id`: the Client ID from the Application page of the Discord Developer Portal.

`bot_user_id`: the "permission integer", usually 8 (administrator).

`debug`: when true, extra messages will be logged in the terminal to aid debugging.


##### Customizing the Commands
`prefix`: the character that should indicate a command is being called.

`self_roles_channel`: indicates which channel the "self roles" command should use.

`prompt.channel`: indicates which channel prompts should be sent to.

`prompt.top_text`: the text that should appear before a prompt.

`prompt.bottom_text`: the text that should appear after a prompt.

`urls.image_directory_url`: the URL at which the images used for the "whereis" command are located. **Must be a valid URL for the bot to work correctly.**

`urls.mc_address_url`: (work-in-progress feature) the address for the Minecraft Server the MC-Ping service should use.

`features`: an array of the different features that can be turned on and off with true and false respectively.


## Setup And Run With Docker (Recommended)
### Dependencies
* Docker

### Build
``` sh
docker build -t CssBot .
```

### Run
You can choose to run the bot detached (in the background) or not.

**Detached**: `docker run -d CssBot`

**Not Detached**: `docker run CssBot`

#### Stopping a Detached Bot

You need the container ID, which can be found with `docker ps`, under the first column.

You can then stop the bot with `docker stop <container id>`.


## Setup And Run Without Docker (Not Recommended)
### Dependencies Before Ruby
* GNU make
* glib-2.0
* gdk-pixbuf-2.0
* xml2
* cairo
* pango
* CMake
* GNU Bison
* Flex
* ImageMagick

All of these dependencies are for the `~equation` command

To install them (on Ubuntu) you can run 
``` sh
sudo apt install -y build-essential cmake make libcairo2-dev libpangox-1.0-dev flex bison libglib2.0-dev libgdk-pixbuf-2.0-dev libxml2-dev imagemagick
```


### Weird Font Issue For `~equation`

A weird font issue can occur in some cases. You can see whether or not you need the following fix by running `~equation \frac{\sqrt{32}}{3}`

You can read more about it at https://github.com/gjtorikian/mathematical/issues/79,
and a solution can be found at https://github.com/gjtorikian/mathematical#fonts-and-special-notices-for-mac-os-x

##### TL;DR Solution:

You need to install some extra fonts. You can do this as follows:
``` sh
cd <your OS font directory>
curl -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmex10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmmi10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmr10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmsy10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/esint10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/eufm10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/msam10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/msbm10.ttf

```

### Dependencies For Ruby
* Ruby version 2.7.0
* Bundle
* Gem
* rbenv (optional but highly reccomended by Ryan Prairie. Seriously, it'll make your life much easier.)

Once you have all the dependencies list above installed and set up, run `bundle install` while in the \<Main\> directory.

## Run
To start the bot, simply run `ruby main.rb`


## Further Documentation

- API and version: `discordrb v3.4.0`

- ARCHITECTURE.md - a high level view of bot architecture

- CONTRIBUTING.md - things to keep in mind while contributing

## Todo

* Featurized config based gem file

* Fully implement mcping
