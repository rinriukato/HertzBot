const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, BaseCommandInteraction } = require('discord.js');
const { emotes } = require('../assets');
const { findUserCreate, isUserOffCooldown, getCooldownTime } = require('../db-utils/user-utils');
const { createAlignment } = require('../command-utils/create-alignment');

const drinks = ["milkis", "teas", "bubble teas", "milks", "coffees", "juices", "colas", "waters"];
const drinkEmotes = [emotes.MILKIS_EMOTE,":tea:",":bubble_tea:", ":milk:", ":coffee:", ":beverage_box:", emotes.COLA_EMOTE ,emotes.WATER_EMOTE, ":sake:"];
const spaces = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Displays the user\'s info card. See stuff like their favorite drink or server rating!')
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
        const scores = [
                        author.scores.pos_score, author.scores.rinri_pos_score, 
                        author.scores.neg_score,author.scores.rinri_neg_score
                    ];

        const drinksHistory = [
                               author.drinks_ordered.milkis, author.drinks_ordered.tea,
                               author.drinks_ordered.bubble_tea, author.drinks_ordered.milk,
                               author.drinks_ordered.coffee, author.drinks_ordered.juice, 
                               author.drinks_ordered.cola, author.drinks_ordered.water,
                               author.drinks_ordered.sake,
                           ];
        
        const max = Math.max(...drinksHistory);
        const money = author.battle_status.money;
        const index = drinksHistory.indexOf(max);
        const totalScore = (scores[0] + scores[2]);
        const cooldownStatus = isUserOffCooldown(author.battle_status.atk_cd) ? '\`Ready to go!\`' : `\`Ready in ${getCooldownTime(author.battle_status.atk_cd).toString()} minute(s)\``;
        const alignmentBar = createAlignment(totalScore);

        const userEmbed = new MessageEmbed()
            .setColor(0x0099FF)
            .setTitle(`:page_with_curl: ${name}'s User Card`)
            .addFields(
                { name: ':star: Rating:', value: `\`${totalScore.toString()}\``, inline:true},
                { name: `${drinkEmotes[index]} Fav Drink:`, value: `\`Ordered ${drinksHistory[index]} time(s)\``, inline:true},
                { name: `:coin: Money:`, value: `\`${money}\``, inline:true},
                //{ name: '\u200B', value: '\u200B', inline:true },
                { name: ':clock1: Cooldown Status:', value: cooldownStatus, inline:true },
                { name: `-2${spaces}+2`, value: `${alignmentBar}`, inline: false },
            )

        await interaction.reply({ embeds: [userEmbed] });
    },
};
