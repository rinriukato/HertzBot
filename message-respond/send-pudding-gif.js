const { emotes, gifs } = require('../assets');

async function sendProofGif (message) {
    const gif = getGif();

    try {
        await message.channel.send("Here's your proof:")
        await message.channel.send(gif);
    } catch (error) {
        console.log("An error has occurred in posting a proof gif")
        console.log(error)
    }
}

function getGif () { 
    const numGifs = gifs.PROOF_GIFS.length;
    return gifs.PROOF_GIFS[Math.floor(Math.random() * numGifs)];
}

module.exports = {
    sendProofGif,
}