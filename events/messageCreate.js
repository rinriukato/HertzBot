const { rollThanks } = require('../message-respond/roll-thanks')
const { requestSoda, giveSoda } = require('../message-respond/give-milkis')

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
        console.log('A message has been created');
		
		// Do not reply to self
		if (message.author.id === client.user.id) return;

		// Chance reply "Welcome" to any thank you
		if (message.content.toLowerCase().includes("thank")) {
			await rollThanks(message);
			return;
		}

		// User asking for a drink
		if (requestSoda(message.content.toLowerCase())) {
			await giveSoda(message);
			return;
		}

	},
}; 