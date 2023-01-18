const { emotes, gifs } = require('../assets');

async function sendEmbedFail (message) {
    const gif = getGif();

    try {
        await message.channel.send(gif);
    } catch (error) {
        console.log("An error has occurred in posting a embed-fail gif")
        console.log(error)
    }
}

function getGif () { 
    const numGifs = gifs.EMBED_FAIL_GIFS.length;
    return gifs.EMBED_FAIL_GIFS[Math.floor(Math.random() * numGifs)];
}

module.exports = {
    sendEmbedFail,
}