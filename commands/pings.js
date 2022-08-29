const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boop')
	    .setDescription('Boops the specified user, as many times as you want')
	    .addUserOption((option) => option.setName('user').setDescription('The user to boop').setRequired(false)
    ),

    async execute(interaction) {

        let user = interaction.options.getUser('user');
        if (user == null){
            user = 'world'
        }
        //console.log(user.id);
        await interaction.reply(`Boop ${user}`);
    },
};