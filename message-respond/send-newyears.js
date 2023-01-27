
async function sendFireworks(message) {
    const msg = await message.channel.send("🧨 ▫️ ▫️ ▫️ 🕯️ <:hertz:1064623739683213386>");
    setTimeout(() => msg.edit('🧨 ▫️ ▫️ 🔥'), 3 * 1000);
    setTimeout(() => msg.edit('🧨 ▫️ 🔥'), 3 * 1000);
    setTimeout(() => msg.edit('🧨 🔥'), 3 * 1000);
    setTimeout(() => msg.edit('🧨 🔥'), 3 * 1000);
    setTimeout(() => msg.edit(':fireworks::fireworks::fireworks:\n:fireworks::fireworks::fireworks:\n:fireworks::fireworks::fireworks:'), 3 * 1000);
}

module.exports = {
    sendFireworks,
}