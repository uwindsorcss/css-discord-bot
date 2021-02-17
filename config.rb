require 'hocon'

# Abstracted way to use config
# This lets you use config with all the discord.rb containers
module Config
  # load the config
  CONFIG = Hocon.load("config.conf")

  # config variables
  API_TOKEN = CONFIG["api_token"]
  API_CLIENT_ID = CONFIG["api_client_id"]
  PREFIX = CONFIG["prefix"]
  PROMPT = CONFIG["prompt"]
  IMAGE_DIRECTORY_URL = CONFIG["urls"]["image_directory_url"]
  LATEX_DIRECTORY_RELATIVE_PATH = "tmp"
  BOT_USER_ID = CONFIG["bot_user_id"]
  FEATURES = CONFIG["features"]
  DEBUG = CONFIG["debug"]
  IMPORTANT_ROLES = [
    "Bot",
    "Admin",
    "Moderator",
    "CSS President",
    "CSS Board Executive",
    "CSS Board Head",
    "CSS Board Member",
  ]

end
