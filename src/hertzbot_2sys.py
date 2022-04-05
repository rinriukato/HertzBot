import datetime
import discord
from hertzbot_emotes import RINRI_TWOS

# videos
RINRI_PLUS_TWO = "https://cdn.discordapp.com/attachments/294208622865416193/902317240551088208/Rinri_2.mp4"
RINRI_MINUS_TWO = "https://cdn.discordapp.com/attachments/901985900815327312/901986563221757992/-2.mp4"
RINRI_TAKE_TWO = "https://cdn.discordapp.com/attachments/294208622865416193/902317260612464710/Rinri_2_Takeback.mp4"

# Chain Attack Properties 
CHAIN_MULTIPLIER = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0]   # Level 1 -> Level MAX
CHAIN_ATTACK_TIMER = [100,10, 8, 5, 3, 1]               # No timer for first level
CHAIN_ATTACK_THRESHOLD = [2, 2, 5, 7, 9, 12]
CHAIN_MAX = 5
COOLDOWN = 30 # in minutes

# @<param> {datetime.Object} user_time
# @<param> {datetime.Object} cur_time
def check_off_cooldown(user_time, cur_time):
  return False if (user_time > cur_time) else True

# @<param> {datetime.Object} timer_time
# @<param> {datetime.Object} cur_time
def within_timer_range(timer_time, cur_time):
  return True if (timer_time > cur_time) else False

def get_cooldown():
  return datetime.datetime.now() + datetime.timedelta(seconds=COOLDOWN)

# @<param> {str} user_id
# @<param> {str} username
# @<param> {int} plus_score
# @<param> {int} minus_score
# @<param> {int} rinri_plus
# @<param> {int} rinri_minus
def create_new_entry(collection, user_id, username, plus_score, minus_score, rinri_plus, rinri_minus):
  post = {
          "_id":user_id,
          "username":username,
          "plus_score":plus_score,
          "rinri_plus":rinri_plus,
          "minus_score":minus_score,
          "rinri_minus":rinri_minus,
          "when_ready":datetime.datetime.now(),
          "num_chains_joined":0
         }
  collection.insert_one(post)

# @<param> {int} server_id
# @<param> {str} server_name
def create_new_server_entry(server_id, server_name, server_collection):
  post = {
          "_id":server_id,
          "server_name": server_name,
          "is_chain_active":False,                  # Determines branching in chain logic
          "chain_level":0,                          # Level of chain, dictated multipliers and thresholds
          "chain_channel_id":None,                  # Channel where attack is occuring
          "most_attacked_user":None,                # User who is attacked the most??
          "most_recent_message_target":None,        # Message ID that is being targetted in current chain
          "total_chain_attacks":0,                  # Current chain attacks happening in this level
          "chain_timer":datetime.datetime.now(),    # Default Time is now
          "current_party_members":[],               # Empty party at start
          "current_damage_dealt":0,                 # Total damage aggregated in current chain
          "total_server_chains":0,                  # Total chains dealt, regardless of MAX
          "total_server_max_chains":0               # Max chain reached
         }
  server_collection.insert_one(post)

def update_damage_counter(server_collection, server_id, updated_damage):
  server_collection.update_one({"_id":server_id}, {"$set":{"current_damage_dealt":updated_damage}})

# @<param> ----- {Mongo.doc} collection
# @<param> {Discord.context} ctx
# @<param> ----------- {int} target_id
# @<param> ----------- {str} target_name
# @<param> ----------- {int} chain_multi
async def on_plus_two(collection,ctx, target_id, target_name, chain_multi):
  target_query = {"_id":target_id}

  # Author should exist already if being chained
  if (collection.count_documents(target_query) == 0): # new user
    create_new_entry(int(target_id), str(target_name), 2, 0, 0, 0)
    await ctx.channel.send('Confirmed! New user {} is created and score is now 2!'.format(target_name))
    return

  else: # Existing user
    user = collection.find(target_query)
    for field in user:
      plus_score = field["plus_score"]
      minus_score = field["minus_score"]

    plus_score = plus_score + (2 * chain_multi)
    collection.update_one({"_id":target_id}, {"$set":{"plus_score":plus_score}})
    collection.update_one({"_id":ctx.author.id}, {"$set":{"when_ready":get_cooldown()}})
    await ctx.channel.send('Confirmed! User {} score is now: {}'.format(target_name, plus_score + minus_score))
    return

