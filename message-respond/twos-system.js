const { 
        findGuildCreate, updateTwosGiven, updateTotalBattles,
        updateServerPlayerDel, updateServerVirusDel, updateServerCardsUsed,
        initWaveBattle, endWaveBattle, setComboLevel, startBattleTimer,
        isBattleExpire, getBattleTimeRemaining, getComboLevel,
        isBattleActive, setBattleTarget, isCorrectTarget,
      } = require('../db-utils/guild-utils');
const { 
        findUserCreate, updateUserScore, updateAuthorCooldown, 
        isUserOffCooldown, getCooldownTime, updatePlayerBattleInit,
        updateSelfDel, updatePlayerDel, updateVirusDel, 
        updateCardsUsed, updatePlayerMoney, setAfflictedElem,
        setEquipment, setActive, isUserActive,
        getPlayerAffElem, getPlayerElem, setPlayerHealth, getPlayerHealth,
      } = require('../db-utils/user-utils');
const { consts } = require('../constants');

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

    // If the author is deleted, they cannot attack
    if (!isUserActive(author)) {
        await message.reply(`You've been deleted! You'll revive soon!`);
        return;
    }

    // If the mentioned User is deleted, you cannot attack them
    if (!isUserActive(mentionedUser)) {
        await message.reply(`${mentionedUser.username} has been deleted, you can't target them!`);
        return;
    }

    // Author cannot attack if they are on cooldown
    if (!isUserOffCooldown(author.battle_status.atk_cd)) {
        await message.reply(`On cooldown! ${getCooldownTime(author.battle_status.atk_cd)} minute(s) untill this command is ready!`);
        return;
    }

    const bonus = getBonus(getComboLevel(guild));
    console.log(bonus, "combo level: ",getComboLevel(guild) );
    const battleFlg = isBattleActive(guild);

    // Update user scores and record in the guild entry
    if (message.content === '+2') {
        await updateUserScore(mentionedUser, isPositive=true, isRinri=false, bonus);
        await updateAuthorCooldown(author);
        await setPlayerHealth(mentionedUser, damage=(2 * bonus)); // For now, +2 deal damage to the player as well
        await updateTwosGiven(guild, isPositive=true);

        // See if the mentionedUser was deleted by this attack
        if (isBattleActive && getPlayerHealth(mentionedUser) <= 0) {

            console.log(`${mentionedUser.username} has been deleted by ${author.username}`);
            await setActive(mentionedUser, isActive=false);
            await updatePlayerDel(author); // +1 to author's players deletions
            await updateSelfDel(mentionedUser); // +1 to mentionedUser's deletions
            await updateServerPlayerDel(guild); //+1 to serverPlayer deletions
            await waveBattleEndRoutine(guild); // END THE WAVE BATTLE
            return;
        }

    } else if (message.content === '-2') {
        await updateUserScore(mentionedUser, isPositive=false, isRinri=false, bonus);
        await updateAuthorCooldown(author);
        await setPlayerHealth(mentionedUser, damage=(2 * bonus)); // For now, +2 deal damage to the player as well
        await updateTwosGiven(guild, isPositive=false);

        // See if the mentionedUser was deleted by this attack
        if (isBattleActive && getPlayerHealth(mentionedUser) <= 0) {

            console.log(`${mentionedUser.username} has been deleted by ${author.username}`);

            await setActive(mentionedUser, isActive=false);
            await updatePlayerDel(author); // +1 to author's players deletions
            await updateSelfDel(mentionedUser); // +1 to mentionedUser's deletions
            await updateServerPlayerDel(guild); //+1 to serverPlayer deletions
            await waveBattleEndRoutine(guild); // END THE WAVE BATTLE
            return;
        }
    }

    // If a wave battle is not active
    if (!battleFlg) {
        // Increment combo level since there is no battle on-going

        //check if you are targetting the same message
        await setComboLevel(guild, reset=false);
        const comboLvl = getComboLevel(guild);

        // At combo level 1, set target and incrementation of comboLvl in the guild DB
        if (comboLvl <= 1 ) {
            console.log(`Combo: 1\n Target User: ${mentionedUser.username}\nTarget Message ID: ${referenceMsg}`);
            await setBattleTarget(guild, mentionedUser.user_id, referenceMsg);
            return;
        }

        // At combo level 2, initate a wave battle and update ther guild DB's stats
        if (comboLvl >= 2 && isCorrectTarget(guild, mentionedUser.user_id, referenceMsg)) {
            await initWaveBattle(guild, mentionedUser.user_id, referenceMsg);
            await startBattleTimer(guild);
            await setAfflictedElem(mentionedUser, getPlayerElem(author));
            await updatePlayerBattleInit(author);
            console.log('Wave Battle Starts');
            console.log(`Combo: 2\n Target User: ${mentionedUser.username}\nTarget Message ID: ${referenceMsg}`);
        }
    }
    // There is a battle on-going. Combo Level is at very least greater than 2
    else if (battleFlg) {
        // Check if the battle has not expired yet
        const hasBattleExpired = isBattleExpire(guild.wave_battle_status.battle_timer);

        if (hasBattleExpired) {
            // The battle has expired
            await waveBattleEndRoutine(guild);
            console.log('Wave Battle Ends: Time out');
            return;
        }

        // Did the player hit the correct target?
        if (!isCorrectTarget(guild, mentionedUser.user_id, referenceMsg)) {
            await waveBattleEndRoutine(guild);
            console.log('Wave Battle Ends: Incorrect Target');
            return;
        }

        // First, check if the the current action breaks the combo before incrementing anything
        const authorAtkElem = getPlayerElem(author);
        const targetAffElm = getPlayerAffElem(mentionedUser);
        const isAttackSuccess = isEffectElem(authorAtkElem, targetAffElm);
        console.log(`Author: ${authorAtkElem} -> Target${targetAffElm} == Success?${isAttackSuccess}`);

        // If success, continue combo
        if (isAttackSuccess) {
            await setComboLevel(guild, reset=false);
            const comboLvl = getComboLevel(guild);
            // Set the new afflicated elem of the target
            await setAfflictedElem(mentionedUser, authorAtkElem);
            
            // Notification of mulitpler level up????

        }
        // If failure, end the wave battle loop. Update DB's stats for wave battles
        else {
            console.log('Wave Battle Ends: Incorrect Element');
            await waveBattleEndRoutine(guild);
        }
    }
    
}

