module.exports = {
	name: 'interactionCreate',
	execute(interaction, client, message) {
		// console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
        
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
        
            if (!command) return;
        
            try {
                command.execute(interaction, message);
            } catch (error) {
                console.error(error);
                interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
	},
};