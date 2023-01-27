const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { findGuildCreate } = require('../db-utils/guild-utils');
const { emotes } = require('../assets');
const header = ":blue_square::white_large_square::white_large_square::white_large_square::blue_square:";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Displays server information'),

    async execute(interaction) {
        const guild = await findGuildCreate(interaction.guild);
        const guildName = guild.guild_name;

        const serverEmbed = new MessageEmbed()
            .setColor(0x007FFF)
            .setTitle(`:floppy_disk: [${guildName}] Server Card`)
            .addFields( 
                { 
                    name: `${header}\t\t **[+2][-2] History**\t\t ${header}`, 
                    value: `Total [+2] given out: \`${guild.wave_battle_history.plus_twos_given.toString()}\`\n
                            Total [-2] given out: \`${guild.wave_battle_history.minus_twos_given.toString()}\``
                },
                { 
                    name: `${header} **Server Beverage History** ${header}`,
                    value: ` `,
                },
                { 
                    name: `${emotes.MILKIS_EMOTE} Milkis`,
                    value: `\`${(guild.server_drink_stats.milkis).toString()}\``,
                    inline: true
                },
                { 
                    name: `:tea:Tea`,
                    value: `\`${(guild.server_drink_stats.tea).toString()}\``,
                    inline: true
                },
                { 
                    name: `:bubble_tea:Bubble Tea`,
                    value: `\`${(guild.server_drink_stats.bubble_tea).toString()}\``,
                    inline: true
                },
                { 
                    name: `:milk:Milk`,
                    value: `\`${(guild.server_drink_stats.milk).toString()}\``,
                    inline: true
                },
                { 
                    name: `:coffee:Coffee`,
                    value: `\`${(guild.server_drink_stats.coffee).toString()}\``,
                    inline: true
                },
                { 
                    name: `:beverage_box:Juice`,
                    value: `\`${(guild.server_drink_stats.juice).toString()}\``,
                    inline: true
                },
                { 
                    name: `${emotes.COLA_EMOTE}Cola`,
                    value: `\`${(guild.server_drink_stats.cola).toString()}\``,
                    inline: true
                },
                { 
                    name: `${emotes.WATER_EMOTE}Water`,
                    value: `\`${(guild.server_drink_stats.water).toString()}\``,
                    inline: true
                },
                {
                    name: `:sake:Sake`,
                    value: `\`${(guild.server_drink_stats.sake).toString()}\``, 
                    inline: true
                },
            )
        await interaction.reply({ embeds: [serverEmbed] });
    },
};