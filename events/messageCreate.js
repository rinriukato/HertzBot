const { rollThanks } = require('../message-respond/roll-thanks');
const { requestDrink, giveDrink } = require('../message-respond/request-drink');
const { sendChristmas } = require('../message-respond/send-christmas');
const { sendHalloween } = require('../message-respond/send-halloween')
const { twosSystem } = require('../message-respond/twos-system');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		
		// Do not reply to self
		if (message.author.id === client.user.id) return;

		console.log('User send a message');

		// Chance reply "Welcome" to any thank you
		if (message.content.toLowerCase().includes("thank")) {
			if (message.content.toLowerCase().includes('hertz')) {
				message.reply('No problem :)');
				return;
			}
			await rollThanks(message);
			return;
		}

		// User asking for a drink
		if (requestDrink(message.content.toLowerCase())) {
			await giveDrink(message);
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

		// User sends a +2 / -2 to another user
		if (message.reference != null && (message.content === '+2' || message.content ==='-2')) {
			await twosSystem(message);
			return;
		}
	},
}; 