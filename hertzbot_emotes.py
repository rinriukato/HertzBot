import random
import asyncio

# Custom server emotes
TODD_EMOTE = "<:SmilingTODD_EMOTE:324707520272924684>"
MILKIS_EMOTE = "<:MILKIS_EMOTE:712773145559302165>"

# gifs
CHRISTMAS_LIGHTS = "https://cdn.discordapp.com/attachments/294208622865416193/507184582744080384/lights.gif"

# long emote chains
PUMPKIN_STR = ":jack_o_lantern::ghost::jack_o_lantern::ghost:\n:ghost::jack_o_lantern::ghost::jack_o_lantern:\n:jack_o_lantern::ghost::jack_o_lantern::ghost:"
CHRISTMAS_STR = ":CHRISTMAS_STR_tree::CHRISTMAS_STR_tree: :CHRISTMAS_STR_tree: :CHRISTMAS_STR_tree: :CHRISTMAS_STR_tree: **MERRY CHRISTMAS_STR!**:CHRISTMAS_STR_tree: :CHRISTMAS_STR_tree: :CHRISTMAS_STR_tree: :CHRISTMAS_STR_tree::CHRISTMAS_STR_tree:"
RATS_LYRIC_1 = "Rats :rat:, rats :rat:, we are the rats :rat:\nCelebrating yet another birthday bash :partying_face:"
RATS_LYRIC_2 = ", its your birthday :birthday: today :calendar:.\nCake :cake: n' Ice cream :ice_cream: is on its way!:red_car:\nAnd"
RATS_LYRIC_3 = "been such a good boy this year\nOpen up your gifts while we all cheer:raised_hands: :raised_hands: :raised_hands: "

# Words that indicate a request for soda
REQUESTS = ["please", "have", "give me", "give", "one", "can i", "would like", "i want"]
# Simple checks for the rinri points
RINRI_TWOS = ['rinri+2','rinri-2','taking away your +2']

async def roll_thanks(ctx):
  num = random.random() * 100
  print(num)
  if num < 25:
    await ctx.reply(f"You're welcome{TODD_EMOTE}", mention_author=False)
  return

# @<param> {discord.context} ctx: Context of the message
async def send_birthday(ctx):
    async with ctx.channel.typing():
        await asyncio.sleep(1)
        length = len("Hertz, send birthday to ")
        name = ctx.content[length:]
        await ctx.channel.send(f"{RATS_LYRIC_1} **{name}**{RATS_LYRIC_2} **{name}** {RATS_LYRIC_3}\nHappy Birthday **{name}**!")
    return

# @<param> {discord.context} ctx: Context of the message
async def send_christmas(ctx):
    christmas_msg = f"{CHRISTMAS_LIGHTS}\n{CHRISTMAS_STR}\n{CHRISTMAS_LIGHTS}"
    await ctx.channel.send(christmas_msg)
    return

# @<param> {discord.context} ctx: Context of the message
async def send_halloween(ctx):
    await ctx.channel.send(PUMPKIN_STR)

async def send_milkis(ctx):
    async with ctx.channel.typing():
        await asyncio.sleep(1)
        await ctx.reply(f"{MILKIS_EMOTE} :wave: {TODD_EMOTE} Here ya go", mention_author=False)