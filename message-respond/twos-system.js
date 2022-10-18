const { findGuildCreate, updateTwosGiven, } = require('../db-utils/guild-utils');
const { findUserCreate, updateUserScore, updateAuthorCooldown, isUserOffCooldown, getCooldownTime} = require('../db-utils/user-utils');

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

    // Author cannot attack if they are on cooldown
    if (!isUserOffCooldown(author.battle_status.atk_cd)) {
        await message.reply(`On cooldown! ${getCooldownTime(author.battle_status.atk_cd)} minute(s) untill this command is ready!`);
        return;
    }

    // Update user scores and record in the guild entry
    if (message.content === '+2') {
        await updateUserScore(mentionedUser, isPositive=true, isRinri=false);
        await updateAuthorCooldown(author);
        await updateTwosGiven(guild, isPositive=true);

    } else if (message.content === '-2') {
        await updateUserScore(mentionedUser, isPositive=false, isRinri=false);
        await updateAuthorCooldown(author);
        await updateTwosGiven(guild, isPositive=false);
    }

    return;
}

module.exports = {
    twosSystem,
}