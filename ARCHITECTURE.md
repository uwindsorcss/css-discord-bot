# Architecture
**This document describes the high-level architecture of this project**

If you want to familiarize yourself with the code base and *generally* how it works, this is a good place to be.

## High Level TLDR

The bot works on an event loop. At boot up it reads from the config module to decide whether to add each module to the event loop. Each module contains a single "feature" or related collection of "features". When the bot gets an event, it matches it to its appropriate module and then runs the part of the module.

## Code Map

#### Code Map Legend

`<file name>` for a file name

`<folder name>/` for a folder

`<folder name>/<file name>` for a file within a folder

### `main.rb`

This is the central hub of everything that happens. To run the bot, you would run this file. 

It initializes the bot with the proper credentials and actually runs the bot.

### `config.conf`

The configuration file of the bot. We use HOCON as our configuration language because its easy to use, intuitive, and has good support.

Inside the config, we have a `features` table, it keeps the boolean values if a feature is on or not.

### `config.rb`

The configuration module to use the configuration within the bot

We follow the convention of having first level variables for parts of the configuration

For example. If you have the configuration
```
example {
    a = 12
}

example_value = "test"
```

We would make `example` and `example_value` into variables and call them `EXAMPLE` and `EXAMPLE_VALUE`. We could call sub values of `EXAMPLE` by just calling `EXAMPLE` treating it as a hash table or array. 

In this case we would call `EXAMPLE['a']` to get 12.


### `Gemfile` and `Gemfile.lock`

A list of gems(libraries) we use.

### `services/`

This is the place to put any logic that you want abstracted from your "feature". A large amount of this is from before modules existed.

This would be the place to put any reused helper or utility functions.

### `modules/`

This is where to put features of any kind including events and commands. These modules can use anything in `services/` and `main.rb` because they are abstracted and can be reused at any module level.

### `tmp/`

Any temporary files will go here.
