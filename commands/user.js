const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { emotes } = require('../assets');
const { findUserCreate } = require('../db-utils/user-utils');

const drinks = ["milkis", "teas", "bubble teas", "milks", "coffees", "juices", "colas", "waters"];
const drinkEmotes = [emotes.MILKIS_EMOTE,":tea:",":bubble_tea:", ":milk:", ":coffee:", ":beverage_box:", emotes.COLA_EMOTE ,emotes.WATER_EMOTE];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Displays user information'),
    async execute(interaction) {

        //console.log(interaction);
        const author = await findUserCreate(interaction.user, interaction.guild);
        // console.log(author);
        // console.log(`Info stuff: ${author.positive_score}`);

        const name = author.username;
        const avatarUrl = interaction.user.displayAvatarURL();
        const scores = [author.scores.positive_score, author.scores.rinri_positive_score, 
                        author.scores.negative_score,author.scores.rinri_negative_score];

        const drinksHistory = [author.drinks_ordered.milkis, author.drinks_ordered.tea,
                               author.drinks_ordered.bubble_tea, author.drinks_ordered.coffee,
                               author.drinks_ordered.juice, author.drinks_ordered.cola,
                               author.drinks_ordered.water];
        
        const max = Math.max(...drinksHistory);
        const index = drinksHistory.indexOf(max);


        const exampleEmbed = new MessageEmbed()
            .setColor(0x0099FF)
            .setTitle(` Look at this dude ------------------------->`)
            .setAuthor({ name: name, iconURL: avatarUrl})
            .setThumbnail(avatarUrl)
            .addFields(
                { name: ':star: Cumulative Score', value: (scores[0] + scores[2]).toString(), inline:true},
                { name: ':star2: Rinri Rating', value: (scores[1] + scores[3]).toString(), inline:true},
                { name: `${drinkEmotes[index]} Most Ordered Drink`, value: `Ordered ${drinksHistory[index]} ${drinks[index]}`, inline:true},
                { name: '+2 | -2', value: `+${(scores[0]).toString()} | -${(scores[2]).toString()}`, inline: true },
                { name: 'Rinri:tm: +2 | -2', value: `+${(scores[1]).toString()} | -${(scores[3]).toString()}`, inline: true },
                //{ name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter({ text: 'Idk what to put here'});

        await interaction.reply({ embeds: [exampleEmbed] });
    },
};
