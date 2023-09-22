const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, Button, EmbedBuilder, ButtonInteraction } = require('discord.js');
const { emotes } = require('../assets');
const { gachaResult } = require('../command-utils/gacha-rates');
const { getCommonPrize } = require('../command-utils/get-common-prize');
const { getPlayerMoney, updatePlayerMoney, incrementUserTotalRolls,
        setUserMoneySpent, incrementUserPons, findUserCreate } = require('../db-utils/user-utils');
const { incrementTotalRolls, setMoneySpent, incrementPons,
        findGuildCreate} = require('../db-utils/guild-utils');

const ANIMATION_SPEED = 2; // In seconds
const COLOR = 0xFFFFFF
const PULL_COST = 100;

const ULTRA_RARE_RATE = '0.1%';
const SUPER_RARE_RARE = '3%';
const RARE_RATE = `10%`;
const UNCOMMON_RATE = `35%`;
const COMMON_RATE = `65%`

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gacha')
	    .setDescription('Pull from the gachapon machine!'),

    async execute(interaction) {

        const gachaEmbedBuilder = new EmbedBuilder()
            .setColor(COLOR)
            .setTitle(`${emotes.GACHAPON} **Gacha Time!** ${emotes.GACHAPON}`)
            .setDescription('Time to waste your money!')
            .addFields(
                {
                    name:'***Ultra Rare!***',
                    value:`\`${ULTRA_RARE_RATE}\` - 25,000 :coin: Prize!`,
                    inline: false,
                },
                {
                    name:'**Super Rare!**',
                    value:`\`${SUPER_RARE_RARE}\` - 1,500 :coin: Prize!`,
                    inline: false,
                },
                {
                    name:'*Rare*',
                    value:`\`${RARE_RATE}\` - 300 :coin: Prize!`,
                    inline: false,
                },
                {
                    name:'Uncommon',
                    value:`\`${UNCOMMON_RATE}\` - 100 :coin: Prize!`,
                    inline: false,
                },
                {
                    name:'Common',
                    value:`\`${COMMON_RATE}\` - Random useless item...`,
                    inline: false,
                },
            )
        
        const options = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('pull')
                    .setLabel(`Pull for ${PULL_COST}`)
                    .setStyle('PRIMARY')
                    .setEmoji('🪙')  // :coin:
            )

        await interaction.reply({EmbedBuilders: [gachaEmbedBuilder], components: [options] });

        const filter = (buttonInteraction) => {

			if (interaction.user.id === buttonInteraction.user.id) return true;
			buttonInteraction.reply({content: "Hey! Somebody else is using this machine", ephemeral: true});
            return false
		};

		const collector = interaction.channel.createMessageComponentCollector({filter, max: 1});
        
        const collectionHandler = async (ButtonInteraction) => {
           /* DEVELOPER NOTES - 
                Most of the code below has been commented out. It's is suppose to check if the user has 
                enough money and write it to the database. Due to the database being non-functional,
                I have disabled that check so the users can freely roll the gacha pon. I might 
                re-enable this feature, but for now this was my solution
           */
           
            // const user = await findUserCreate(interaction.user ,interaction.guild);
            
            // Check for money
            // const userMoney = getPlayerMoney(user);

            /*
            if (userMoney < PULL_COST) {
                const noMoneyEmbedBuilder = new EmbedBuilder()
                    .setColor(COLOR)
                    .setTitle(`No Gacha Time?`)
                    .setDescription(`Looks you like you don't have enough money to put into the machine...\n Maybe next time?`);

                await interaction.editReply({EmbedBuilders: [noMoneyEmbedBuilder], components: []});
            */
               

            // const guild = await findGuildCreate(interaction.guild);
            const result = gachaResult();
            
            /*
            // Update gachapon stats for User
            await updatePlayerMoney(user, amount=PULL_COST, isNegative=true);
            await incrementUserTotalRolls(user);
            await incrementUserPons(user, ponType=result);
            await setUserMoneySpent(user, moneySpent=PULL_COST);

            // Update Sever stats
            await incrementTotalRolls(guild);
            await incrementPons(guild, ponType=result);
            await setMoneySpent(guild, moneySpent=PULL_COST);
            */

            // Build result EmbedBuilder
            const resultEmbedBuilder = new EmbedBuilder()
                .setColor(COLOR)
                .setTitle(`${emotes.GACHAPON} **Gacha Time!** ${emotes.GACHAPON}`)

            console.log(result);
            switch (result) {
                case 'Ultra Rare':
                    await updatePlayerMoney(user, amount=25000, isNegative=false);

                    resultEmbedBuilder
                        .setDescription(`WOAH! YOU GOT AN ULTRA RARE CAPSULE! That was 1 in 1000 chance!`)
                        .addFields({
                            name: '🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙',
                            value: '25,000 money has been added to your account!'
                        });
                    break;

                case 'Super Rare':
                    await updatePlayerMoney(user, amount=1500, isNegative=false);

                    resultEmbedBuilder
                        .setDescription(`Amazing! You got a Super Rare capsule! Why, aren't you lucky?`)
                        .addFields({
                            name: '🪙🪙🪙🪙🪙',
                            value: '1,500 money has been added to your account!'
                        });
                    break;

                case 'Rare':
                    await updatePlayerMoney(user, amount=300, isNegative=false);

                    resultEmbedBuilder
                        .setDescription(`You got a Rare capsule!`)
                        .addFields({
                            name: '🪙🪙🪙',
                            value: '300 money has been added to your account!'
                        });
                    break;
                case 'Uncommon':
                    await updatePlayerMoney(user, amount=100, isNegative=false);

                    resultEmbedBuilder
                        .setDescription(`You got an Uncommon capsule! At least you broken even...`)
                        .addFields({
                            name: '🪙🪙🪙',
                            value: '100 money has been added to your account'
                        });
                    break;

                case 'Common':
                    const commonPrizeText = getCommonPrize();

                    resultEmbedBuilder
                        .setDescription(`You got a Common capsule! Let's see whats inside...`)
                        .addFields({
                            name: commonPrizeText.toString(),
                            value: ` `,
                        });
                    break;
            }

            // Frame 1
            const gachaEmbedBuilder = new EmbedBuilder()
                .setColor(COLOR)
                .setTitle(`${emotes.GACHAPON} **Gacha Time!** ${emotes.GACHAPON}`)
                .setDescription(`💨 ${emotes.GACHAPON} *plop~*`);
            await interaction.editReply({EmbedBuilders: [gachaEmbedBuilder], components: []});

            // Frame 2
            gachaEmbedBuilder.setDescription('✨🌟✨');
            setTimeout(() => interaction.editReply({ EmbedBuilders: [gachaEmbedBuilder]}), ANIMATION_SPEED * 1000);

            // Frame 3
            setTimeout(() => interaction.editReply({ EmbedBuilders: [resultEmbedBuilder]}), (ANIMATION_SPEED * 2) * 1000);
            //}
        }

		collector.on('end', (ButtonInteraction) => collectionHandler(ButtonInteraction).catch(console.error));
    },
};