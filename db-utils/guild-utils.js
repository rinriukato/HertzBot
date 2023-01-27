const Server = require('../models/serverdata-schema');

// Search for server entry in database:
// Returns server doc if it exists,
// Otherwises creates a new server doc and returns that.
async function findGuildCreate(guild) {
    const guildName = guild.name;
    const guildId = guild.id;
    console.log(guildName);

    const queryGuild = await Server.findOne({guild_id: guildId}).exec();
    if (queryGuild != null) {
        console.log('Server found in database!');
        return queryGuild;
    } 
    
    return await createNewGuildEntry(guildId, guildName);

}

// Creates a new guild entry to the database
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
            guildEntry.server_drink_stats.coffee = drinkNum;
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
        case 8: {
            let drinkNum = guildEntry.server_drink_stats.sake;
            drinkNum += 1;
            guildEntry.server_drink_stats.sake = drinkNum;
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

// Update number of plus two/ minus two given in server by 1
async function updateTwosGiven(guildEntry, isPositive) {
    if (isPositive) {
        let curScore = guildEntry.wave_battle_history.plus_twos_given;
        curScore++;
        guildEntry.wave_battle_history.plus_twos_given = curScore;
    } else  {
        let curScore = guildEntry.wave_battle_history.minus_twos_given;
        curScore++;
        guildEntry.wave_battle_history.minus_twos_given = curScore;
    }
    await guildEntry.save();
}

// Update the servers total wave battle by 1
async function updateTotalBattles(guildEntry) {
    let curScore = guildEntry.wave_battle_history.total_player_wave_battles;
    curScore++;
    guildEntry.wave_battle_history.total_player_wave_battles = curScore;
    await guildEntry.save();
}

// Update the servers player deletions by 1
async function updateServerPlayerDel(guildEntry) {
    let curScore = guildEntry.wave_battle_history.players_del;
    curScore++;
    guildEntry.wave_battle_history.players_del = curScore;
    await guildEntry.save();
}

// Update the servers virus deletions by 1
async function updateServerVirusDel(guildEntry) {
    let curScore = guildEntry.wave_battle_history.virus_del;
    curScore++;
    guildEntry.wave_battle_history.virus_del = curScore;
    await guildEntry.save();
}

function isBattleActive(guildEntry) {
    return guildEntry.wave_battle_status.is_battle_active;
}

async function startWaveBattle(guildEntry) {
    guildEntry.wave_battle_status.is_battle_active = true;
    await guildEntry.save();
}

// End a wave battle, set targets to null for next round
async function endWaveBattle(guildEntry) {
    guildEntry.wave_battle_status.is_battle_active = false;
    guildEntry.wave_battle_status.trg_user_id = null;
    guildEntry.wave_battle_status.trg_user_name = null;
    guildEntry.wave_battle_status.trg_msg_id = null;
    await guildEntry.save();
}

function getComboLevel(guildEntry) {
    return guildEntry.wave_battle_status.combo_lvl;
}

// Increment combo level, if reset is true; set to 0
async function setComboLevel(guildEntry, reset) {
    let level = guildEntry.wave_battle_status.combo_lvl;

    if (reset) {
        level = 0;
    } else {
        level += 1;
    }

    guildEntry.wave_battle_status.combo_lvl = level;
    await guildEntry.save();
}

async function setBattleTarget(guildEntry, target, msgId) {
    guildEntry.wave_battle_status.trg_user_id = target.user_id;
    guildEntry.wave_battle_status.trg_user_name = target.username;
    guildEntry.wave_battle_status.trg_msg_id = msgId;
    await guildEntry.save();
}

function isCorrectTarget(guildEntry, curTargetId, curMsgId) {
    const isCorrectUser = guildEntry.wave_battle_status.trg_user_id == curTargetId;
    const isCorrectMsg = guildEntry.wave_battle_status.trg_msg_id == curMsgId;
    
    return isCorrectUser && isCorrectMsg ? true : false;
}

async function setTotalDmg(guildEntry, dmg, reset) {
    if (!reset) {
        let cur_dmg = guildEntry.wave_battle_status.total_dmg;
        cur_dmg += dmg;
        guildEntry.wave_battle_status.total_dmg = cur_dmg; 
    } else {
        guildEntry.wave_battle_status.total_dmg = 0; 
    }

    await guildEntry.save();
}

function getTotalDmg(guildEntry) {
    return guildEntry.wave_battle_status.total_dmg;
}

function getTargetName(guildEntry) {
    return guildEntry.wave_battle_status.trg_user_name;
}

async function incrementTotalRolls(guildEntry) {
    guildEntry.server_gacha_stats.total_rolls = ++guildEntry.server_gacha_stats.total_rolls;
    await guildEntry.save();
}

function getTotalRolls(guildEntry) {
    return guildEntry.server_gacha_stats.total_rolls;
}

async function setMoneySpent(guildEntry, moneySpent) {
    guildEntry.server_gacha_stats.money_spent = guildEntry.server_gacha_stats.money_spent + moneySpent;
    await guildEntry.save();
}

function getMoneySpent(guildEntry) {
    return guildEntry.server_gacha_stats.money_spent;
}

async function incrementPons(guildEntry, ponType) {
    switch (ponType) {
        case 'Common':
            guildEntry.server_gacha_stats.pons.commons = ++guildEntry.server_gacha_stats.pons.commons;
            break;
        case 'Uncommon':
            guildEntry.server_gacha_stats.pons.uncommons = ++guildEntry.server_gacha_stats.pons.uncommons;
            break;
        case 'Rare':
            guildEntry.server_gacha_stats.pons.rare = ++guildEntry.server_gacha_stats.pons.rare;
            break;
        case 'Super Rare':
            guildEntry.server_gacha_stats.pons.super_rare = ++guildEntry.server_gacha_stats.pons.super_rare;
            break;
        case 'Ultra Rare':
            guildEntry.server_gacha_stats.pons.super_rare = ++guildEntry.server_gacha_stats.pons.ultra_rare;
            break;
        default: 
            console.error(`Unexpected value has been recieved in incrementPons function. ${ponType}`);
    }

    await guildEntry.save();
}

module.exports = {
    findGuildCreate,
    updateGuildDrinks,
    updateTwosGiven,
    updateTotalBattles,
    updateServerPlayerDel,
    updateServerVirusDel,
    endWaveBattle,
    setComboLevel,
    getComboLevel,
    isBattleActive,
    setBattleTarget,
    isCorrectTarget,
    startWaveBattle,
    setTotalDmg,
    getTotalDmg,
    getTargetName,
    incrementTotalRolls,
    getTotalRolls,
    setMoneySpent,
    getMoneySpent,
    incrementPons,
}