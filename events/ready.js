module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Intialized and ready! ${client.user.tag} is on the air!`);
    },
};