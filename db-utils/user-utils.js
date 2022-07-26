const User = require('../models/userdata-schema');

// Expected: User object and guild object from discord
// Search for user entry in the database - 
// Returns user doc if it exists, otherwise create a new entry and return that
async function findUserCreate(user, guild) {
    const userId = user.id;
    const userName = user.username;
    const guildId = guild.id;
    const guildName = guild.name;

    const queryUser = await User.findOne({user_id: userId, guild_id: guildId});

    if (queryUser != null) {
        console.log('User found in database!');
        return queryUser;
    }

    return await createNewUserEntry(userId, userName, guildId, guildName);
}

async function createNewUserEntry(userId, userName, guildId, guildName) {
    const newUserEntry = new User({
        user_id: userId,
        username: userName,
        guild_id: guildId,
        guild_name: guildName,
        cooldown: Date.now(),
    })

    await newUserEntry.save();
    console.log(`Created new mentioned user ${user_id}`);
    return newUserEntryl
}

module.exports = {
    findUserCreate,
}