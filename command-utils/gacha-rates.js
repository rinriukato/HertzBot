// Rates
const ULTRA_RARE = 0.001;
const SUPER_RARE = 0.003;
const RARE = 0.01;
const UNCOMMON = 0.35;
//const COMMON = 0.5;


function gachaResult () {
    const result = Math.random();
    console.log(result);

    if (result <= ULTRA_RARE) return 'Ultra Rare'
    if (result <= SUPER_RARE) return 'Super Rare';
    if (result <= RARE) return 'Rare';
    if (result <= UNCOMMON) return 'Uncommon';
    if (result > UNCOMMON) return 'Common';

}

module.exports = {
    gachaResult
}