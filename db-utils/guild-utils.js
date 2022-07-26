const Server = require('../models/serverdata-schema');

// Search for server entry in database:
// Returns server doc if it exists,
// Otherwises creates a new server doc and returns that.
async function findGuildCreate(guild) {
    const guildName = guild.name;
    const guildId = guild.id;

    const queryGuild = await Server.findOne({server_id: guildId}).exec();
    if (queryGuild != null) {
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

    await newGuildEntry.save();
    console.log(`Created new server ${newGuildEntry.server_id}`);
    return newGuildEntry;
}

// Expected: GuildDoc from db, int for what entry to make changes to
async function updateGuildDrinks(guildEntry, drinkIndex) {
    switch(drinkIndex) {
        // milkis
        case 0: {
            let drinkNum = guildEntry.server_drink_stats.milkis;
            drinkNum += 1;
            guildEntry.server_drink_stats.milkis = drinkNum;
            break;
        }
        // bubble_tea
        case 1: {
            let drinkNum = guildEntry.server_drink_stats.bubble_tea;
            drinkNum += 1;
            guildEntry.server_drink_stats.bubble_tea = drinkNum;
            break;
        }
        // tea
        case 2: {
            let drinkNum = guildEntry.server_drink_stats.tea;
            drinkNum += 1;
            guildEntry.server_drink_stats.tea = drinkNum;
            break;
        }
        // milk
        case 3: {
            let drinkNum = guildEntry.server_drink_stats.milk;
            drinkNum += 1;
            guildEntry.server_drink_stats.milk = drinkNum;
            break;
        }
        // coffee
        case 4: {
            let drinkNum = guildEntry.server_drink_stats.coffee;
            drinkNum += 1;
            guildEntry.server_drink_stats.cofee = drinkNum;
            break;
        }
        // juice
        case 5: {
            let drinkNum = guildEntry.server_drink_stats.juice;
            drinkNum += 1;
            guildEntry.server_drink_stats.juice = drinkNum;
            break;
        }
        // cola
        case 6: {
            let drinkNum = guildEntry.server_drink_stats.cola;
            drinkNum += 1;
            guildEntry.server_drink_stats.cola = drinkNum;
            break;
        }
        // water
        case 7: {
            let drinkNum = guildEntry.server_drink_stats.water;
            drinkNum += 1;
            guildEntry.server_drink_stats.water = drinkNum;
            break;
        }
        default: {
            console.error(`An error has occured. Unexpected value when updating server drink log: ${drinkIndex}`);
            return;
        }
    }

    await guildEntry.save();
    console.log('Successfully updated server drink log!');
}


module.exports = {
    findGuildCreate,
    updateGuildDrinks,
}