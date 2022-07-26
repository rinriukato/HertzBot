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

// Expected: UserDoc from db, flag indicating what entry to be changed
// Updates user scores based on what flags are triggered
async function updateUserScore(userEntry, isPositive, isRinri) {
    if (isRinri) {
        if (isPositive) {
            let curScore = userEntry.scores.rinri_positive_score;
            curScore += 2;
            userEntry.scores.rinri_positive_score = curScore;
            await userEntry.save();
            console.log(`Successfully updated ${userEntry.username}'s score!`); 
            return;
        }

        let curScore = userEntry.scores.rinri_negative_score;
        curScore += -2;
        userEntry.scores.rinri_negative_score = curScore;
        await userEntry.save();
        console.log(`Successfully updated ${userEntry.username}'s score!`);
        return
    }

    if (isPositive) {
        let curScore = userEntry.scores.positive_score;
        curScore += 2;
        userEntry.scores.positive_score = curScore;
        await userEntry.save();
        console.log(`Successfully updated ${userEntry.username}'s score!`);
        return;
    }

    let curScore = userEntry.scores.negative_score;
    curScore += -2;
    userEntry.scores.negative_score = curScore;
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

module.exports = {
    findUserCreate, 
    updateUserScore,
    updateUserDrinks,
}