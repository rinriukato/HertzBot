const mongoose = require('mongoose');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        await mongoose.connect(process.env.MONGO_URI, {
            keepAlive: true
        }) 
        console.log(`Intialized and ready! ${client.user.tag} is on the air!`);
    },
};