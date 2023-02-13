const { findGuildCreate, updateTwosGiven, isCorrectTarget, isBattleActive, 
        setBattleTarget, startWaveBattle, setComboLevel, endWaveBattle, 
        getComboLevel, setTotalDmg, getTotalDmg, getTargetName
    } = require('../db-utils/guild-utils');

const { findUserCreate, updateUserScore, updateAuthorCooldown, isUserOffCooldown, 
        getCooldownTime
    } = require('../db-utils/user-utils');

const COMBO_TIME_LIMIT = 600; // In seconds

const COMBO_LVL_1 = 1.0;
const COMBO_LVL_2 = 1.5;
const COMBO_LVL_3 = 2.0;
const COMBO_LVL_4 = 2.5;
const COMBO_LVL_5 = 3.0;
const COMBO_LVL_6 = 3.5;
const COMBO_LVL_MAX = 4.0;

const COMBO_RANGE_1 = 2;
const COMBO_RANGE_2 = 4;
const COMBO_RANGE_3 = 6;
const COMBO_RANGE_4 = 8;
const COMBO_RANGE_5 = 10;
const COMBO_RANGE_MAX = 12;

let timeoutID;

async function twosSystem (message) {

    const guild = await findGuildCreate(message.guild);
    const author = await findUserCreate(message.author, message.guild);
    const mentionedUser = await findUserCreate(message.mentions.repliedUser, message.guild);
    const referenceMsg = message.reference.messageId;

    // Check if the author can use this command
    if (author.user_id === mentionedUser.user_id) {
        await message.reply(`You can't rate yourself, silly :stuck_out_tongue: `);
        return;
    }

    // Author cannot attack if they are on cooldown
    if (!isUserOffCooldown(author.battle_status.atk_cd)) {
        await message.reply(`On cooldown! ${getCooldownTime(author.battle_status.atk_cd)} minute(s) until this command is ready!`)
            .then(msg => {setTimeout(() => msg.delete(), 30 * 1000)});
        return;
    }
    
    // Check if the referenced member is being attack again
    if (isCorrectTarget(guild, mentionedUser.user_id, referenceMsg)) {

        if (!isBattleActive(guild)) {
            await setBattleTarget(guild, mentionedUser, referenceMsg);
            await startWaveBattle(guild);
            timeoutID = setTimeout(() => endChainTimeExpire(message), 1000 * COMBO_TIME_LIMIT);
            console.log('Set Timer: ' + timeoutID);
        } 
        await setComboLevel(guild, reset=false);
    
    // Start of server when there is no target set
    } else if (getTargetName === null) {
        await setBattleTarget(guild, mentionedUser, referenceMsg);
        await startWaveBattle(guild);
        console.log("A new target has been set: " + mentionedUser.username);

    // Chain has been broken. Reset battle
    } else {
        const comboLvl = getComboLevel(guild)

        // Display only if there is a damage multiplier to prevent chat spam.
        if (comboLvl >= 2) {
            await message.channel.send(`${comboLvl} Hit Combo!! ${getTargetName(guild)} has received ${getTotalDmg(guild)} points!`);
        }
        
        await endWaveBattle(guild);
        await setComboLevel(guild, reset=true);
        clearTimeout(timeoutID);
        console.log('Successfully cleared ID: ' + timeoutID);

        // Set the new user as the new target for the next chain
        await setBattleTarget(guild, mentionedUser, referenceMsg);
        await setTotalDmg(guild, dmg=0, reset=true);
    }

    const bonusMulti = getMultiBonus(getComboLevel(guild));

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

async function endChainTimeExpire(message) {
    // Fetch updated guild object
    const guild = await findGuildCreate(message.guild);

    await message.channel.send(`Time is up! This chain has been expired! ${getTargetName(guild)} has recieved ${getTotalDmg(guild)} points!`);
    await endWaveBattle(guild);
    await setComboLevel(guild, reset=true);
    await setTotalDmg(guild, dmg=0, reset=true);
    //console.log('Releasing timeoutID: ' + timeoutID);
}


function getMultiBonus(comboLvl) {
    if (comboLvl >= COMBO_RANGE_MAX) return COMBO_LVL_MAX;
    else if (comboLvl >= COMBO_RANGE_5) return COMBO_LVL_6;
    else if (comboLvl >= COMBO_RANGE_4) return COMBO_LVL_5;
    else if (comboLvl >= COMBO_RANGE_3) return COMBO_LVL_4;
    else if (comboLvl >= COMBO_RANGE_2) return COMBO_LVL_3;
    else if (comboLvl >= COMBO_RANGE_1) return COMBO_LVL_2;
    else return COMBO_LVL_1
}

module.exports = {
    twosSystem,
}