const mongoose = require('mongoose');
const { mongoUrl } = require('../config.json');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        try {
            await mongoose.connect(mongoUrl, {
                keepAlive: true
            }) 
        } catch (err) {
            console.log(err);
        }

        client.user
            .setActivity('FFXIV - the award winning MMORPG, free up to level 70 with the critically acclaimed Stormblood expansion',
            {
                type: ActivityType.Streaming
            });

        console.log(`Intialized and ready! ${client.user.tag} is on the air!`);
    },
};