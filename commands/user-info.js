const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, BaseCommandInteraction } = require('discord.js');
const { emotes } = require('../assets');
const { findUserCreate, isUserOffCooldown, getCooldownTime } = require('../db-utils/user-utils');
const { createAlignment } = require('../command-utils/create-alignment');

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

        interaction.reply("This command doesn't work because rinri is lazy. Sorry");
        return;

        
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

        
        const name = targetUser.username;
        const scores = [
                        targetUser.scores.pos_score, targetUser.scores.rinri_pos_score, 
                        targetUser.scores.neg_score,targetUser.scores.rinri_neg_score
                    ];

        const drinksHistory = [
                               targetUser.drinks_ordered.milkis, targetUser.drinks_ordered.tea,
                               targetUser.drinks_ordered.bubble_tea, targetUser.drinks_ordered.milk,
                               targetUser.drinks_ordered.coffee, targetUser.drinks_ordered.juice, 
                               targetUser.drinks_ordered.cola, targetUser.drinks_ordered.water,
                               targetUser.drinks_ordered.sake,
                           ];
        
        const max = Math.max(...drinksHistory);
        const money = targetUser.battle_status.money;
        const index = drinksHistory.indexOf(max);
        const totalScore = (scores[0] + scores[2]);
        const cooldownStatus = isUserOffCooldown(targetUser.battle_status.atk_cd) ? '\`Ready to go!\`' : `\`Ready in ${getCooldownTime(targetUser.battle_status.atk_cd).toString()} minute(s)\``;
        const alignmentBar = createAlignment(totalScore);

        const userEmbed = new MessageEmbed()
            .setColor(0x0099FF)
            .setTitle(`:page_with_curl: ${name}'s User Card`)
            .addFields(
                { 
                    name: ':star: Rating:',
                    value: `\`${totalScore.toString()}\``,
                    inline:true
                },
                { 
                    name: `${drinkEmotes[index]} Fav Drink:`,
                    value: `\`Ordered ${drinksHistory[index]} time(s)\``,
                    inline:true
                },
                { 
                    name: `:coin: Coins:`,
                    value: `\`${money}\``,
                    inline:true
                },
                //{ name: '\u200B', value: '\u200B', inline:true },
                { 
                    name: ':clock1: Cooldown Status:',
                    value: cooldownStatus,
                    inline: true 
                },
                {
                    name: `-2${spaces}+2`,
                    value: `${alignmentBar}`,
                    inline: false 
                },
                {
                    name: `${emotes.GACHAPON} Gacha Stats -`,
                    value: `Capsules Collected: \`${targetUser.gacha_stats.total_rolls}\`
                            Money Spent: \`${targetUser.gacha_stats.money_spent}\`\n`,
                    inline: true 
                },
                {
                    name: `Ultra Rares: `,
                    value: `\`${targetUser.gacha_stats.pons.ultra_rare}\``,
                    inline: true 
                },
                {
                    name: `Super Rares: `,
                    value: `\`${targetUser.gacha_stats.pons.super_rare}\``,
                    inline: true 
                },
                {
                    name: `Rares: `,
                    value: `\`${targetUser.gacha_stats.pons.rare}\``,
                    inline: true 
                },
                {
                    name: `Uncommons: `,
                    value: `\`${targetUser.gacha_stats.pons.uncommons}\``,
                    inline: true 
                },
                {
                    name: `Commons: `,
                    value: `\`${targetUser.gacha_stats.pons.commons}\``,
                    inline: true 
                },
            )

        await interaction.reply({ embeds: [userEmbed] });
    },
};
                            