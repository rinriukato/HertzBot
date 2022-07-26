const mongoose = require('mongoose');
const User = require('../models/userdata-schema');
const Server = require('../models/serverdata-schema');

async function twosSystem (message) {
    // Check if the guild exists in the database
    const queryServer = await Server.findOne({server_id: message.guildId}).exec();

    // Handle new server creation
    if (queryServer == null) {
        await createNewServerEntry(message.guildId, message.guild.name);
    } else {
        console.log('Server found in database!');
        console.log(`SERVER-ID: ${queryServer.server_id}\t SERVER_NAME: ${queryServer.server_name}`);
    }

    // Check if the user exists in the database
    const queryAuthor = await User.findOne({user_id: message.author.id, guild_id: message.guildId}).exec();
    
    console.log(`Querying: USER-ID: ${message.author.id}\t GUILD_ID: ${message.guildId}`);
    // Handle new user creation
    if (queryAuthor == null) {
        await createNewUserEntry(message.author.id, 
                            message.author.username, 
                            message.guildId, 
                            message.guild.name);

    } else {
        console.log('User found in database!');
        console.log(`USER-ID: ${queryAuthor.user_id}\t GUILD_ID: ${queryAuthor.guild_id}`);
    }

    // Check if the person referenced is in the database
    let queryMentionedUser = await User.findOne({user_id: message.mentions.repliedUser.id, guild_id: message.guildId});
    if (queryMentionedUser == null) {
        await createNewUserEntry(message.mentions.repliedUser.id, 
                            message.mentions.repliedUser.username, 
                            message.guildId, 
                            message.guild.name);
    } else {
        console.log('Mentioned User found in database!');
        console.log(`USER-ID: ${queryMentionedUser.user_id}\t GUILD_ID: ${queryMentionedUser.guild_id}`);
    }
    
    // Query again (??? if the user didn't exist yet)
    queryMentionedUser = await User.findOne({user_id: message.mentions.repliedUser.id, guild_id: message.guildId});
    if (message.content === '+2') {
        let curScore = queryMentionedUser.scores.positive_score;
        let prevScore = curScore;
        curScore += 2;
        queryMentionedUser.scores.positive_score = curScore;
        await queryMentionedUser.save();
        console.log(`Successfully updated ${queryMentionedUser.username}'s score! ${queryMentionedUser.scores.positive_score} <- ${prevScore}`);
    }

    if (message.content === '-2') {
        let curScore = queryMentionedUser.scores.negative_score;
        let prevScore = curScore;
        curScore -= 2;
        queryMentionedUser.scores.negative_score = curScore;
        await queryMentionedUser.save();
        console.log(`Successfully updated ${queryMentionedUser.username}'s score! ${queryMentionedUser.scores.negative_score} <- ${prevScore}`);
    }
    
}

async function createNewUserEntry(user_id, username, guildId, guildName) {
    const newUserEntry = new User({
        user_id: user_id,
        username: username,
        guild_id: guildId,
        guild_name: guildName,
        cooldown: Date.now(),
    })

    await newUserEntry.save();
    console.log(`Created new mentioned user ${user_id}`);
}

async function createNewServerEntry(server_id, server_name) {
    const newServerEntry = new Server({
        server_id: server_id,
        server_name: server_name,
    })

    await newServerEntry.save();
    console.log(`Created new server ${newServerEntry.server_id}`);
}

module.exports = {
    twosSystem,
}