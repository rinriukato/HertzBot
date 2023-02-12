const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token, guildId2, guildId3, guildOmnia, fishroom} = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);


rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands for Rat Server.'))
	.catch(console.error);


	rest.put(Routes.applicationGuildCommands(clientId, guildId2), { body: commands })
	.then(() => console.log('Successfully registered application commands for Dev Server.'))
	.catch(console.error);

	rest.put(Routes.applicationGuildCommands(clientId, guildId3), { body: commands })
	.then(() => console.log('Successfully registered application commands for Omnia Dev Server.'))
	.catch(console.error);

	rest.put(Routes.applicationGuildCommands(clientId, guildOmnia), { body: commands })
	.then(() => console.log('Successfully registered application commands for Omnia Server.'))
	.catch(console.error);

	rest.put(Routes.applicationGuildCommands(clientId, fishroom), { body: commands })
	.then(() => console.log('Successfully registered application commands for Funny Fish Room.'))
	.catch(console.error);