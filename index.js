import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('On the air')
})

client.on('messageCreate', (message) => {
    if (message.content.toLowerCase() === 'milkis') {
        message.reply({
            content: ':coffee:',
            allowedMentions: {repliedUser: false}
        })
    }
})

client.login(process.env.TOKEN)