# @<param> ----- {Mongo.doc} collection
# @<param> {Discord.context} ctx
# @<param> ----------- {int} target_name
# @<param> ----------- {str} author_cooldown
async def on_rinri_plus_two(collection, ctx, target_id, target_name):
  target_query = {"_id":target_id}

  # Author should exist already if being chained
  if (collection.count_documents(target_query) == 0): # new user
    create_new_entry(int(target_id), str(target_name), 0, 0, 2, 0)

  else: # Existing user
    user = collection.find(target_query)
    for field in user:
      rinri_plus = field["rinri_plus"]
    collection.update_one({"_id":target_id}, {"$set":{"rinri_plus":rinri_plus + 2}})
  
  video_embed = discord.Embed(title="Certified Rinri +2")
  video_embed.video.url=RINRI_PLUS_TWO

  await ctx.channel.send(embed=video_embed)
  return

# @<param> ----- {Mongo.doc} collection
# @<param> {Discord.context} ctx
# @<param> ----------- {int} target_name
# @<param> ----------- {str} author_cooldown
# @<param> ---------- {bool} take_two
async def on_rinri_minus_two(collection, ctx, target_id, target_name, take_two):
  video_link = RINRI_TAKE_TWO if take_two else RINRI_MINUS_TWO

  video_embed = discord.Embed(title="Certified Rinri -2")
  video_embed.video.url=video_link

  target_query = {"_id":target_id}

  # Author should exist already if being chained
  if (collection.count_documents(target_query) == 0): # new user
    create_new_entry(int(target_id), str(target_name), 0, 0, 0, -2)

  else: # Existing user
    user = collection.find(target_query)
    for field in user:
      rinri_minus = field["rinri_minus"]
    collection.update_one({"_id":target_id}, {"$set":{"rinri_minus":rinri_minus - 2}})
    
    await ctx.channel.send(embed=video_embed)
  return

# @<param> ----- {Mongo.doc} collection
# @<param> {Discord.context} ctx
# @<param> ----------- {int} target_id
# @<param> ----------- {str} target_name
# @<param> ----------- {int} chain_multi
async def on_minus_two(collection,ctx, target_id, target_name, chain_multi):
  target_query = {"_id":target_id}

  if (collection.count_documents(target_query) == 0): # new user
    create_new_entry(int(target_id), str(target_name), 0, -2, 0, 0)
    await ctx.channel.send('Confirmed! New user {} is created and score is now -2!'.format(target_name))
    return

  else: # Existing user
    user = collection.find(target_query)
    for field in user:
      minus_score = field["minus_score"]
      plus_score = field["plus_score"]

    minus_score = minus_score - (2 * chain_multi)
    collection.update_one({"_id":target_id}, {"$set":{"minus_score":minus_score}})
    collection.update_one({"_id":ctx.author.id}, {"$set":{"when_ready":get_cooldown()}})
    await ctx.channel.send('Confirmed! User {} score is now: {}'.format(target_name, plus_score + minus_score))
    return

# @<param> {Discord.context} ctx: Context of the message
# @<param> ----------- {int} server_id: int ID of server from discord
# @<param> ----------- {int} msg_id: int ID of msg from discord
# @<param> ----------- {int} author_id: int ID of author from discord
async def chain_attack_reset(server_collection, ctx, server_id, msg_id, author_id, is_chain_active, total_server_chains):
  most_recent_message_target = msg_id
  chain_channel_id = ctx.channel.id
  total_chain_attacks = 1
  new_party = [author_id]
  if (is_chain_active):
    server_collection.update_one({"_id":server_id},
                                 {"$set":{
                                          "is_chain_active":False,
                                          "most_recent_message_target":most_recent_message_target,
                                          "chain_channel_id":chain_channel_id,
                                          "total_chain_attacks":total_chain_attacks,
                                          "chain_level":0,
                                          "current_party_members": new_party,
                                          "chain_timer":datetime.datetime.now(),
                                          "current_damage_dealt":0,
                                          "total_server_chains": total_server_chains + 1
                                        }
                                  })
  else:
    server_collection.update_one({"_id":server_id},
                                 {"$set":{
                                          "is_chain_active":False,
                                          "most_recent_message_target":most_recent_message_target,
                                          "chain_channel_id":chain_channel_id,
                                          "total_chain_attacks":total_chain_attacks,
                                          "chain_level":0,
                                          "current_party_members": new_party,
                                          "chain_timer":datetime.datetime.now(),
                                          "current_damage_dealt":0,
                                          "total_server_chains": total_server_chains + 1
                                        }
                                  })
  await ctx.channel.send('Chain Reset....')
  return

