const { rollThanks } = require('../message-respond/roll-thanks');
const { requestDrink, giveDrink } = require('../message-respond/request-drink');
const { sendChristmas } = require('../message-respond/send-christmas');
const { sendHalloween } = require('../message-respond/send-halloween')
const { twosSystem } = require('../message-respond/twos-system');
const { reactEmote } = require('../message-respond/react-emote');
const { sendEmbedFail } = require('../message-respond/send-embed-fail');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		
		// Do not reply to self
		if (message.author.id === client.user.id) return;

		console.log('User send a message');

		reactEmote(message);

		if (message.content.toLowerCase().includes("thank")) {
			if (message.content.toLowerCase().includes('hertz')) {
				message.reply('No problem :)');
				return;
			}
			await rollThanks(message);
			return;
		}

		if (requestDrink(message.content.toLowerCase())) {
			await giveDrink(message);
			return;
		}

		if (message.content.toLowerCase().includes('tomorrow is christmas')) {
			await sendChristmas(message);
			return;
		}

		if (message.content.toLowerCase().includes('tomorrow is halloween')) {
			await sendHalloween(message);
			return;
		}

		if (message.content.toLowerCase().includes('embed fail')) {
			await sendEmbedFail(message);
			return;
		}

		if (message.reference != null && (message.content === '+2' || message.content ==='-2')) {
			await twosSystem(message);
			return;
		}
	},
}; 