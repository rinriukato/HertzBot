const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    "user_id": {
        type: Number,
        required: true,
    },
    "username": {
        type: String, 
        required: true
    },
    "discriminator": {
        type: String,
        required: true
    },
    "guild_id": {
        type: Number,
        required: true
    },
    "guild_name": {
        type: String,
        required: true
    },
    "battle_status": {
        "hp": {type: Number, default: 100},                     // Player's HP (MAX 100 default 100)
        "money": {type: Number, default: 0},                    // Player's money (default 0)
        "elem": {type: String, default: "fire"},                // Player's current elemental damage type
        "afflicted_elem": {type: String, default: null},        // Player's afflicted element from other player attacks
        "equip": {type: String},                                // Currently equipped weapon (i.e: Sword | Cannon | Barrier)
        "equip-expiry": {type: Number},                         // Timestamp til equip weapon expires (default 24-hours)
        "is_active": {type: Boolean, default: true},            // If true, player cannot attack
        "atk_cd": { type: Number},                              // Timestamp til player can attack again (default 1-hour)
        "hp_cd": { type: Number},                               // Timestamp til player is revive and HP set to 100 (default 24-hours)
        "money_cd": {type: Number},                             // Timestamp til player can reuse the money command (default 24-hours)
    },
    "battle_history": {
        "player_battle_init": {type: Number, default: 0},
        "self_del": {type: Number, default: 0},
        "players_del": {type: Number, default: 0},
        "virus_del": {type: Number, default: 0},
        "cards_used": {type: Number, default: 0},
    },
    "scores": {
        "pos_score": {type: Number, default: 0},           // Total accumlated +2s over time
        "rinri_pos_score": {type: Number, default: 0},     // Total accumlated rinri +2s over time
        "neg_score": {type: Number, default: 0},           // Total accumlated -2s over time
        "rinri_neg_score": {type: Number, default: 0},     // Total accumlated rinri -2s over time
    },
    "drinks_ordered": {                                         // Drink history of user
        "milkis": {type: Number, default: 0},
        "tea": {type: Number, default: 0},
        "bubble_tea": {type: Number, default: 0},
        "milk": {type: Number, default: 0},
        "coffee": {type: Number, default: 0},
        "juice": {type: Number, default: 0},
        "cola": {type: Number, default: 0},
        "water": {type: Number, default: 0},
    },
    "battle_cards": {
        "atk_cards": {
            "fire_dmg": {type: Number, default: 0},
            "elec_dmg": {type: Number, default: 0},
            "aqua_dmg": {type: Number, default: 0},
            "wood_dmg": {type: Number, default: 0},
        },
        "equip_cards": {
            "swd_dmg": {type: Number, default: 0},
            "gun_dmg": {type: Number, default: 0},
            "barrier": {type: Number, default: 0},
        },
        "swap_cards": {
            "fire_swap": {type: Number, default: 0},
            "elec_swap": {type: Number, default: 0},
            "aqua_swap": {type: Number, default: 0},
            "wood_swap": {type: Number, default: 0},
        },
        "support_cards": {
            "sml_hp": {type: Number, default: 0},
            "mid_hp": {type: Number, default: 0},
            "lrg_hp": {type: Number, default: 0},
            "refresh": {type: Number, default: 0},
            "rpd_revive": {type: Number, default: 0},
        },
    },

})

module.exports = mongoose.model('userData', userSchema)