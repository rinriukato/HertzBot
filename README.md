# Preface
This is HertzBot, a custom discord bot made for my private servers. Does mostly funny things.

** I would appreciate it if you inform me before using. Thank you! **

# Features
Hertz (at its current state) mostly ping pongs replies with its commands.

* You can ask Hertz for a various drinks and Hertz shall provide
* If you say thanks in reply to someone else, Hertz may jump in and steal the credit
* Keeps track of how many drinks you've ask for and records it
* A special user interaction system known as the "Wave Battle".

# Wave Battle System

More or less a reference to this [jerma video](https://www.youtube.com/watch?v=KSp3Q_jvGGs) and its community. But with its own twist inspired from the series: Megaman Battle Network/Star Force

In essence, +2|-2 is a score (and limited to only those two values) given in reponse to how funny (or cool) a person's post was. Say if a person said a funny joke or posted something neat. You, the user, would reply "+2". Likewise if the person said something unfunny. You would reply "-2".

These scores are actively kept track by Hertz in a database. More explicitly, if a user makes a reply to another user with the context: "+2" or "-2". Then the author of that comment will recieve the score.

To prevent the usage of inflating another user's score. There is an internal cooldown for each person to say "+2" or "-2" and actively affect another's score. In this current implementation, that cooldown is set to *1 hour*. This will ideally encourage the more sparse and careful usage of a +2|-2 while making the chain system more likely to be interacted with.

Users can see their scores when inputting the command:
```/user-info```

You can also see the server stats by using the command:
```/server-info```

Use this command to get more help
```help```

## Closing Remarks
The points are ultimately meaningless as they currently have no real value or usage within the box context. Just have fun and mess around with it
