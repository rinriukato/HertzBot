const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    "guild_id": {
        type: Number,
        required: true
    },
    "guild_name": {
        type: String,
        required: true,
    },
    "wave_battle_status": {
        "is_battle_active": { type: Boolean, default: false },
        "trg_user_id": { type: Number, default: null },
        "trg_user_name": {type: String, default: null},
        "trg_msg_id": { type: Number, default: null },
        "combo_lvl": { type: Number,default: 0 },
        "battle_timer": { type: Number, default: null },
        "total_dmg": {type: Number, default: 0},
    },
    "wave_battle_history": {
        "total_player_wave_battles": {type: Number, default: 0},
        "players_del": {type: Number, default: 0},
        "virus_del": {type: Number, default: 0},
        "plus_twos_given": {type: Number, default: 0},
        "minus_twos_given": {type: Number, default: 0},
        "cards_used": {type: Number, default: 0},
    },
    "server_drink_stats": {
        "milkis": {type: Number, default: 0},
        "tea": {type: Number, default: 0},
        "bubble_tea": {type: Number, default: 0},
        "milk": {type: Number, default: 0},
        "coffee": {type: Number, default: 0},
        "juice": {type: Number, default: 0},
        "cola": {type: Number, default: 0},
        "water": {type: Number, default: 0},
    }
})

module.exports = mongoose.model('serverData', serverSchema)