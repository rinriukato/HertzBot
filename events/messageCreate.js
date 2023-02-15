const { rollThanks } = require('../message-respond/roll-thanks');
const { requestDrink, giveDrink } = require('../message-respond/request-drink');
const { sendChristmas } = require('../message-respond/send-christmas');
const { sendHalloween } = require('../message-respond/send-halloween')
const { twosSystem } = require('../message-respond/twos-system');
const { reactEmote, antiHiyaPapaya } = require('../message-respond/react-emote');
const { sendEmbedFail } = require('../message-respond/send-embed-fail');
const { sendFireworks } = require('../message-respond/send-newyears');

const iodosId = 655125193098002479;
const REQUEST_LENGTH_MAX = 100;

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		
		// Do not reply to self and ignore bot messages
		if (message.author.id === client.user.id || message.author.bot === true) return;

		// console.log('User send a message');

		reactEmote(message);
		await antiHiyaPapaya(message);

		// For bidoofis :)
		if (message.content.includes("Bidoofis")) {
			message.reply('bidoofis*');
			return;
		}

		if ((message.content === 'bidoofis') && (message.author.id == iodosId)) {
			await message.channel.send('*boom*');
			return;
		}

		if (message.content.toLowerCase().includes("thank")) {
			if (message.content.toLowerCase().includes('hertz')) {
				await message.reply('No problem :)');
				return;
			}
			await rollThanks(message);
			return;
		}

		if (requestDrink(message.content.toLowerCase()) && (message.content.length <= REQUEST_LENGTH_MAX)) {
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

		if (message.content.toLowerCase().includes('tomorrow is new years') || message.content.toLowerCase().includes('hertz send firework')) {
			await sendFireworks(message);
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