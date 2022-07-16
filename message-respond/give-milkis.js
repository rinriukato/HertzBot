const { emotes } = require('../assets');

const requests = ["please", "have", "give me", "give", "one", "can i", "would like", "i want"];

function requestSoda (message) {
	const exist = (substring) => message.includes(substring);

	return (requests.some(exist) && message.includes('milkis'));
}

async function giveSoda (message) {
	await message.reply(`Here you go! ${emotes.MILKIS_EMOTE} :wave: ${emotes.TODD_EMOTE}`);
}

module.exports = {
    requestSoda,
	giveSoda,
}