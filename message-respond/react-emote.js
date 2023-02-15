const MAX = 300;
const KEYWORD = "hiya-papaya";


async function reactEmote (message) {
    if (getRandomInt(MAX) === 27 || message.content.toLowerCase().includes(KEYWORD)) {
        message.react('🎑');
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
module.exports = {
    reactEmote,
}