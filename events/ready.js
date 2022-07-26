const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                keepAlive: true
            }) 
        } catch (err) {
            console.log(err);
        }

        console.log(`Intialized and ready! ${client.user.tag} is on the air!`);
    },
};