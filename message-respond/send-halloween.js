const spooks = ":jack_o_lantern::ghost::jack_o_lantern::ghost:";

async function sendHalloween (message) {
	await message.channel.send(`${spooks}\n${spooks}\n${spooks}\n${spooks}`);
}

module.exports = {
    sendHalloween,
}