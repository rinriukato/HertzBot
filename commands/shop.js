const { SlashCommandBuilder } = require('@discordjs/builders');

// Use reactions to buy items if user has money?

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Open the store!'),
    async execute(interaction) {
        await interaction.reply('Not Avaliable!');
    },
};