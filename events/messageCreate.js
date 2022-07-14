const { rollThanks } = require('../message-respond/roll-thanks')

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
        console.log('A message has been created');

		if (message.author.id === client.user.id) return;

		if (message.content.toLowerCase().includes("thank")) {
			await rollThanks(message);
			return;
		}
	},
}; 