# @<param> {Discord.context} ctx
# @<param> ----- {Mongo.Doc} collection
async def send_rinri_two(ctx, collection):
  # Find reply target
  msg_id = ctx.reference.message_id
  msg = await ctx.channel.fetch_message(msg_id)
  target_name = msg.author
  target_id = target_name.id
  print('test')
  if ctx.content == RINRI_TWOS[0]: # rinri+2
    await on_rinri_plus_two(collection, ctx, target_id, target_name)
  elif ctx.content == RINRI_TWOS[1]: #rinri-2
    await on_rinri_minus_two(collection, ctx, target_id, target_name, False)
  else: # taking away -2
    await on_rinri_minus_two(collection, ctx, target_id, target_name, True)
  
  return 

# @<param> {Discord.context} ctx
# @<param> ----- {Mongo.Doc} collection
# @<param> ----- {Mongo.Doc} server_collection
async def two_system(ctx, collection, server_collection):
    
    # Does server exist in database?
    server_id = ctx.guild.id
    server_name = ctx.guild.name
    server_query = {"_id":server_id}
    if (server_collection.count_documents(server_query) == 0):
      create_new_server_entry(server_id, server_name, server_collection)
      # await ctx.channel.send('Server successfully created. {} is ready for use!'.format(server_name))

    # Does the author exist in database?
    author_id = ctx.author.id
    author_name = ctx.author
    query = {"_id":author_id}
    if (collection.count_documents(query) == 0):
      create_new_entry(collection, int(author_id), str(author_name), 0, 0, 0, 0)
      # await ctx.channel.send('Hey! New user {} entry has been created!'.format(ctx.author))
    
    # Get author's cooldown
    author = collection.find(query)
    for field in author:
      author_cooldown = field['when_ready']
    
    cur_time = datetime.datetime.now()
    
    # Can the author even attack?
    if not check_off_cooldown(author_cooldown, cur_time):
      await ctx.channel.send('On Cooldown! {} (H-M-S) remaining.'.format(author_cooldown - cur_time))
      return
    
    # Find reply target
    msg_id = ctx.reference.message_id
    msg = await ctx.channel.fetch_message(msg_id)
    target_name = msg.author
    target_id = target_name.id

    # Author is rating themselves
    if (author_id == target_id):
      await ctx.channel.send('You cant rate yourself silly :P')
      return

    is_plus_two = False
    if (ctx.content.startswith('+2')):
      is_plus_two = True

    # Get server's chain status document from database
    server_query = {"_id":server_id}
    this_server = server_collection.find(server_query)
    for field in this_server:
      is_chain_active = field["is_chain_active"]
      chain_channel_id = field["chain_channel_id"]
      most_recent_message_target = field["most_recent_message_target"]
      total_chain_attacks = field["total_chain_attacks"]
      chain_level = field["chain_level"]
      chain_expire_time = field["chain_timer"]
      current_party_ids = field["current_party_members"]
      current_damage_dealt = field["current_damage_dealt"]
      total_server_chains = field["total_server_chains"]
      total_server_max_chains = field["total_server_max_chains"]
    
    # Pre Chain Attack
    if not is_chain_active:
      # Chain on one message
      # Note - This is a bit redundant since you can only reply to messages in the same channel anyways
      #        but this sorta future proofs it if discord decides to allow replies from other channels
      if msg_id == most_recent_message_target and ctx.channel.id == chain_channel_id:
        total_chain_attacks = total_chain_attacks + 1
        current_party_ids.append(author_id)
        server_collection.update_one({"_id":server_id}, {"$set":{"current_party_members":current_party_ids}})
        server_collection.update_one({"_id":server_id},{"$set":{"total_chain_attacks":total_chain_attacks}})
        await ctx.channel.send(f'Chain! {author_name} has attacked!')
      # Reset chain status
      else:
        await chain_attack_reset(server_collection, ctx, server_id, msg_id, author_id, is_chain_active, total_server_chains)
      
      if (is_plus_two): # +2
        await on_plus_two(collection,ctx, target_id, target_name, CHAIN_MULTIPLIER[chain_level])

      else: # -2
        await on_minus_two(collection, ctx, target_id, target_name, CHAIN_MULTIPLIER[chain_level])

    # Post Chain Attack 
    else:

      # Did the chain expire?
      if not within_timer_range(chain_expire_time, datetime.datetime.now()):
        await ctx.channel.send('Chain Failed! We ran out of time...')
        await chain_attack_reset(server_collection, ctx, server_id, msg_id, author_id, is_chain_active,total_server_chains)
        return

      # Is author in party?
      if author_id in current_party_ids:

        # Content +2 and to same user? Note that +2 doesn't need to be checked since we do that earlier. So just check if its the same author
        if most_recent_message_target != msg_id:
          await ctx.channel.send(f'Chain Failed! {author_name} attacked the wrong message...')
          await chain_attack_reset(server_collection, ctx, server_id, msg_id, author_id, is_chain_active, total_server_chains)
          return

        # Same channel? <--- Again technically not needed since you can only reply to messages in the same channel but future proofing
        if chain_channel_id != ctx.channel.id:
          await ctx.channel.send(f'Chain Failed! {author_name} ran from the fight!')
          await chain_attack_reset(server_collection, ctx, server_id, msg_id, author_id, is_chain_active, total_server_chains)
          return
        
        total_chain_attacks = total_chain_attacks + 1
        server_collection.update_one({"_id":server_id},
                                     {"$set":{"total_chain_attacks":total_chain_attacks}})

      else: # User not in party
        # Again the content at this point MUST be +2 | -2 and a reply so don't bother checking for that.
        # We do again, check if the user was the same author, however since you're not in the party it doesn't affect the chain
        if most_recent_message_target != msg_id or chain_channel_id != ctx.channel.id:
          return

        # If all conditions are met, add new user to party and proceeed with normal steps
        total_chain_attacks = total_chain_attacks + 1
        server_collection.update_one({"_id":server_id}, {"$push":{"current_party_members":author_id}})
        server_collection.update_one({"_id":server_id},{"$set":{"total_chain_attacks":total_chain_attacks}})
      
      if (is_plus_two): # +2
        await on_plus_two(collection, ctx, target_id, target_name, CHAIN_MULTIPLIER[chain_level])
        current_damage_dealt = (2 * CHAIN_MULTIPLIER[chain_level]) + current_damage_dealt
        update_damage_counter(server_collection, server_id, current_damage_dealt)

      else: # -2
        await on_minus_two(collection, ctx, target_id, target_name, CHAIN_MULTIPLIER[chain_level])
        current_damage_dealt = (2 * CHAIN_MULTIPLIER[chain_level]) + current_damage_dealt
        update_damage_counter(server_collection, server_id, current_damage_dealt)

    if chain_level != CHAIN_MAX:
      # Chain Attack Advancement
      # Note: Default starts at 0 and increments slowly to 5. Reset back to 0 if broken
      if (total_chain_attacks == CHAIN_ATTACK_THRESHOLD[chain_level]):
        party_member_names = []
        is_chain_active = True
        chain_level = chain_level + 1
        chain_expire_time = CHAIN_ATTACK_TIMER[chain_level]

        # Dereference and reset cooldowns
        for party_member in current_party_ids:
          query = {"_id":party_member}
          author = collection.find(query)
          for field in author:
            name = field["username"]
          party_member_names.append(name)
          collection.update_one({"_id":party_member},{"$set":{"when_ready":datetime.datetime.now()}})
        
        # Set new server chain timer and chain level
        server_collection.update_one({"_id":server_id}, 
                                     {"$set":{
                                              "is_chain_active":is_chain_active,
                                              "chain_level":chain_level,
                                              "total_chain_attacks":0,
                                              "chain_timer":datetime.datetime.now() + datetime.timedelta(minutes=chain_expire_time)
                                             }
                                     })
        chain_msg = f'Chain Attack Start!\nChain Level: {chain_level}\nParty Members {party_member_names} have their cooldowns reset!\nYou have {chain_expire_time} minute(s) till the chain ends!'
        await ctx.channel.send(chain_msg)
        return
    # Chain Finished
    else:
      await ctx.channel.send(f'Chain Attack Finished!\nTotal Damage Dealt:{current_damage_dealt}')
      server_collection.update_one({"_id":server_id},
                                   {"$set":{
                                           "total_server_chains":total_chain_attacks + 1,
                                           "total_server_max_chains": total_server_max_chains + 1
                                          }
                                   })
      for party_member in current_party_ids:
          query = {"_id":party_member}
          author = collection.find(query)
          for field in author:
            num_chains_joined = field["num_chains_joined"]
          collection.update_one({"_id":party_member},{"$set":{"num_chains_joined":num_chains_joined+1}})

      await reset_server_stats(server_collection,ctx)

  ##### -------------  END ------------- #####

