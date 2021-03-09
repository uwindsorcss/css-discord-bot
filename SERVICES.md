# Commands and Features
## Year
The `year` command enables members to select a role which indicates their current year of study.

**Usage**: `year <1-4>`

## Purge
The `purge` command allows administrators to clear large amounts of messages from a channel all at once. The caller must have administrator permission.

**Usage**: `purge <2-99>`

## Equation
The `equation` command allows members to create images of mathematical equations using LaTeX. Restrictions can be imposed within the `services/latex_service.rb` file, using the `self.sanitize` function. For example, exiting math mode (`$`) causes compilation errors so it is escaped before being passed to the rendering service.

**Usage**: `equation <latex expression>`

## Whereis
The `whereis` command responds with a map of the campus buildings, on which the requested building is highlighted. The command uses fuzzy matching, so typos such as "Eeri Hlal" ("Erie Hall") will still return a map. Passing `list` as the argument will give back the list of valid buildings.

**Usage**: `whereis <list, building_name>`

## Self Roles
The self roles feature automatically forms an "opt-in" role when messages matching the expected format (see below) are sent in a specific channel. The bot reacts with a checkmark which members can click to receive the specified role. Users opt-out by unreacting with the same message.

**Usage**: send a message of the following format within the configured self-roles channel:
```
@role

description
```
The blank line between the role mention and the description is important.

## Say
The `say` command tells the bot to say something in a specified channel. For example, `say #general hello world` will have the bot say "hello world" in #general.

**Usage**: `say #<channel> <message>`

## Prompt
The `prompt` command tells the bot to say something in a pre-configured channel with configured header and footer text.

**Usage**: `prompt <message>`

## Jail/Free
The `jail` and `free` commands are "joke commands" which do nothing but put a jail-like message around the provided text. For example, `jail Someone` will have the bot respond with
```
-------------------
|||   Someone   |||
-------------------
```

**Usage**: `jail <message>` or `free <message>`

## Train
The `train` command simply has the bot send a message containing the `sl` (Steam Locomotive) train.

**Usage**: `train` or `sl`