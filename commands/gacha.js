const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const { emotes } = require('../assets');
const { gachaResult } = require('../command-utils/gacha-rates');
const { getCommonPrize } = require('../command-utils/get-common-prize');

const ANIMATION_SPEED = 2; // In seconds
const COLOR = 0xFFFFFF

const GIGA_RATE = '0.1%';
const MEGA_RATE = '10%';
const STANDARD_RATE = `89.9%`


/* DEVELOPER NOTES - 
    Because of issue with MongoDB and my reluctancy to fix it, this command no longer checks and writes
    user and guild data from/to the database. I might consider fixing this in the future, but for now this works
    as intended.
*/

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
                    name:'***GIGA CAPSULE***',
                    value:`\`${GIGA_RATE}\` - RARE JUNK!`,
                    inline: false,
                },
                {
                    name:'**MEGA CAPSULE**',
                    value:`\`${MEGA_RATE}\` - Slightly rare junk`,
                    inline: false,
                },
                {
                    name:'*STANDARD CAPSULE*',
                    value:`\`${STANDARD_RATE}\` - Some random junk?`,
                    inline: false,
                },
            )
        
        const roll = new ButtonBuilder()
            .setCustomId('pull')
            .setLabel(`GACHA TIME!`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🪙')  // :coin:
        
        const row = new ActionRowBuilder()
            .addComponents(roll);
        
        const response = await interaction.reply({
            embeds: [gachaEmbedBuilder],
            components: [row] 
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'pull') {
                const result = gachaResult();

                    const resultEmbedBuilder = new EmbedBuilder()
                    .setColor(COLOR)
                    .setTitle(`${emotes.GACHAPON} **Gacha Time!** ${emotes.GACHAPON}`)

                    console.log(result);
                    switch (result) {
                        case 'G':
                            resultEmbedBuilder
                                .setDescription(`WOAH! YOU GOT A GIGA CAPSULE!`)
                                .addFields({
                                    name: '🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙',
                                    value: 'Uh... I got nothing at the moment. But youre pretty lucky huh?'
                                });
                            break;
                        case 'M':
                            resultEmbedBuilder
                                .setDescription(`Amazing! You got a Mega capsule! Why, aren't you lucky?`)
                                .addFields({
                                    name: '🪙🪙🪙🪙🪙',
                                    value: 'Woah, nice. I got nothing at the moment though...'
                                });
                            break;
                        case 'S':
                            const commonPrizeText = getCommonPrize();

                            resultEmbedBuilder
                                .setDescription(`You got a standard capsule! Let's see whats inside...`)
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
                    
                    await interaction.editReply({
                        embeds: [gachaEmbedBuilder],
                        components: []
                    });

                    // Frame 2
                    gachaEmbedBuilder.setDescription('✨🌟✨');
                    setTimeout(() => interaction.editReply({ embeds: [gachaEmbedBuilder]}), ANIMATION_SPEED * 1000);

                    // Frame 3
                    setTimeout(() => interaction.editReply({ embeds: [resultEmbedBuilder]}), (ANIMATION_SPEED * 2) * 1000);
                    //}
            }
        } catch (e) {
            console.error(e)
            const gachaTimeoutEmbed = new EmbedBuilder()
                .setColor(COLOR)
                .setTitle(`${emotes.GACHAPON} **Not Gacha Time?** ${emotes.GACHAPON}`)
                .setDescription(`Action not recieved within 1 minute. Cancelling interaction...`);
            await interaction.editReply({
                embeds: [gachaTimeoutEmbed]
            });
        }
    },
};