const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, BaseCommandInteraction, Message } = require('discord.js');
const { emotes } = require('../assets');
const { findUserCreate } = require('../db-utils/user-utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('drink-history')
	    .setDescription('Displays the user\'s drink order history')
	    .addUserOption((option) => 
            option
                .setName('user')
                .setDescription('The user you want to look up').setRequired(false)
    ),

    async execute(interaction) {

        const userArg = interaction.options.getUser('user');
        let targetUser;

        if (userArg == null) {
            targetUser = await findUserCreate(interaction.user ,interaction.guild);
        } else {
            targetUser = await findUserCreate(userArg ,interaction.guild);
        }

        if (targetUser == null) {
            await interaction.reply({ content: 'An error has occured! User cannot be found', ephemeral: true });
            return;
        }

        const username = targetUser.username;
        const drinksHistory = [
            targetUser.drinks_ordered.milkis, targetUser.drinks_ordered.tea,
            targetUser.drinks_ordered.bubble_tea, targetUser.drinks_ordered.milk,
            targetUser.drinks_ordered.coffee, targetUser.drinks_ordered.juice, 
            targetUser.drinks_ordered.cola, targetUser.drinks_ordered.water,
            targetUser.drinks_ordered.sake,
        ];

        const userEmbed = new Embed()
            .setColor(0xFFFDD0)
            .setTitle(`${username}'s drink history `)
            .addFields(
                {
                    name:`${emotes.MILKIS_EMOTE} Milkis (Milk Soda):`,
                    value:`\`Ordered ${drinksHistory[0]} time(s)\``,
                    inline:false
                },
                {
                    name:`:tea: Tea:`,
                    value:`\`Ordered ${drinksHistory[1]} time(s)\``,
                    inline:false
                },
                {
                    name:`:bubble_tea: Boba Tea:`,
                    value:`\`Ordered ${drinksHistory[2]} time(s)\``,
                    inline:false
                },
                {
                    name:`:milk: Milk:`,
                    value:`\`Ordered ${drinksHistory[3]} time(s)\``,
                    inline:false
                },
                {
                    name:`:coffee: Coffee:`,
                    value:`\`Ordered ${drinksHistory[4]} time(s)\``,
                    inline:false
                },
                {
                    name:`:beverage_box: Juice:`, 
                    value:`\`Ordered ${drinksHistory[5]} time(s)\``,
                    inline:false
                },
                {
                    name:`${emotes.COLA_EMOTE} Cola:`, 
                    value:`\`Ordered ${drinksHistory[6]} time(s)\``,
                    inline:false
                },
                {
                    name:`${emotes.WATER_EMOTE} Water:`, 
                    value:`\`Ordered ${drinksHistory[7]} time(s)\``,
                    inline:false
                },
                {
                    name:`:sake: Sake:`, 
                    value:`\`Ordered ${drinksHistory[7]} time(s)\``,
                    inline:false
                },
            )
        
        await interaction.reply({embeds: [userEmbed]});
        },
};