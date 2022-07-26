const { emotes } = require('../assets');
const { findUserCreate, updateUserDrinks } = require('../db-utils/user-utils');

const requests = ["please", "can i have", "give me", "give", "one", "can i", "would like", "i want", "i could go for"];
const drinks = ["milkis", "boba", "tea", "milk", "coffee", "juice", "cola", "water"];
const drinkEmotes = [emotes.MILKIS_EMOTE,":bubble_tea:",":tea:", ":milk:", ":coffee:", ":beverage_box:", emotes.COLA_EMOTE ,emotes.WATER_EMOTE];

function requestDrink(message) {
	const exist = (substring) => message.includes(substring);

	return (requests.some(exist) && drinks.some(exist));
}

async function giveDrink(message) {
	const drinkIndex = getDrinkFromFridge(message.content)
	const drink = drinkEmotes[drinkIndex];
	await message.reply(`Here you go! ${drink} :wave: ${emotes.TODD_EMOTE}`);
	const author = await findUserCreate(message.author, message.guild);
	await updateUserDrinks(author, drinkIndex);
}

function getDrinkFromFridge(message) {
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