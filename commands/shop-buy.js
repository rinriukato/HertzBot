const { SlashCommandBuilder } = require('@discordjs/builders');
const { findUserCreate, getPlayerMoney, updatePlayerMoney, updatePlayerInventory } = require('../db-utils/user-utils');

const atk_cards = ['fire_dmg', 'elec_dmg', 'aqua_dmg', 'wood_dmg'];
const equip_cards = ['swd_dmg', 'gun_dmg', 'barrier'];
const swap_cards = ['fire_swap', 'elec_swap', 'aqua_swap', 'wood_swap'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop-buy')
	    .setDescription('Purchase an item from the store')
	    .addStringOption(option =>
            option.setName('item')
                .setDescription('The item you are trying to buy')
                .setRequired(true)
                .addChoices({ name: 'Fire DMG', value: 'fire_dmg'},
                            { name: 'Elec DMG', value: 'elec_dmg'},
                            { name: 'Aqua DMG', value: 'aqua_dmg'},
                            { name: 'Wood DMG', value: 'wood_dmg'},
                            { name: 'Swd Equip', value: 'swd_dmg'},
                            { name: 'Gun Equip', value: 'gun_dmg'},
                            { name: 'Barrier', value: 'barrier'},
                            { name: 'Fire SWAP', value: 'fire_swap'},
                            { name: 'Elec SWAP', value: 'elec_swap'},
                            { name: 'Aqua SWAP', value: 'aqua_swap'},
                            { name: 'Wood SWAP', value: 'wood_swap'},
                            { name: 'Sml HP', value: 'sml_hp'},
                            { name: 'Med HP', value: 'mid_hp'},
                            { name: 'Lrg HP', value: 'lrg_hp'},
                            { name: 'Refresh', value: 'refresh'},
                            { name: 'Rpd Revive', value: 'rpd_revive'},
                           )
            ),

    async execute(interaction) {
        const author = await findUserCreate(interaction.user, interaction.guild);

        if (author == null) {
            await interaction.reply({
                content: `An error has occurred. User cannot be found and cannot be created. Please notify the dev!`, 
                ephemeral: true
            });
            return;
        }
        const item = interaction.options.getString('item');
        const price = getPrice(item);
        const userMoney = getPlayerMoney(author);
        const quantity = 1;

        // Check if user can purchase this item
        if (userMoney - price < 0) {
            await interaction.reply({
                content: `Sorry, you don't have enough credits to purchase this!`, 
                ephemeral: false
            });
            return;
        }
    
        // User has enough money to buy this item
        await updatePlayerMoney(author, price, isNegative=true);
        await updatePlayerInventory(author, item, quantity, itemUsed=false);
        await interaction.reply(`Here you go! ${quantity} ${item}(s) has been added to your inventory.`);
    },
};

function getPrice(item) {
    if (atk_cards.includes(item)) {
        return 150;
    } else if (equip_cards.includes(item)) {
        return 500;
    } else if (swap_cards.includes(item)) {
        return 1000;
    } else if ('sml_hp' === item) {
        return 300;
    } else if ('mid_hp' === item) {
        return 600;
    } else if ('lrg_hp' === item) {
        return 1200;
    } else if ('refresh' === item) {
        return 1500;
    } else if ('rpd_revive' === item) {
        return 3000;
    }
}