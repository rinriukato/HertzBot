const User = require('../models/userdata-schema');

// Expected: User object and guild object from discord
// Search for user entry in the database - 
// Returns user doc if it exists, otherwise create a new entry and return that
async function findUserCreate(user, guild) {
    const userId = user.id;
    const userName = user.username;
    const discriminator = user.discriminator;
    const guildId = guild.id;
    const guildName = guild.name;

    const queryUser = await User.findOne({user_id: userId, guild_id: guildId});

    if (queryUser != null) {
        console.log('User found in database!');
        return queryUser;
    }

    return await createNewUserEntry(userId, userName, discriminator, guildId, guildName);
}

// Creates a new entry for the database
async function createNewUserEntry(userId, userName, discriminator, guildId, guildName) {
    const newUserEntry = new User({
        user_id: userId,
        username: userName,
        discriminator: discriminator,
        guild_id: guildId,
        guild_name: guildName,
        battle_status: {
            atk_cd: new Date(0),
            money_cd: new Date(0),
        }
    });

    await newUserEntry.save();
    console.log(`Created new mentioned user ${userId}`);
    return newUserEntry;
}

// Expected: UserDoc from db, flag indicating what entry to be changed
// Updates user scores based on what flags are triggered
async function updateUserScore(userEntry, isPositive, bonusMulti, isRinri) {
    if (isRinri) {
        if (isPositive) {
            let curScore = userEntry.scores.rinri_pos_score;
            curScore += (2 * bonusMulti);
            userEntry.scores.rinri_pos_score = curScore;
            await userEntry.save();
            console.log(`Successfully updated ${userEntry.username}'s score!`); 
            return;
        }

        let curScore = userEntry.scores.rinri_neg_score;
        curScore += (-2 * bonusMulti);
        userEntry.scores.rinri_neg_score = curScore;
        await userEntry.save();
        console.log(`Successfully updated ${userEntry.username}'s score!`);
        return
    }

    if (isPositive) {
        let curScore = userEntry.scores.pos_score;
        curScore += (2 * bonusMulti);
        userEntry.scores.pos_score = curScore;
        await userEntry.save();
        console.log(`Successfully updated ${userEntry.username}'s score!`);
        return;
    }

    let curScore = userEntry.scores.neg_score;
    curScore += (-2 * bonusMulti);
    userEntry.scores.neg_score = curScore;
    await userEntry.save();
    console.log(`Successfully updated ${userEntry.username}'s score!`);
    return
}

// Expected: UserDoc from db, int for what entry to make changes to
async function updateUserDrinks(userEntry, drinkIndex) {
    
    switch(drinkIndex) {
        // milkis
        case 0: {
            let drinkNum = userEntry.drinks_ordered.milkis;
            drinkNum += 1;
            userEntry.drinks_ordered.milkis = drinkNum;
            break;
        }
        // bubble_tea
        case 1: {
            let drinkNum = userEntry.drinks_ordered.bubble_tea;
            drinkNum += 1;
            userEntry.drinks_ordered.bubble_tea = drinkNum;
            break;
        }
        // tea
        case 2: {
            let drinkNum = userEntry.drinks_ordered.tea;
            drinkNum += 1;
            userEntry.drinks_ordered.tea = drinkNum;
            break;
        }
        // milk
        case 3: {
            let drinkNum = userEntry.drinks_ordered.milk;
            drinkNum += 1;
            userEntry.drinks_ordered.milk = drinkNum;
            break;
        }
        // coffee
        case 4: {
            let drinkNum = userEntry.drinks_ordered.coffee;
            drinkNum += 1;
            userEntry.drinks_ordered.coffee = drinkNum;
            break;
        }
        // juice
        case 5: {
            let drinkNum = userEntry.drinks_ordered.juice;
            drinkNum += 1;
            userEntry.drinks_ordered.juice = drinkNum;
            break;
        }
        // cola
        case 6: {
            let drinkNum = userEntry.drinks_ordered.cola;
            drinkNum += 1;
            userEntry.drinks_ordered.cola = drinkNum;
            break;
        }
        // water
        case 7: {
            let drinkNum = userEntry.drinks_ordered.water;
            drinkNum += 1;
            userEntry.drinks_ordered.water = drinkNum;
            break;
        }
        // sake
        case 8: {
            let drinkNum = userEntry.drinks_ordered.sake;
            drinkNum += 1;
            userEntry.drinks_ordered.sake = drinkNum;
            break;
        }
        default: {
            console.error(`An error has occured. Unexpected value when updating user drinks: ${drinkIndex}`);
            return;
        }
    }

    await userEntry.save();
    console.log('Successfully updated user drinks!');
}

// Updates user cooldown to now
async function updateAuthorCooldown(authorEntry) {
    authorEntry.battle_status.atk_cd = Date.now();
    await authorEntry.save();
}

