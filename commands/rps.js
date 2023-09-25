const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonStyle } = require('discord.js');

// Rock == 0
// Paper == 1
// Scissors == 2
// Results -> 0 draw, 1 row wins, 2 row lose
const rpsResults = [
    [0, 2, 1],          // Player picked rock
    [1, 0, 2],   // Player picked paper
    [2, 1, 0]    // Player picked scissors
]

function moveToString(num) {
    if (num === 0) return '✊';
    if (num === 1) return '✋';
    return '✌';
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock-Paper-Scissors with Hertz!'),
    async execute(interaction) {

        const rock = new ButtonBuilder()
        .setCustomId('r')
        .setLabel('Rock!')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('✊')

        const paper = new ButtonBuilder()
            .setCustomId('p')
            .setLabel('Paper!')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✋')

        const scissors = new ButtonBuilder()
            .setCustomId('s')
            .setLabel('Scissors!')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✌')
        
        const row = new ActionRowBuilder(rock, paper, scissors);

        const response = await interaction.reply({
            content: "Lets play Rock-Paper-Scissors!",
            components: [row]
        });

        const collectionFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({filter: collectorFilter, time: 60_000});
            let playerMove;

            if (confirmation.customId === 'r') {
                await interaction.editReply({
                    content: 'You picked ✊',
                    components: [],
                })
                playerMove = 0;
            }
			if (confirmation.customId === 'p') {
                await interaction.editReply({
                    content: 'You picked ✋',
                    components: [],
                })
                playerMove = 1;
            }
			if (confirmation.customId === 's') {
                await interaction.editReply({
                    content: 'You picked ✌',
                    components: [],
                })
                playerMove = 2;
            }

            await interaction.channel.send('Hertz selects...');
            const botMove = Math.floor(Math.random() * 3);
            const result = rpsResults[playerMove][botMove];

            if (result === 0) {
                await interaction.channel.send({
                    content: `${moveToString(botMove)} Its a draw!`
                });
            }
            else if (result === 1) {
                await interaction.channel.send({
                    content: `${moveToString(botMove)} You've won!`
                });
            }
            else if (result === 2) {
                await interaction.channel.send({
                    content: `${moveToString(botMove)}! You've lost!`
                });
            }

        } catch (e) {
            console.error(e)
            await interaction.reply('This interaction has timed out after 1 minute.')
        }
    }
}

