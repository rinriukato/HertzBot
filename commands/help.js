const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { emotes } = require(`../assets`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
	    .setDescription('Brief introduction of Hertz and the commands avaliable')
        .addStringOption(option =>
            option.setName(`command`)
            .setDescription('The name command or function you wish to learn about')
            .setRequired(false)
            .addChoices(
                { name: 'rps', value: 'rps'},
                { name: 'daily', value: 'daily'},
                { name: 'drink-history', value: 'drink-history'},
                { name: 'server-info', value: 'server-info'},
                { name: 'user-info', value: 'user-info'},
                { name: '2s-rating', value: '2s-rating'},
            )
        ),

    async execute(interaction) {
        const command = interaction.options.getString('command');
        const hertzImage = "https://cdn.discordapp.com/attachments/314926179020832768/1065375255633342464/Hertz_Help.png";

        // Default Response
        if (command === null) {
            const helpMessage = `Hello, and welcome to my help page! For a more detailed look into the avaliable commands or one of my functions, use:
                                \`/help <name of command>\``;

            const helpEmbed = new MessageEmbed()
            .setColor(0x228B22)
            .setTitle(`Hertz's Help Page`)
            .setThumbnail(hertzImage)
            .setDescription(helpMessage)
            .addFields(
                {
                    name: ":partying_face: Fun Commands:",
                    value: "\`rps\`",
                    inline: false,
                },
                {
                    name: ":moneybag: Money Commands:",
                    value: "\`daily\`",
                    inline: false,
                },
                {
                    name: ":thinking: Info Commands:",
                    value: "\`drink-history\` \`server-info\` \`user-info\`",
                    inline: false,
                },
                {
                    name: ":dvd: Systems",
                    value: "\`2s-rating\`",
                    inline: false,
                }
            )

            await interaction.reply({ embeds: [helpEmbed] });
            return;
        }

        switch (command) {
            case 'rps': {
                const helpEmbed = new MessageEmbed()
                .setColor(0x228B22)
                .setTitle(`Command help for rps`)
                .setDescription(`Play a simple game of Rock-Paper-Scissors with Hertz!. Pick one of the options avaliable and Hertz (totally using advance AI) will make his choice as well. 
                There are no stakes involved so just have fun with it`)
                .addFields(
                        {
                            name: `**Usage**`,
                            value: `\`/rps\` - Type in this command and the game will get started.`,
                            inline: false,
                        }
                    )
                
                await interaction.reply({ embeds: [helpEmbed] });
                return;
            }
            case 'daily': {
                const helpEmbed = new MessageEmbed()
                .setColor(0x228B22)
                .setTitle(`Command help for daily`)
                .setDescription(`Recieve 100 Money. You can use this command again every 24-hour period since you've last used it.`)
                .addFields(
                        {
                            name: `**Usage**`,
                            value: `\`/daily\` - Type in this command and Hertz will add 100 Money to your profile.`,
                            inline: false,
                        }
                    )
                
                await interaction.reply({ embeds: [helpEmbed] });
                return;
            }
            case 'drink-history': {
                const helpEmbed = new MessageEmbed()
                .setColor(0x228B22)
                .setTitle(`Command help for drink-history`)
                .setDescription(`A list of all the drinks the user has requested from Hertz. `)
                .addFields(
                        {
                            name: `**Usage**`,
                            value: `\`/drink-history user\` - If \`user\` is not specified, Hertz will display your drink history.`,
                            inline: false,
                        },
                        {
                            name: `**Options**`,
                            value: `\`user\` - Which user you wish to search for. They must be in this server if you wish to search them.`,
                            inline: false,
                        }
                    )
                
                await interaction.reply({ embeds: [helpEmbed] });
                return;
            }
            case 'server-info': {
                const helpEmbed = new MessageEmbed()
                .setColor(0x228B22)
                .setTitle(`Command help for server-info`)
                .setDescription(`Displays information Hertz has gathered about this server. Such as the amount of [+2] given out or the server's favorite drink!`)
                .addFields(
                        {
                            name: `**Usage**`,
                            value: `\`/server-info\` - Type in this command and Hertz will create the info panel.`,
                            inline: false,
                        }
                    )
                
                await interaction.reply({ embeds: [helpEmbed] });
                return;
            }
            case 'user-info': {
                const helpEmbed = new MessageEmbed()
                .setColor(0x228B22)
                .setTitle(`Command help for user-info`)
                .setDescription(`Displays the user's information card. This will show infomation such as the user's rating, their favorite drink, and their rating alignment!`)
                .addFields(
                        {
                            name: `**Usage**`,
                            value: `\`/user-info user\` - If \`user\` is not specified, Hertz will display your drink history.`,
                            inline: false,
                        },
                        {
                            name: `**Options**`,
                            value: `\`user\` - Which user you wish to search for. They must be in this server if you wish to search them.`,
                            inline: false,
                        }
                    )
                
                await interaction.reply({ embeds: [helpEmbed] });
                break;
            }
            case '2s-rating': {
                const helpEmbed = new MessageEmbed()
                .setColor(0x228B22)
                .setTitle(`Explaination of [+2][-2] Rating System`)
                .setDescription(
                                `The [+2] Rating System is similar to Likes/Dislikes or Upvotes/Downvotes
                                in the sense you can rate or give an award to another user's message or post they've made in the server.
                                However, if the **same message** and **same author** get +2 or -2 in a short amount of time. A combo will start and that user will recieve a multiplier
                                to **ALL** incoming +2 or -2 for a maximum of a 4.0x multiplier bonus.`
                               )
                .addFields(
                        {
                            name: `**"How do I rate someone's message?"**`,
                            value: `To rate a message, hover over the message you wish to rate, and click the 'Reply' button (Right next to the 'Add Reaction' button).
                                    From there, **ONLY** reply \`+2\` or \`-2\` (I recommend turning off @s if you don't want to bother someone)\n`,
                            inline: false,
                        },
                        {
                            name: `**"How often can I send +2 or -2 to someone?"**`,
                            value: `Once you've sent a +2 or a -2. You will have a 10 minute cooldown before you can send another one.\n`,
                            inline: false,
                        },
                        {
                            name: `**"How do you start a +2 or -2 combo?"**`,
                            value: `Once at least 3 users replies either +2 or -2 to the **same message and author**. A multiplier will be applied to all incoming ratings.
                                    Keep in mind that you will be on cooldown, so you will need multiple different users to achieve a combo.
                                    At the moment, there can only be one combo happening at a given time per server.\n`,
                            inline: false,
                        },
                        {
                            name: `**"How does a combo end?"**`,
                            value: `A combo ends if either 10 minutes elapses or if someone replies +2 or -2 to a **different message**`,
                            inline: false,
                        },
                    )
                
                await interaction.reply({ embeds: [helpEmbed] });
                return;
            }
        }


    },
};