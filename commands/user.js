const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { emotes } = require('../assets');
const { findUserCreate, isUserOffCooldown, getCooldownTime } = require('../db-utils/user-utils');

const drinks = ["milkis", "teas", "bubble teas", "milks", "coffees", "juices", "colas", "waters"];
const drinkEmotes = [emotes.MILKIS_EMOTE,":tea:",":bubble_tea:", ":milk:", ":coffee:", ":beverage_box:", emotes.COLA_EMOTE ,emotes.WATER_EMOTE];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Displays user information'),
    async execute(interaction) {

        const author = await findUserCreate(interaction.user ,interaction.guild);

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
        const totalScore = (scores[0] + scores[2]) * (scores[1] + scores[3]);

        const cooldownStatus = isUserOffCooldown(author.cooldown) ? 'Ready to go!' : `Ready in ${getCooldownTime(author.cooldown).toString()} minute(s)`;

        const userEmbed = new MessageEmbed()
            .setColor(0x0099FF)
            .setTitle(`:page_with_curl: ${name}'s User Card`)
            .setThumbnail(avatarUrl)
            .addFields(
                { name: ':star: Cumulative Score', value: totalScore.toString(), inline:true},
                { name: `${drinkEmotes[index]} Most Ordered Drink`, value: `Ordered ${drinksHistory[index]} ${drinks[index]}`, inline:true},
                { name: ':clock1: Cooldown Status', value: cooldownStatus, inline:true },
                { name: 'Total +2 received', value: `+${(scores[0]).toString()}`, inline: true },
                { name: 'Total -2 received', value: `-${(scores[2]).toString()}`, inline: true },
            )

        await interaction.reply({ embeds: [userEmbed] });
    },
};
