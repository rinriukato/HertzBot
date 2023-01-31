const mongoose = require('mongoose');
const { mongoUrl } = require('../config.json')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        try {
            await mongoose.connect(mongoUrl, {
                keepAlive: true
            }) 
        } catch (err) {
            console.log(err);
        }

        console.log(`Intialized and ready! ${client.user.tag} is on the air!`);
    },
};