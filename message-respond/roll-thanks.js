// Random chance for the bot to "steal" credit when a user says 'Thanks' under any context
// The random int "simulates" a six-sided die where the user must roll a 1 for it to be in effect and 1 for any successive rolls

const replies = [
    "You're welcome :)",
    "No problem :D",
    "Anytime!"
]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
async function rollThanks (message) {
    for (let i = 0; i < 3; i++) {
        let diceRoll = getRandomInt(6);
        if (diceRoll !== 1) return;

        message.reply(replies[i]);
    }
    return;
}

module.exports = {
    rollThanks,
}