async def server_stats(server_collection ,ctx):
  server_id = ctx.guild.id
  server_query = {"_id":server_id}
  this_server = server_collection.find(server_query)
  for field in this_server:
    is_chain_active = field["is_chain_active"]
    chain_channel_id = field["chain_channel_id"]
    most_recent_message_target = field["most_recent_message_target"]
    total_chain_attacks = field["total_chain_attacks"]
    chain_level = field["chain_level"]
    chain_expire_time = field["chain_timer"]
    current_party_ids = field["current_party_members"]
    
  # Might offload this to another script file for organization purposes
  server_stats_embed = discord.Embed(title="Server Stats", description=f"Here are the server stats for {server_id}", color=0x00ff00)
  server_stats_embed.add_field(name="Is the chain active?", value=is_chain_active, inline=True)
  server_stats_embed.add_field(name="Channel ID", value=chain_channel_id, inline=True)
  server_stats_embed.add_field(name="Targetted Message", value=most_recent_message_target, inline=True)
  server_stats_embed.add_field(name="Is the chain active?", value=is_chain_active, inline=True)
  server_stats_embed.add_field(name='Total chain attacks on this server', value=total_chain_attacks,inline=True)
  server_stats_embed.add_field(name="Chain Level", value=chain_level, inline=True)
  server_stats_embed.add_field(name="Chain Expiry Time", value=chain_expire_time, inline=True)
  server_stats_embed.add_field(name="Party Member IDs", value=current_party_ids, inline=True)

  await ctx.channel.send(embed=server_stats_embed)
  return

