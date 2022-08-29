const { SlashCommandBuilder } = require('@discordjs/builders');
const { findUserCreate, isMoneyOffCooldown, updateMoneyCooldown, getMoneyCooldownTime, updatePlayerMoney } = require('../db-utils/user-utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
	    .setDescription('Use to claim 100 credits every 24hr period'),

    async execute(interaction) {
        const author = await findUserCreate(interaction.user ,interaction.guild);

        // Cannot use command if money command is on cooldown
        if (!isMoneyOffCooldown(author.battle_status.money_cd)) {
            await interaction.reply({
                                    content: `On cooldown! ${getMoneyCooldownTime(author.battle_status.money_cd)} hours(s) untill this command is ready!`, 
                                    ephemeral: true
                                });
            return;
        }
        
        await updateMoneyCooldown(author);
        await updatePlayerMoney(author, amount=100, isNegative=false);
        await interaction.reply({
            content: `Success! Money has been sent and recieved!`, 
            ephemeral: true
        });
    },
};