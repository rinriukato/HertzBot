const { SlashCommandBuilder } = require('@discordjs/builders');
const { findGuildCreate } = require('../db-utils/guild-utils');
const { MessageEmbed } = require('discord.js');
const { emotes } = require('../assets');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Displays server information'),
    async execute(interaction) {
        const guild = await findGuildCreate(interaction.guild);
        console.log(interaction.guild);

        const guildName = guild.guild_name;

        const serverEmbed = new MessageEmbed()
            .setColor(0x007FFF)
            .setTitle(`:floppy_disk: [${guildName}] Server Card`)
            .addFields( 
                { name: `---------------- Wave Battle Stats ----------------`, value: '\u200B'},
                { name: '\u200B', value: '\u200B', inline:true },
                { name: `---------------- Beverage History ----------------`, value: '\u200B'},
                { name: `${emotes.MILKIS_EMOTE} Milkis`, value: `${(guild.server_drink_stats.milkis).toString()} `, inline: true},
                { name: `:tea: Tea`, value: `${(guild.server_drink_stats.tea).toString()}`, inline: true},
                { name: `:bubble_tea: Boba Tea`, value: `${(guild.server_drink_stats.bubble_tea).toString()}`, inline: true},

                { name: `:milk: Milk`, value: `${(guild.server_drink_stats.milk).toString()}`, inline: true},
                { name: `:coffee: Coffee`, value: `${(guild.server_drink_stats.coffee).toString()}`, inline: true},
                { name: `:beverage_box: Juice`, value: `${(guild.server_drink_stats.juice).toString()}`, inline: true},

                { name: `${emotes.COLA_EMOTE} Cola`, value: `${(guild.server_drink_stats.cola).toString()}`, inline: true},
                { name: `${emotes.WATER_EMOTE} Water`, value: `${(guild.server_drink_stats.water).toString()}`, inline: true},
                { name: '\u200B', value: '\u200B', inline:true },
            )

        await interaction.reply({ embeds: [serverEmbed] });
    },
};