# Slightly different from "reset_chain_stats" since we don't addz
async def reset_server_stats(server_collection, ctx):
  server_id = ctx.guild.id
  most_recent_message_target = None
  chain_channel_id = None
  total_chain_attacks = 0
  new_party = []
  server_collection.update_one({"_id":server_id},
                                {"$set":{
                                          "is_chain_active":False,
                                          "most_recent_message_target":most_recent_message_target,
                                          "chain_channel_id":chain_channel_id,
                                          "total_chain_attacks":total_chain_attacks,
                                          "chain_level":0,
                                          "current_party_members": new_party,
                                          "chain_timer":datetime.datetime.now(),
                                          "current_damage_dealt":0
                                        }
                                  })
  return

async def show_user_stats(collection, ctx):
  user_id = ctx.author.id
  user_name = ctx.author.name
  user_query = {"_id":user_id}
  this_user = collection.find(user_query)

  for field in this_user:
    plus_score = field["plus_score"]
    minus_score = field["minus_score"]
    rinri_plus = field["rinri_plus"]
    rinri_minus = field["rinri_minus"]
  
  user_profile_embed = discord.Embed(title=f"{user_name}'s stats", color=0x0000FF)
  user_profile_embed.add_field(name="Total +2 recieved: ", value=plus_score, inline=False)
  user_profile_embed.add_field(name="Total rinri+2:tm: recieved: ", value=rinri_plus, inline=False)
  user_profile_embed.add_field(name="Total -2 recieved: ", value=minus_score, inline=False)
  user_profile_embed.add_field(name="Total rinri-2:tm: recieved: ", value=rinri_minus, inline=False)
  user_profile_embed.add_field(name="Overall Funny Score: ", value=(plus_score + (rinri_plus*2) + (minus_score + (rinri_minus*2))), inline=False)
  await ctx.channel.send(embed=user_profile_embed)