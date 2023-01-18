const { emotes } = require('../assets');

function createAlignment(rating) {
    const defaultBarL = Array(10).fill(emotes.BAR_EMPTY);
    const defaultBarR = Array(10).fill(emotes.BAR_EMPTY);

    if (rating < 10 && rating > -10) {
        const barL = defaultBarL.join('').concat(emotes.BAR_CENTER);
        return addCapsToBar(barL.concat(defaultBarR.join('')));
    }


    // Build left side of alignment
    if (rating < 0) {
        const barR = defaultBarR.join('');
        const uncappedBar = emotes.BAR_CENTER.concat(barR);

        if (rating <= -100) {
            const barL = Array(10).fill(emotes.BAR_R).join('');
            return addCapsToBar(barL.concat(uncappedBar));

        } else {
            const barL = createLBar(rating, defaultBarL).join('');
            return addCapsToBar(barL.concat(uncappedBar));
        }
    
    // Build right side of alignment
    } else {
        const barL = defaultBarL.join('');
        const uncappedBar = barL.concat(emotes.BAR_CENTER);

        if (rating >= 100) {
            const barR = Array(10).fill(emotes.BAR_B).join('');
            return addCapsToBar(uncappedBar.concat(barR));

        } else {
            const barR = createRBar(rating, defaultBarR).join('');
            return addCapsToBar(uncappedBar.concat(barR));
        }
    }
}

function createRBar(rating, defaultBarR) {
    const numBars = Math.floor((rating / 10) % 10);

    if (rating >= 80) {
        for (let i = 0; i <= numBars; i++) {
            defaultBarR[i] = emotes.BAR_B;
        }

    } else if (rating >= 30 && rating < 80) {
        for (let i = 0; i <= numBars; i++) {
            defaultBarR[i] = emotes.BAR_G;
        }

    } else {
        for (let i = 0; i <= numBars; i++) {
            defaultBarR[i] = emotes.BAR_Y;
        }
    }

    return defaultBarR;
}

function createLBar(rating, defaultBarL) {
    const numBars = Math.floor(((-1 * rating) / 10) % 10);

    if (rating >= 80) {
        for (let i = 0; i <= numBars; i++) {
            defaultBarL[i] = emotes.BAR_R;
        }

    } else if (rating >= 30 && rating < 80) {
        for (let i = 0; i <= numBars; i++) {
            defaultBarL[i] = emotes.BAR_O;
        }

    } else {
        for (let i = 0; i <= numBars; i++) {
            defaultBarL[i] = emotes.BAR_Y;
        }
    }

    return defaultBarL.reverse();
}

function addCapsToBar(uncappedBar) {
    const cappedBar = emotes.BAR_END_L.concat(uncappedBar);
    return cappedBar.concat(emotes.BAR_END_R);
}

// Expected: Return a string of emotes that represent the user's alignment on the +2/-2 scale. Based on 100

module.exports = {
    createAlignment,
}