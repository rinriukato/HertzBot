const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

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
        const options = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rock')
                    .setLabel('Rock!')
                    .setStyle('PRIMARY')
                    .setEmoji('✊'),
                new MessageButton()
                    .setCustomId('paper')
                    .setLabel('Paper!')
                    .setStyle('PRIMARY')
                    .setEmoji('✋'),
                new MessageButton()
                    .setCustomId('scissors')
                    .setLabel('Scissors!')
                    .setStyle('PRIMARY')
                    .setEmoji('✌'),
            )
		
		
		await interaction.reply({ content: 'Lets play Rock-Paper-Scissors!',  components: [options] });

		const filter = (buttonInteraction) => {

			if (interaction.user.id === buttonInteraction.user.id) return true;
			return interaction.reply({content: "This isn't your game!", ephemeral: true});
		};

		const collector = interaction.channel.createMessageComponentCollector({filter, max: 1});
 
		collector.on('end', async (ButtonInteraction) => {
			const id = ButtonInteraction.first().customId;
            let playerMove;

			if (id === 'rock') {
                await interaction.editReply({
                    content: 'You picked ✊',
                    components: [],
                })
                playerMove = 0;
            }
			if (id === 'paper') {
                await interaction.editReply({
                    content: 'You picked ✋',
                    components: [],
                })
                playerMove = 1;
            }
			if (id === 'scissors') {
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
		})
    },
};
