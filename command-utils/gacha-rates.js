// Rates
const GIGA_RATE = 0.001;
const MEGA_RATE = 0.1;


function gachaResult () {
    const result = Math.random();
    
    if (result <= GIGA_RATE) return 'G';
    if (result <= MEGA_RATE) return 'M';
    if (result > MEGA_RATE) return 'S';

}

module.exports = {
    gachaResult
}