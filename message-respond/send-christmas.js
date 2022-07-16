const { gifs } = require('../assets');

const trees = ":christmas_tree: :christmas_tree: :christmas_tree: :christmas_tree: :christmas_tree:";

async function sendChristmas (message) {
	await message.channel.send(`${gifs.CHRISTMAS_LIGHTS}`);
    await message.channel.send(`${trees} **MERRY CHRISTMAS!** ${trees}`);
    await message.channel.send(`${gifs.CHRISTMAS_LIGHTS}`);
}

module.exports = {
    sendChristmas,
}