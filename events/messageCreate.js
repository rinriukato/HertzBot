const { rollThanks } = require('../message-respond/roll-thanks');
const { requestSoda, giveSoda } = require('../message-respond/give-milkis');
const { sendChristmas } = require('../message-respond/send-christmas');
const { sendHalloween } = require('../message-respond/send-halloween')

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		
		// Do not reply to self
		if (message.author.id === client.user.id) return;

		console.log('User send a message');

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

		// User says: "Tommorrow is christmas!"
		if (message.content.toLowerCase().includes('tomorrow is christmas')) {
			await sendChristmas(message);
			return;
		}

		// User says: "Tomorrow is halloween!"
		if (message.content.toLowerCase().includes('tomorrow is halloween')) {
			await sendHalloween(message);
			return;
		}
	},
}; 