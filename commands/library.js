const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('library')
	    .setDescription('View cards that you currently have'),

    async execute(interaction) {
        await interaction.reply(`Boop`);
    },
};