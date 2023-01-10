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
            atk_cd: Date.now(),
            elem: initUserElem(userId, parseInt(discriminator)),
            money_cd: Date.now(),
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
            userEntry.drinks_ordered.cofee = drinkNum;
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

// Initalize the user's starting element based on their userID and discriminator
function initUserElem (userId, discrim) {
    const elems = ["fire", "wood", "elec", "aqua"];
    const seed = Math.floor((userId/discrim)) % 4;
    return elems[seed];
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

// Update the number of times this player has used a card by 1
async function updateCardsUsed(userEntry) {
    let curScore = userEntry.battle_history.cards_used;
    curScore++;
    userEntry.battle_history.cards_used = curScore;
    await userEntry.save();
}

// Update the player's money by amount. Use "isNegative" to deduct that amount from the player's account
async function updatePlayerMoney(userEntry, amount, isNegative) {
    if (isNegative) {
        amount *= -1;
    }

    let balance = userEntry.battle_status.money;
    balance += amount;

    console.log(`${balance} + ${amount} = ${balance + amount}`);

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

// Sets the player's afflicted elem to elemstr. Pass "null" to clear
async function setAfflictedElem(userEntry, elemStr) {
    userEntry.battle_status.afflictedElm = elemStr;
    await userEntry.save();
}

// Set the player's equip to equipment
async function setEquipment(userEntry, equipment) {
    userEntry.battle_status.equip = equipment;
    await userEntry.save();
}

async function setActive(userEntry, isActive) {
    userEntry.battle_status.is_active = isActive;
    await userEntry.save();
}

function isUserActive(userEntry) {
    return userEntry.battle_status.is_active;
}

function getPlayerElem(userEntry) {
    return userEntry.battle_status.elem;
}

function getPlayerAffElem(userEntry) {
    return userEntry.battle_status.afflicted_elem;
}

function getPlayerHealth(userEntry) {
    return userEntry.battle_status.hp;
}

async function setPlayerHealth(userEntry, damage) {

    let userHealth = getPlayerHealth(userEntry);
    console.log(`Dealt ${damage} to ${userEntry.username}`);

    if (userHealth - damage < 0) {
        userHealth = 0;
    }
    else {
        userHealth - damage;
    }
    
    console.log(`${userEntry.username}'s health has dropped to: ${userHealth}`);
    userEntry.battle_status.hp = userHealth;
    await userEntry.save();
}

async function updatePlayerInventory(userEntry, itemName, amount, itemUsed) {
    if (itemUsed) {
        amount *= -1;
    }

    if (itemName === 'fire_dmg') {
        let cards = userEntry.battle_cards.atk_cards.fire_dmg;
        cards += amount;
        userEntry.battle_cards.atk_cards.fire_dmg = cards;
    } else if (itemName === 'elec_dmg') {
        let cards = userEntry.battle_cards.atk_cards.elec_dmg;
        cards += amount;
        userEntry.battle_cards.atk_cards.elec_dmg = cards;
    } else if (itemName === 'aqua_dmg') {
        let cards = userEntry.battle_cards.atk_cards.aqua_dmg;
        cards += amount;
        userEntry.battle_cards.atk_cards.aqua_dmg = cards;
    } else if (itemName === 'wood_dmg') {
        let cards = userEntry.battle_cards.atk_cards.wood_dmg;
        cards += amount;
        userEntry.battle_cards.atk_cards.wood_dmg = cards;
    } else if (itemName === 'swd_dmg') {
        let cards = userEntry.battle_cards.equip_cards.swd_dmg;
        cards += amount;
        userEntry.battle_cards.equip_cards.swd_dmg = cards;
    } else if (itemName === 'gun_dmg') {
        let cards = userEntry.battle_cards.equip_cards.gun_dmg;
        cards += amount;
        userEntry.battle_cards.equip_cards.gun_dmg = cards;
    } else if (itemName === 'barrier') {
        let cards = userEntry.battle_cards.equip_cards.barrier;
        cards += amount;
        userEntry.battle_cards.equip_cards.barrier = cards;
    } else if (itemName === 'fire_swap') {
        let cards = userEntry.battle_cards.swap_cards.fire_swap;
        cards += amount;
        userEntry.battle_cards.swap_cards.fire_swap = cards;
    } else if (itemName === 'elec_swap') {
        let cards = userEntry.battle_cards.swap_cards.elec_swap;
        cards += amount;
        userEntry.battle_cards.swap_cards.elec_swap = cards;
    } else if (itemName === 'aqua_swap') {
        let cards = userEntry.battle_cards.swap_cards.aqua_swap;
        cards += amount;
        userEntry.battle_cards.swap_cards.aqua_swap = cards;
    } else if (itemName === 'wood_swap') {
        let cards = userEntry.battle_cards.swap_cards.wood_swap;
        cards += amount;
        userEntry.battle_cards.swap_cards.wood_swap = cards;
    } else if (itemName === 'sml_hp') {
        let cards = userEntry.battle_cards.support_cards.sml_hp;
        cards += amount;
        userEntry.battle_cards.support_cards.sml_hp = cards;
    } else if (itemName === 'mid_hp') {
        let cards = userEntry.battle_cards.support_cards.mid_hp;
        cards += amount;
        userEntry.battle_cards.support_cards.mid_hp = cards;
    } else if (itemName === 'lrg_hp') {
        let cards = userEntry.battle_cards.support_cards.lrg_hp;
        cards += amount;
        userEntry.battle_cards.support_cards.lrg_hp = cards;
    } else if (itemName === 'refresh') {
        let cards = userEntry.battle_cards.support_cards.refresh;
        cards += amount;
        userEntry.battle_cards.support_cards.refresh = cards;
    } else if (itemName === 'rpd_revive') {
        let cards = userEntry.battle_cards.support_cards.rpd_revive;
        cards += amount;
        userEntry.battle_cards.support_cards.rpd_revive = cards;
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
    updateCardsUsed,
    updatePlayerMoney,
    setAfflictedElem,
    setEquipment,
    setActive,
    isUserActive,
    getPlayerElem,
    getPlayerAffElem,
    getPlayerHealth,
    setPlayerHealth,
    updateMoneyCooldown,
    getMoneyCooldownTime,
    isMoneyOffCooldown,
    getPlayerMoney,
    updatePlayerInventory,
}