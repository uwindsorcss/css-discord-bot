# Architecture

**This document describes the high-level architecture of this project**

If you want to familiarize yourself with the code base and _generally_ how it works, this is a good place to be.

## High Level TLDR

The bot works on an event loop. At boot up it reads from the config module to decide whether to add each module to the event loop. Each module contains a single "feature" or related collection of "features". When the bot gets an event, it matches it to its appropriate module and then runs the part of the module.

## Code Map

#### Code Map Legend

`<file name>` for a file name

`<folder name>/` for a folder

`<folder name>/<file name>` for a file within a folder

### `/src/index.ts`

This file is the main entry point for the bot. It defines how the bot starts.

### `/src/commands/`

This directory contains the command features of the bot. During startup, each `.ts` file is loaded as a [`CommandType`](./src/types.ts). Commands are registered with Discord, globally in production, and only within a configured developer guild in development mode.

See [FEATURES.md](FEATURES.md) for a breakdown of what each command does.

### `/src/events/`

This directory contains event features. Unlike a command feature, events do not necessarily need a user to trigger them. Like the `/src/commands/` directory, it is scanned at startup, and each `.ts` file is loaded as an [`EventType`](./src/types.ts). Each event is then registered on the appropriate listener.

### `/src/helpers/`

This directory is for modules that contain frequently used helper functions.

### `/src/config.ts`

This file loads configuration values from `config.yaml` and defines a logger object for application-wide usage.

### `/src/types.ts`

This file contains essential type definitions for the project.
