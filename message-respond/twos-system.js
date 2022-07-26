const mongoose = require('mongoose');
const User = require('../models/userdata-schema');
const Server = require('../models/serverdata-schema');
const { findGuildCreate } = require('../db-utils/guild-utils');
const { findUserCreate } = require('../db-utils/user-utils');

async function twosSystem (message) {
    // Get guild data
    const guild = await findGuildCreate(message.guild);

    // Get author data
    const author = await findUserCreate(message.author, message.guild);

    // Get referenced person data
    const mentionedUser = await findUserCreate(repliedUser, message.guild);

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

module.exports = {
    twosSystem,
}