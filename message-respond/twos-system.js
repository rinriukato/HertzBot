const mongoose = require('mongoose');
const User = require('../models/userdata-schema');
const Server = require('../models/serverdata-schema');
const { findGuildCreate } = require('../db-utils/guild-utils');
const { findUserCreate, updateUserScore } = require('../db-utils/user-utils');

async function twosSystem (message) {
    // Get guild data
    const guild = await findGuildCreate(message.guild);

    // Get author data
    const author = await findUserCreate(message.author, message.guild);

    // Get referenced person data
    const mentionedUser = await findUserCreate(message.mentions.repliedUser, message.guild);

    if (author.userId === mentionedUser.userId) {
        await message.reply(`You can't rate yourself, silly :stuck_out_tongue: `);
        return;
    }

    if (message.content === '+2') {
        await updateUserScore(mentionedUser, isPositive=true, isRinri=false);
    }

    if (message.content === '-2') {
        await updateUserScore(mentionedUser, isPositive=false, isRinri=false);
    }
    
}

module.exports = {
    twosSystem,
}