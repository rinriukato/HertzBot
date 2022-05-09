# HertzBot

## Preface
This is HertzBot, a custom discord bot made for my private servers. Does mostly funny things.

**PLEASE ASK ME FIRST BEFORE USING**

## Features
Hertz (at its current state) mostly ping pongs replies with its commands.

* You can ask Hertz for a Milkis, and Hertz shall provide
* If you say thanks in reply to someone else, Hertz may jump in and steal the credit
* Hertz will send a neat happy birthday message if you say the following: ```Hertz send birthday to [NAME]```

## +2 | -2 System

More or less a reference to this [jerma video](https://www.youtube.com/watch?v=KSp3Q_jvGGs) and its community. But with its own twist inspired from the series: Xenoblade Chronicles.

In essence, +2|-2 is a score (and limited to only those two values) given in reponse to how funny (or cool) a person's post was. Say if a person said a funny joke or posted something neat. You, the user, would reply "+2". Likewise if the person said something unfunny. You would reply "-2".

These scores are actively kept track by Hertz in a database. More explicitly, if a user makes a reply to another user with the context: "+2" or "-2". Then the author of that comment will recieve the score.

Users can see their scores when inputting the command:
```.userstats```

To prevent the usage of inflating another user's score. There is an internal cooldown for each person to say "+2" or "-2" and actively affect another's score. In this current implementation, that cooldown is set to *1 day*. This will ideally encourage the more sparse and careful usage of a +2|-2 while making the chain system more likely to be interacted with.

### Chain System
Inspired from the chain system in Xenoblade chronicles, where party members go in order and continuously attack an enemy, with each blow dealing a huge amount of damage as the chain continues.

Users will be encourage to save their +2|-2 for multiple users to "chain" another users with either +2 or -2.
During a successful chain attack started by at least 3 users, the following occurs to all participants:
* Each party member's cooldowns will be *reset*, therefore allowing them to attack again
* With each chain level, a multiplier will be applied to every attack. Allowing for the party to deal high damage

Here is a table listing all the chain attack properties at each level
| Chain Level  | Multiplier | Required Members | Chain Attack Expiry |
| ------------- | ------------- | ------------- | ------------- |
| 0  | 1.0x | 100 minutes|3|
| 1  | 1.0x | 10 minutes| 3|
| 2  | 1.5x | 8 minutes| 5 |
| 3  | 2.0x | 5 minutes| 7 |
| 4  | 2.5x | 3 minutes| 9 |
| MAX | 3.0 | 1 minutes| 12|

Chain Level 0 represents the default chain level with no active chains are on-going
Chain Level MAX (or 5) represents the chain level, and signify that the chain will automatically end

Chain can be broken by the following conditions:

**IF THERE IS NO CHAIN ONGOING**
* Users reply +2|-2 to a different message

**IF THERE IS A CHAIN ONGOING**
* Replying +2|-2 to a different user than the target user
* Replying +2|-2 to a different message but the same target user
* Failing to reply +2|-2 within the time range
* Failing to reply in the same channel (Although you current can only reply to messages in the same channel. A bit of future proofing in case discord changes that rule)

## Closing Remarks
The points are ultimately meaningless as they currently have no real value or usage within the box context. Just have fun and mess around with it.

## TASK LIST
- [x] Add database intergration with Hertz
- [x] Develop basis for +2|-2 System
- [ ] Add admin level commands for changing on a server basis the chain attack properties
- [ ] Soda machine embed with data aggregating for fun statistics across multiple servers
