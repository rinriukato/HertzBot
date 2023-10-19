const { rollThanks } = require('../message-respond/roll-thanks');
const { requestDrink, giveDrink } = require('../message-respond/request-drink');
const { sendChristmas } = require('../message-respond/send-christmas');
const { sendHalloween } = require('../message-respond/send-halloween')
const { twosSystem } = require('../message-respond/twos-system');
const { reactEmote, antiHiyaPapaya, reactRen } = require('../message-respond/react-emote');
const { sendEmbedFail } = require('../message-respond/send-embed-fail');
const { sendProofGif } = require('../message-respond/send-pudding-gif');
const { sendFireworks } = require('../message-respond/send-newyears');

const iodosId = 655125193098002479;
const REQUEST_LENGTH_MAX = 100;

// temp spot, can't be bother lmao
const rinri_name = "リグマ"
const boom_image = "https://cdn.discordapp.com/attachments/804470066514231338/1129808178704560258/8675309.png";


module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		
		// Do not reply to self and ignore bot messages
		if (message.author.id === client.user.id || message.author.bot === true) return;

		reactEmote(message);
		await antiHiyaPapaya(message);
		
		if (message.content.includes('ren')) {
			reactRen(message);
			return;
		}

		// For bidoofis :)
		if (message.content.includes("Bidoofis")) {
			message.reply('bidoofis*');
			return;
		}

		if (message.content.toLowerCase().includes("proof?")) {
			if (Math.floor(Math.random() >= 0.3)) {
				await message.reply("It's in the pudding.");
			} else {
				sendProofGif(message);
			}
			return;
		}

		if ((message.content === 'bidoofis') && (message.author.id == iodosId)) {
			await message.channel.send('*boom*');
			return;
		}

		if (message.content.includes(rinri_name) && message.content.includes('?')) {
			await message.reply('リグマ・ボールズ');
			await message.channel.send(boom_image);
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