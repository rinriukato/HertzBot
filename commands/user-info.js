const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { emotes } = require('../assets');
const { findUserCreate, isUserOffCooldown, getCooldownTime } = require('../db-utils/user-utils');

const drinks = ["milkis", "teas", "bubble teas", "milks", "coffees", "juices", "colas", "waters"];
const drinkEmotes = [emotes.MILKIS_EMOTE,":tea:",":bubble_tea:", ":milk:", ":coffee:", ":beverage_box:", emotes.COLA_EMOTE ,emotes.WATER_EMOTE];

// ADD SUPPORT TO LOOK UP OTHER USER'S POINTS

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Displays user information')
        .addUserOption((option) => 
            option
                .setName('user')
                .setDescription('The user you want to look up')
            ),

    async execute(interaction) {
        
        const userArg = interaction.options.getUser('user');
        let author;

        if (userArg == null) {
            author = await findUserCreate(interaction.user ,interaction.guild);
        } else {
            author = await findUserCreate(userArg ,interaction.guild);
        }

        if (author == null) {
            await interaction.reply({ content: 'An error has occured! User cannot be found', ephemeral: true });
            return;
        }

        
        const name = author.username;
        //const avatarUrl = author.user.displayAvatarURL();
        const scores = [author.scores.pos_score, author.scores.rinri_pos_score, 
                        author.scores.neg_score,author.scores.rinri_neg_score];

        const drinksHistory = [author.drinks_ordered.milkis, author.drinks_ordered.tea,
                               author.drinks_ordered.bubble_tea, author.drinks_ordered.coffee,
                               author.drinks_ordered.juice, author.drinks_ordered.cola,
                               author.drinks_ordered.water];
        
        const max = Math.max(...drinksHistory);
        const money = author.battle_status.money;
        const index = drinksHistory.indexOf(max);
        const totalScore = (scores[0] + scores[2]);
        const cooldownStatus = isUserOffCooldown(author.battle_status.atk_cd) ? 'Ready to go!' : `Ready in ${getCooldownTime(author.battle_status.atk_cd).toString()} minute(s)`;

        const userEmbed = new MessageEmbed()
            .setColor(0x0099FF)
            .setTitle(`:page_with_curl: ${name}'s User Card`)
            //.setThumbnail(avatarUrl)
            .addFields(
                { name: ':star: Rating:', value: totalScore.toString(), inline:true},
                { name: `${drinkEmotes[index]} Most Ordered Drink`, value: `Ordered ${drinksHistory[index]} ${drinks[index]}`, inline:true},
                { name: `Money`, value: `${money}`, inline:true},
                { name: '\u200B', value: '\u200B', inline:true },
                { name: ':clock1: Cooldown Status', value: cooldownStatus, inline:true },
                { name: 'Element', value: author.battle_status.elem, inline:true },
                { name: 'Total +2 received', value: `+${(scores[0]).toString()}`, inline: true },
                { name: 'Total -2 received', value: `${(scores[2]).toString()}`, inline: true },
            )

        await interaction.reply({ embeds: [userEmbed] });
    },
};
