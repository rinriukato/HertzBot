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

async function createNewUserEntry(userId, userName, discriminator ,guildId, guildName) {
    const newUserEntry = new User({
        user_id: userId,
        username: userName,
        discriminator: discriminator,
        guild_id: guildId,
        guild_name: guildName,
    });

    newUserEntry.battle_status.atk_cd = Date.now();

    await newUserEntry.save();
    console.log(`Created new mentioned user ${userId}`);
    return newUserEntry;
}

// Expected: UserDoc from db, flag indicating what entry to be changed
// Updates user scores based on what flags are triggered
async function updateUserScore(userEntry, isPositive, isRinri) {
    if (isRinri) {
        if (isPositive) {
            let curScore = userEntry.scores.rinri_pos_score;
            curScore += 2;
            userEntry.scores.rinri_pos_score = curScore;
            await userEntry.save();
            console.log(`Successfully updated ${userEntry.username}'s score!`); 
            return;
        }

        let curScore = userEntry.scores.rinri_neg_score;
        curScore += -2;
        userEntry.scores.rinri_neg_score = curScore;
        await userEntry.save();
        console.log(`Successfully updated ${userEntry.username}'s score!`);
        return
    }

    if (isPositive) {
        let curScore = userEntry.scores.pos_score;
        curScore += 2;
        userEntry.scores.pos_score = curScore;
        await userEntry.save();
        console.log(`Successfully updated ${userEntry.username}'s score!`);
        return;
    }

    let curScore = userEntry.scores.neg_score;
    curScore += -2;
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

async function updateAuthorCooldown(authorEntry) {
    authorEntry.battle_status.atk_cd = Date.now();
    await authorEntry.save();
}

function isUserOffCooldown(lastUsed) {
    const cooldownThreshold = 10;
    let timeElapsed = Date.now() - lastUsed; // in miliseconds
    timeElapsed = Math.floor(timeElapsed/ 60000); // convert to minutes

    return timeElapsed >= cooldownThreshold ? true : false;
}

function getCooldownTime(lastUsed) {
    const cooldownThreshold = 10;
    return cooldownThreshold - Math.floor((Date.now() - lastUsed)/ 60000);
}

module.exports = {
    findUserCreate, 
    updateUserScore,
    updateUserDrinks,
    updateAuthorCooldown,
    isUserOffCooldown,
    getCooldownTime,
}