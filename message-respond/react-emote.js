const { emotes } = require('../assets');
const MAX = 300;
const SPAM_KEYWORDS = [
                       "hiya-papaya",
                       "https://cdn.discordapp.com/attachments/804470066514231338/1075474545303097424/IMG_6671.png",
                       "https://tenor.com/view/fire-emblem-fire-emblem-engage-yunaka-hiya-papaya-gif-27462609",
                       "https://cdn.discordapp.com/attachments/580359012093132820/1075254106345721896/IMG_6671.jpg",
                       "https://tenor.com/view/fire-emblem-fire-emblem-engage-yunaka-gif-27462405",
                       "https://tenor.com/view/fire-emblem-engage-yunaka-fire-emblem-engage-jumpscare-gif-27454440",
                       "https://cdn.discordapp.com/attachments/580359012093132820/1071545121503445142/D2B01C85-140B-4157-9155-83796FC410F5.png",
                       "https://tenor.com/view/fire-emblem-engage-fire-emblem-engage-yunaka-hiya-papaya-gif-27454439",
                       "https://cdn.discordapp.com/attachments/580359012093132820/1070818801299509388/SPOILER_Fn7k4zZaQAEFhRj-1.png",
                       "https://cdn.discordapp.com/attachments/777312166550175791/1075440147656622080/hiya_papya.gif",
                    ]


function reactEmote (message) {
    if (getRandomInt(MAX) === 27) {
        message.react('🎑');
    }
}

async function antiHiyaPapaya (message) {
    const msg = message.content
    const exist = (substring) => msg.includes(substring);

	if (SPAM_KEYWORDS.some(exist)) {
        try {
            await message.react('🎑');
            await message.react('🍚');
            await message.react('🍙');
            await message.react('🍘');
            await message.react('🛑');
            await message.react(emotes.SPEECH_DELETE_EMOTE);

        } catch (error) {
            console.error(error)
            console.log('Most likely messaged deleted before emotes finished');
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
module.exports = {
    reactEmote,
    antiHiyaPapaya,
}