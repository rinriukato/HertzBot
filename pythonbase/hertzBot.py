import os
import discord
import time
import datetime
import asyncio
import random
import emote
from keep_alive import keep_alive

complains = ["bad", "sucks", "cringe", "shit", "broken game", "stay losing", "terrible", "fucking sucks","$60", "copyright", "suck"]

requests = ["please", "have", "give me", "give", "one", "can i", "would like", "i want"]

startTime = datetime.datetime.now()
newDay = True

# bot user ID
client = discord.Client()

def chanceThanks():
  num = random.random() * 100
  print(num)
  if num < 25:
    return True

def checkNewDay(currentTime):
  global startTime

  if currentTime.day is not startTime.day:
    startTime = currentTime
    print("new start time")
    return True
  
  return False

def getTimeRemaining():
  print(startTime)
  print(startTime.hour)
  timeLeft = 24 - startTime.hour
  return timeLeft

def processName(args):
  length = len("Hertz, send birthday to ")
  name = args[length:]
  if len(name) > 20:
    name = 'error'
  return name

# bot initialization
@client.event
async def on_ready():
  print('Initialized and ready. {0.user}'.format(client))

# bot senses a message
@client.event
async def on_message(message):
  
  if message.author == client.user:
    return

  msg = message.content

  if message.author.id == rinriOwner:
    if msg.startswith('-2'):
      await message.channel.send(emote.rinriminustwo)

    elif msg.startswith('+2'):
      await message.channel.send(emote.rinriplustwo)

    elif 'taking away' in msg and '+2' in msg:
      await message.channel.send(emote.rinritaketwo)

  if message.author.id != rinriOwner:
    if msg.startswith('+2'):
      await message.channel.send('Based!')
    
    if msg.startswith('-2'):
      await message.channel.send('Cringe :grimacing:')

  if msg.lower().startswith('thank you hertz'):
    await message.reply("No problem :smile:", mention_author=False)

  elif msg.lower().startswith('thank') and chanceThanks():
    await message.reply("You're welcome " + emote.todd, mention_author=False)

  if ':pensive' in msg and chanceThanks():
    await message.reply("Its alright my guy") 
  
  if msg.startswith("TOMORROW IS HALLOWEEN"):
    await message.channel.send(emote.pumpkins)
  
  if msg.lower().startswith("tomorrow is christmas"):
    await message.channel.send(emote.cLights)
    await message.channel.send(emote.christmas)
    await message.channel.send(emote.cLights)

  if any(word in msg.lower() for word in requests) and 'milkis'in msg.lower():
    async with message.channel.typing():
      await asyncio.sleep(1)
    await message.reply(emote.milkis + ":wave:" + emote.todd, mention_author=False)

  if msg.startswith("vita"):
    await message.channel.send("Vita...")
    time.sleep(1)
    await message.channel.send("MEANS LIFE!")
  
  if msg.startswith("Sega Genesis does"):
    await message.channel.send("what Nintendon't")
  
  #if any(word in msg.lower() for word in complains) and 'nintendo' or 'switch' in msg.lower():
    #currentTime = datetime.datetime.now()
    #global newDay
    #newDay = checkNewDay(currentTime)
  #  if newDay: 
   #   await message.channel.send("Daily 'Complain about Nintendo' Quota has been met! Nice job :) ")
  
  if msg.startswith("Hertz show quota time"):
    timeRemaining = getTimeRemaining()
    await message.reply("The quota will refresh in: {0} hours".format(timeRemaining), mention_author=False)
  
  if msg.startswith("Hertz give cake"):
    await message.channel.send(":cake::cake::cake::cake:\n:cake::cake::cake::cake:\n:cake::cake::cake::cake:\n:cake::cake::cake::cake:\n")
  
  if msg.startswith("Hertz, send birthday to"):
    async with message.channel.typing():
      await asyncio.sleep(1)
    name = processName(msg)
    if name == 'error':
      await message.channel.send("That's probably not a real name. That or its really long. :face_with_raised_eyebrow:")
    else:
      await message.channel.send('{} **{}** {} **{}** {}\nHappy Birthday **{}**'.format(emote.lyric1,name,emote.lyrics2, name, emote.lyrics3, name))
    




LOGIN = os.environ['TOKEN']
keep_alive() # run webserver, keeps bot online
client.run(LOGIN)