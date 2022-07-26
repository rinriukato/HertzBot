const Server = require('../models/serverdata-schema');

// Search for server entry in database:
// Returns server doc if it exists,
// Otherwises creates a new server doc and returns that.
async function findGuildCreate(guild) {
    const guildName = guild.name;
    const guildId = guild.id;

    const queryGuild = await Server.findOne({server_id: guildId}).exec();
    if (queryServer != null) {
        console.log('Server found in database!');
        return queryGuild;
    } 
    
    return await createNewGuildEntry(guildId, guildName);

}

// Creatse a new guild entry to the database
// Defaults according to schema
async function createNewGuildEntry(guildId, guildName) {
    const newGuildEntry = new Server({
        guild_id: guildId,
        guild_name: guildName,
    })

    await newServerEntry.save();
    console.log(`Created new server ${newGuildEntry.server_id}`);
    return newServerEntry;
}


module.exports = {
    findGuildCreate,
}