// Check if the user is off cooldown designated by time-elapsed
function isUserOffCooldown(lastUsed) {
    const cooldownThreshold = 10;
    let timeElapsed = Date.now() - lastUsed; // in miliseconds
    timeElapsed = Math.floor(timeElapsed/ 60000); // convert to minutes

    return timeElapsed >= cooldownThreshold ? true : false;
}

// Return string representing how long til cooldown is over
function getCooldownTime(lastUsed) {
    const cooldownThreshold = 10;
    return cooldownThreshold - Math.floor((Date.now() - lastUsed)/ 60000);
}

// Increment player battles initatied by 1
async function updatePlayerBattleInit(userEntry) {
    let curScore = userEntry.battle_history.player_battle_init;
    curScore++;
    userEntry.battle_history.player_battle_init = curScore;
    await userEntry.save();
}

// Increment the number of times this player has been deleted by 1
async function updateSelfDel(userEntry) {
    let curScore = userEntry.battle_history.self_del;
    curScore++;
    userEntry.battle_history.self_del = curScore;
    await userEntry.save();
}

// Update the number of times this player has deleted another player by 1
async function updatePlayerDel(userEntry) {
    let curScore = userEntry.battle_history.players_del;
    curScore++;
    userEntry.battle_history.players_del = curScore;
    await userEntry.save();
}

// Update the number of times this player has deleted a virus by 1
async function updateVirusDel(userEntry) {
    let curScore = userEntry.battle_history.virus_del;
    curScore++;
    userEntry.battle_history.virus_del = curScore;
    await userEntry.save();
}


// Update the player's money by amount. Use "isNegative" to deduct that amount from the player's account
async function updatePlayerMoney(userEntry, amount, isNegative) {
    if (isNegative) {
        amount *= -1;
    }

    let balance = userEntry.battle_status.money;
    balance += amount;

    if (balance < 0) {
        balance = 0;
    }

    userEntry.battle_status.money = balance;
    await userEntry.save();
}

function getPlayerMoney(userEntry) {
    return userEntry.battle_status.money;
}

// Updates user money cooldown to now
async function updateMoneyCooldown(authorEntry) {
    authorEntry.battle_status.money_cd = Date.now();
    await authorEntry.save();
}

// Check if the user is off cooldown designated by time-elapsed
function isMoneyOffCooldown(lastUsed) {
    const cooldownThreshold = 1440;
    let timeElapsed = Date.now() - lastUsed; // in miliseconds
    timeElapsed = Math.floor(timeElapsed/ 60000); // convert to minutes

    return timeElapsed >= cooldownThreshold ? true : false;
}

// Return string representing how long til cooldown is over
function getMoneyCooldownTime(lastUsed) {
    const cooldownThreshold = 24;
    return cooldownThreshold - Math.floor((Date.now() - lastUsed)/ 3.6e+6);
}

async function incrementUserTotalRolls(userEntry) {
    userEntry.gacha_stats.total_rolls = ++userEntry.gacha_stats.total_rolls;
    await userEntry.save();
}

function getUserTotalRolls(userEntry) {
    return userEntry.gacha_stats.total_rolls;
}

async function setUserMoneySpent(userEntry, moneySpent) {
    userEntry.gacha_stats.money_spent += moneySpent;
    await userEntry.save();
}

function getUserMoneySpent(userEntry) {
    return userEntry.gacha_stats.money_spent;
}

async function incrementUserPons(userEntry, ponType) {
    switch (ponType) {
        case 'Common':
            userEntry.gacha_stats.pons.commons = ++userEntry.gacha_stats.pons.commons;
            break;
        case 'Uncommon':
            userEntry.gacha_stats.pons.uncommons = ++userEntry.gacha_stats.pons.uncommons;
            break;
        case 'Rare':
            userEntry.gacha_stats.pons.rare = ++userEntry.gacha_stats.pons.rare;
            break;
        case 'Super Rare':
            userEntry.gacha_stats.pons.super_rare = ++userEntry.gacha_stats.pons.super_rare;
            break;
        case 'Ultra Rare':
            userEntry.gacha_stats.pons.super_rare = ++userEntry.gacha_stats.pons.ultra_rare;
            break;
        default: 
            console.error(`Unexpected value has been recieved in incrementUserPons function. ${ponType}`);
    }

    await userEntry.save();
}

module.exports = {
    findUserCreate, 
    updateUserScore,
    updateUserDrinks,
    updateAuthorCooldown,
    isUserOffCooldown,
    getCooldownTime,
    updatePlayerBattleInit,
    updateSelfDel,
    updatePlayerDel,
    updateVirusDel,
    updatePlayerMoney,
    updateMoneyCooldown,
    getMoneyCooldownTime,
    isMoneyOffCooldown,
    getPlayerMoney,
    incrementUserTotalRolls,
    getUserTotalRolls,
    setUserMoneySpent,
    getUserMoneySpent,
    incrementUserPons,
}