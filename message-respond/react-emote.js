const { emotes } = require('../assets');

const riceChance = 0.003;
const nerdChance = 0.001;
const fujiChance = 0.0001;

const SPAM_KEYWORDS = [
                       "hiya-papaya",
                       "hiya_papya",
                       "https://cdn.discordapp.com/attachments/804470066514231338/1075474545303097424/IMG_6671.png",
                       "https://tenor.com/view/fire-emblem-fire-emblem-engage-yunaka-hiya-papaya-gif-27462609",
                       "https://cdn.discordapp.com/attachments/580359012093132820/1075254106345721896/IMG_6671.jpg",
                       "https://tenor.com/view/fire-emblem-fire-emblem-engage-yunaka-gif-27462405",
                       "https://tenor.com/view/fire-emblem-engage-yunaka-fire-emblem-engage-jumpscare-gif-27454440",
                       "https://cdn.discordapp.com/attachments/580359012093132820/1071545121503445142/D2B01C85-140B-4157-9155-83796FC410F5.png",
                       "https://tenor.com/view/fire-emblem-engage-fire-emblem-engage-yunaka-hiya-papaya-gif-27454439",
                       "https://cdn.discordapp.com/attachments/580359012093132820/1070818801299509388/SPOILER_Fn7k4zZaQAEFhRj-1.png",
                       "https://cdn.discordapp.com/attachments/777312166550175791/1075440147656622080/hiya_papya.gif",
                       "https://media.discordapp.net/attachments/580359012093132820/1075440891243794503/hiya_papya.gif",
                       "https://cdn.discordapp.com/attachments/775416760379244546/1075834312148135976/fire-emblem-fire-emblem-engage.gif",
                       "https://media.discordapp.net/attachments/323824215281369090/1092994476017983548/rinri_smells.gif",
                       "hiya-papaya",
                       "yunaka-",
                     ]


function reactEmote (message) {
    if (randomChance(riceChance)) {
        message.react('🎑');
        return;
    }

    if (randomChance(nerdChance)) {
        message.react('🤓')
    }

    if (randomChance(fujiChance)) {
        message.reply("woah, i can't believe its mount fuji ||this is a rare 0.01% of occurring||")
        message.react('🗻')
    }
}

function reactRen (message) {
    message.react(emotes.REN_BRUH_EMOTE);
    return;
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

function randomChance(percent_chance) {
    res = Math.random() < percent_chance;
    console.log(res);
    return res;
}
  
module.exports = {
    reactEmote,
    antiHiyaPapaya,
    reactRen,
}