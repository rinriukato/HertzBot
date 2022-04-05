import os
import discord
import hertzbot_emotes, hertzbot_2sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Get environment variables
load_dotenv()

# Initialize constants
LOGIN = os.getenv('TOKEN')
DB_PASS = os.getenv('DB_PASSWORD')
CONNECTION_STRING = f"mongodb+srv://rinri_hertzbot:{DB_PASS}@hertzbot.xkk4h.mongodb.net/hertzbot?retryWrites=true&w=majority"
OWNER_ID = int(os.getenv('OWNER_ID'))

# Set bot's user ID
HERTZ_BOT = discord.Client()

# Intializing database
CLUSTER = MongoClient(CONNECTION_STRING)
DATABASE = CLUSTER["hertzbot"]
COLLECTION = DATABASE["hertzbot_userdata"]
SERVER_COLLECTION = DATABASE["hertzbot_serverdata"]

# Bot initialization
@HERTZ_BOT.event
async def on_ready():
  print(f'Initialized and ready. {HERTZ_BOT.user} is on the air!')

# Bot senses a message
@HERTZ_BOT.event
async def on_message(ctx):

  if ctx.author == HERTZ_BOT.user:
    return

  if (ctx.reference is not None) and (ctx.content.startswith('+2') or ctx.content.startswith('-2')):
    await hertzbot_2sys.two_system(ctx, COLLECTION, SERVER_COLLECTION)
    return
  
  if (ctx.reference is not None) and (ctx.author.id == OWNER_ID) and (any(word in ctx.content.lower() for word in hertzbot_emotes.RINRI_TWOS)):
    await hertzbot_2sys.send_rinri_two(ctx, COLLECTION)
    return

  if ctx.content == '.serverstats':
    await hertzbot_2sys.server_stats(SERVER_COLLECTION, ctx)
    return

  if ctx.content == '.resetserverstats':
    await hertzbot_2sys.reset_server_stats(SERVER_COLLECTION, ctx)
    return
  
  if ctx.content == '.userstats':
    await hertzbot_2sys.show_user_stats(COLLECTION, ctx)
    return

  if 'thank' in str(ctx.content.lower()):
    await hertzbot_emotes.roll_thanks(ctx)
    return

  if ctx.content.startswith("Hertz, send birthday to"):
    await hertzbot_emotes.send_birthday(ctx)
    return
  
  if ctx.content.lower().startswith("tomorrow is christmas"):
    await hertzbot_emotes.send_christmas(ctx)
    return
  
  if ctx.content.lower().startswith("tomorrow is halloween"):
    await hertzbot_emotes.send_halloween(ctx)
    return
  
  if any(word in ctx.content.lower() for word in hertzbot_emotes.REQUESTS) and 'milkis'in ctx.content.lower():
    await hertzbot_emotes.send_milkis(ctx)

HERTZ_BOT.run(LOGIN)