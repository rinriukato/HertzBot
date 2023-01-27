const { prizes } = require('../assets');

function getCommonPrize() {
    const numPrizes = prizes.COMMON_PRIZES.length;
    return prizes.COMMON_PRIZES[Math.floor(Math.random() * numPrizes + 1)];
}

module.exports = {
    getCommonPrize,
}