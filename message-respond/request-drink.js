const { emotes } = require('../assets');
const { findUserCreate, updateUserDrinks } = require('../db-utils/user-utils');
const { findGuildCreate, updateGuildDrinks } = require('../db-utils/guild-utils');

const requests = ["please", "can i have", "give me", "give", "one", "can i", "would like", "i want", "i could go for", "1"];
const drinks = ["milkis", "boba", "tea", "milk", "coffee", "juice", "cola", "water", "sake"];
const drinkEmotes = [emotes.MILKIS_EMOTE,":bubble_tea:",":tea:", ":milk:", ":coffee:", ":beverage_box:", emotes.COLA_EMOTE ,emotes.WATER_EMOTE, ":sake:"];

function requestDrink(message) {
	const exist = (substring) => message.includes(substring);
	return (requests.some(exist) && drinks.some(exist));
}

async function giveDrink(message) {
	const author = await findUserCreate(message.author, message.guild);
	const guild = await findGuildCreate(message.guild);
	const drinkIndex = getDrinkIndex(message.content)
	const drink = drinkEmotes[drinkIndex];

	await updateUserDrinks(author, drinkIndex);
	await updateGuildDrinks(guild, drinkIndex);
	await message.reply(`Here you go! ${drink} :wave: ${emotes.HERTZ_EMOTE}`);
}

function getDrinkIndex(message) {
	for (let i = 0; i < drinks.length; i++) {
		if (message.includes(drinks[i])) {
			return i;
		}
	}
}

module.exports = {
    requestDrink,
	giveDrink,
}