// Return true if user has the correct element to continue the combo,
// Return false if the user does not have the correct element and end the wave battle.
function isEffectElem(authorElem, targetElem) {
    
    switch (targetElem) {
        // Aqua is strong against fire
        case "fire": {
            if (authorElem == "aqua")
                return true;
            break;
        }
        // Fire is strong against wood
        case "wood": {
            if (authorElem == "fire")
                return true;
            break;
        }
        // Wood is strong against Elec
        case "elec": {
            if (authorElem == "Wood")
                return true;
            break;
        }
        // Elec is strong against Aqua
        case "fire": {
            if (authorElem == "aqua")
                return true;
            break;
        }
        // Author's element is not strong against the target's element
        default: 
            return false;
    }
}

async function waveBattleEndRoutine(guildEntry) {
    await endWaveBattle(guildEntry);
    await setComboLevel(guildEntry, reset=true);
    await updateTotalBattles(guildEntry);
}

function getBonus(comboLvl) {
    if (comboLvl >= 0 && comboLvl < 3) // 0 - 3
        return 1.0;
    else if (comboLvl >= 3 && comboLvl < 6) // 3 - 6
        return 1.5;
    else if(comboLvl >= 6 && comboLvl < 9) // 6 - 9
        return 2.0;
    else if (comboLvl >= 9 && comboLvl < 15) // 9 - 15
        return 3.0;
    else if (comboLvl >= 15 && comboLvl < 100) // 12 - ???
        return 4.0;
    else {
        console.log('An error has occured in getting combo level');
        return;
    }
}

module.exports = {
    twosSystem,
}