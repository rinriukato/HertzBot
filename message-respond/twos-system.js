const { findGuildCreate, updateTwosGiven, isCorrectTarget, isBattleActive, 
        setBattleTarget, startWaveBattle, setComboLevel, endWaveBattle, 
        getComboLevel, setTotalDmg, getTotalDmg, getTargetName} = require('../db-utils/guild-utils');

const { findUserCreate, updateUserScore, updateAuthorCooldown, isUserOffCooldown, 
        getCooldownTime} = require('../db-utils/user-utils');

async function twosSystem (message) {
    // Get guild data
    const guild = await findGuildCreate(message.guild);

    // Get author data
    const author = await findUserCreate(message.author, message.guild);

    // Get referenced person data
    const mentionedUser = await findUserCreate(message.mentions.repliedUser, message.guild);
    
    // Get id of replied message
    const referenceMsg = message.reference.messageId;

    // Check if the author can use this command
    if (author.user_id === mentionedUser.user_id) {
        await message.reply(`You can't rate yourself, silly :stuck_out_tongue: `);
        return;
    }

    /*
    // Author cannot attack if they are on cooldown
    if (!isUserOffCooldown(author.battle_status.atk_cd)) {
        await message.reply(`On cooldown! ${getCooldownTime(author.battle_status.atk_cd)} minute(s) untill this command is ready!`);
        return;
    }
    */

    // Check if the referenced member is being attack again
    if (isCorrectTarget(guild, mentionedUser.user_id, referenceMsg)) {
        // Is there a battle going on right now?
        if (!isBattleActive(guild)) {
            // Set reference memeber as target
            await setBattleTarget(guild, mentionedUser, referenceMsg);
            // Activate Battle
            await startWaveBattle(guild);
            console.log("A new target has been set: " + mentionedUser.username);
        } 

        // Increment combo level
        await setComboLevel(guild, reset=false);
        console.log("Incrementing combo level");

    } else {
        // Broken chain, reset
        await message.channel.send(`Chain Broken!${getTargetName(guild)} has recieved ${getTotalDmg(guild)} points!`);
        await endWaveBattle(guild);
        await setComboLevel(guild, reset=true);

        // Set the new user as the new target for the next chain
        await setBattleTarget(guild, mentionedUser, referenceMsg);
        console.log("Chain has been broken. Setting the new target to: " + mentionedUser.username);
        await setTotalDmg(guild, dmg=0, reset=true);

    }

    const bonusMulti = getMultiBonus(getComboLevel(guild));
    console.log('The current bonus is:  ' + String(bonusMulti));

    // Update user scores and record in the guild entry
    if (message.content === '+2') {
        await updateUserScore(mentionedUser, isPositive=true, bonusMulti, isRinri=false);
        await updateAuthorCooldown(author);
        await updateTwosGiven(guild, isPositive=true);
        await setTotalDmg(guild, dmg=(2 * bonusMulti), reset=false);

    } else if (message.content === '-2') {
        await updateUserScore(mentionedUser, isPositive=false, bonusMulti, isRinri=false);
        await updateAuthorCooldown(author);
        await updateTwosGiven(guild, isPositive=false);
        await setTotalDmg(guild, dmg=(-2 * bonusMulti), reset=false);
    }

    return;
}

function getMultiBonus(comboLvl) {
    if (comboLvl >= 12) return 4.0;
    else if (comboLvl >= 10) return 3.5;
    else if (comboLvl >= 8) return 3.0;
    else if (comboLvl >= 6) return 2.5;
    else if (comboLvl >= 4) return 2.0;
    else if (comboLvl >= 2) return 1.5;
    else return 1.0;
}

module.exports = {
    twosSystem,
}