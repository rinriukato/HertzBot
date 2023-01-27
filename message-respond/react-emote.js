const MAX = 300;

async function reactEmote (message) {
    if (getRandomInt(MAX) === 27) {
        message.react('🎑');
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
module.exports = {
    reactEmote,
}