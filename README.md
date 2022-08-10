# Preface
This is HertzBot, a custom discord bot made for my private servers. Does mostly funny things.

**PLEASE ASK ME FIRST BEFORE USING**

# Features
Hertz (at its current state) mostly ping pongs replies with its commands.

* You can ask Hertz for a Milkis, and Hertz shall provide
* If you say thanks in reply to someone else, Hertz may jump in and steal the credit
* Hertz will send a neat happy birthday message if you say the following: ```Hertz send birthday to [NAME]```

# Wave Battle System

More or less a reference to this [jerma video](https://www.youtube.com/watch?v=KSp3Q_jvGGs) and its community. But with its own twist inspired from the series: Megaman Battle Network/Star Force

In essence, +2|-2 is a score (and limited to only those two values) given in reponse to how funny (or cool) a person's post was. Say if a person said a funny joke or posted something neat. You, the user, would reply "+2". Likewise if the person said something unfunny. You would reply "-2".

These scores are actively kept track by Hertz in a database. More explicitly, if a user makes a reply to another user with the context: "+2" or "-2". Then the author of that comment will recieve the score.

To prevent the usage of inflating another user's score. There is an internal cooldown for each person to say "+2" or "-2" and actively affect another's score. In this current implementation, that cooldown is set to *1 hour*. This will ideally encourage the more sparse and careful usage of a +2|-2 while making the chain system more likely to be interacted with.

Users can see their scores when inputting the command:
/user-info

You can also see the server stats by using the command:
/server-info

## System Overhaul
*PURPOSE* - As of 8/9/22, I am remaking the current +2 |-2 System because its too complicated and hard to test. I want to make it closer to megaman battle network and starforce since that's the overall theme of the bot and not xenoblade chronicles

### GENERAL REQUIREMENTS - 

* Some attacking form - For this, i will still use +2 | -2 as the attacking form
* Cooldown System - Users can still only attack every hour or so
* Elemental Wheel - Players must either use their elements or special cards in order to continue a combo
	- Fire -strong against -> Wood -strong against-> Thunder -> -strong against-> Aqua -strong against-> Fire...
	- Players are randomly assigned an element upon creation [Maybe change element every week to mix it up]

### HOW TO START A WAVE BATTLE - 

* Two different users reply +2 or -2 to the same message
* The latest person who replies afflicts a status onto the target user
* A wave battle begins where only the effective elements can continue a combo [Like in battle network in order to chain cards]

### HOW TO END A WAVE BATTLE - 
* If the target message has not recieved any +2 or -2 within a given time limit (Maybe around 10 minutes)
* If the attacker did not use the correct element to continue a combo
* If the target runs out of HP for the day

### HOW TO USE ITEMS - 
* Items are obtained from the Hertz Shop
* Players can buy elemental cards in order to attack with an element they currently do not have
	- USING AN ITEM CARD BESIDES REFRESH WILL CAUSE COOLDOWN TO OCCUR

### HOW TO GET CREDITS - 
* Daily Credit command -> gives x amount of credits
* NPC Wave battle -> Cooldown for using command, basicaly elemental rps.


### General flow of the battle

User A ==[-2]==> User Z
 - No element check
 - User A on Cooldown
 - User Z is now target

User B[Wood] ==[-2]==> User Z
 - Elemental Check
 - User B on Cooldown
 - User Z is still target, 2 attacks occur against User Z
	- Wave Battle Initiate
 	- User Z afflicted with Wood

HERTZ NOTIFICATION:
 | WAVE BATTLE START |
 | TARGET: USER Z    |
 | STATUS: WOOD      |
 | COMBO: 2	     |
 | MULTIPLIER: 1.5   |

User C[Fire] ==[-2]==> User Z[WOOD]
 - Elemental Check
 - User C on Cooldown
 - User Z is still target, 3 attacks occur against User Z
 - Elemental weakness applied, Combo continues
 - Multiplier Level up 1.5x -> 2.0x incoming damage

HERTZ NOTIFICATION: [APPEARS AGAIN IF MULTIPLIER LEVELS UP]
 | WAVE BATTLE START |
 | TARGET: USER Z    |
 | STATUS: WOOD      |
 | COMBO: 2	         |
 | MULTIPLIER: 2.0   |

USER A USES A REFRESH CARD
 - User A cooldown is off, therefore can attack again

USER A[FIRE] ==[-2]==> USER Z [FIRE]
 - Elemental Check [FAIL]
 - User A on cooldown
 - User Z is still target, 4 attacks occur against User Z
 - Since element was not Aqua, the combo ends and therefore the wave battle

HERTZ NOTIFICATION: [APPEARS AGAIN IF MULTIPLIER LEVELS UP]
 | WAVE BATTLE END     |
 | TARGET: USER Z      |
 | COMBO: 4	       |
 | INFLICTED DAMAGE:10 |


## Closing Remarks
The points are ultimately meaningless as they currently have no real value or usage within the box context. Just have fun and mess around with it.

## TASK LIST
- [x] Add database intergration with Hertz
- [x] Develop basis for +2|-2 System
- [x] Thanks roll
- [x] Remake Milkis functionality
- [x] Remake basic message handling from python
- [ ] Have a "quote" storage featuring database adding, and message searching
- [X] Basic game interaction: RPS and the like for added points
- [X] Soda Machine / Shop Options
- [X] Create a cooldown mechanism when requesting drinks, to prevent spam and overrunning database writing
- [X] Funny +2 / -2 Rating system
- [ ] Admin controls such as enabling the system on the server
- [ ] User opting in or out to the twos system