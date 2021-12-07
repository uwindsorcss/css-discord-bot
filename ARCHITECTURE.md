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

### `example`

<example description>
