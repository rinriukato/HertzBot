const MAX = 300;
const SPAM_KEYWORDS = ["hiya-papaya", "IMG_6671.jpg","yunaka-gif-27462405"]


function reactEmote (message) {
    if (getRandomInt(MAX) === 27) {
        message.react('🎑');
    }
}

function reactSpam (message) {
    const exist = (substring) => message.includes(substring);
	if (SPAM_KEYWORDS.some(exist)) {
        message.react('🎑');
        message.react('🍚');
        message.react('🍙');
        message.react('🍘');
        message.react('🛑');
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
module.exports = {
    reactEmote,
    reactSpam,
}