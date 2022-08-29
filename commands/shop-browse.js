const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// Use reactions to buy items if user has money?

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop-browse')
        .setDescription('Browse the store for items!'),
    async execute(interaction) {


        const shopEmbed = new MessageEmbed()
            .setColor(0x00FF00)
            .setTitle(`STORE`)
            .setDescription('Take a look at the wares!')
            .addFields(
                { name: "```Attack Cards```", value: 'One time use cards that deal elemental damage!' , inline:false},
                { name: `Fire_DMG`, value: "150 Credits",  inline: true},
                { name: `Elec_DMG`, value: "150 Credits",  inline: true},
                { name: `Aqua_DMG`, value: "150 Credits",  inline: true},
                { name: `Wood_DMG`, value: "150 Credits",  inline: true},
                { name: "```Equip Cards```", value: 'Weapon equipment that gives attacks different effects!' , inline:false},
                { name: `Sword`, value: "500 Credits",  inline: true},
                { name: `Gun`, value: "500 Credits",  inline: true},
                { name: `Barrier`, value: "500 Credits",  inline: true},
                { name: "```Swap Cards```", value: 'Swap your current element to something else!' , inline:false},
                { name: `Fire_SWAP`, value: "1000 Credits",  inline: true},
                { name: `Elec_SWAP`, value: "1000 Credits",  inline: true},
                { name: `Aqua_SWAP`, value: "1000 Credits",  inline: true},
                { name: `Wood_SWAP`, value: "1000 Credits",  inline: true},
                { name: "```Support Cards```", value: 'Support cards to assist you in battle!' , inline:false},
                { name: `Sml_HP`, value: "300 Credits",  inline: true},
                { name: `Med_HP`, value: "600 Credits",  inline: true},
                { name: `Lrg_HP`, value: "1200 Credits",  inline: true},
                { name: `Refresh`, value: "1500 Credits",  inline: true},
                { name: `Rapid Revive`, value: "3000 Credits",  inline: true},
            )
        
            await interaction.reply({ embeds: [shopEmbed] });
    },
};