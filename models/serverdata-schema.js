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
    "chain_attack_info": {
        "is_chain_active": {
            type: Boolean,
            default: false,
        },
        "current_chain_level": {
            type: Number, 
            default: 0,
        },
        "chain_target": {
            type: Number,
            default: null,
        },
        "most_recent_message_target": {
            type: Number,
            default: null,
        },
        "total_chain_attacks": {
            type: Number,
            default: 0,
        },
        "current_damage_dealt": {
            type: Number,
            default: 0,
        },
        "current_party_members": [],
    },
    "server_chain_stats": {
        "total_server_chains": {
            type: Number,
            default: 0,
        },
        "total_server_max_chains": {
            type: Number,
            default: 0,
        }
    },
    "server_drink_stats": {
        "favorite_drink": {type: String, default: ''},
        "milkis": {type: Number, default: 0},
        "tea": {type: Number, default: 0},
        "milk": {type: Number, default: 0},
        "coffee": {type: Number, default: 0},
        "juice": {type: Number, default: 0},
        "soda": {type: Number, default: 0},
        "water": {type: Number, default: 0},
    }
})

module.exports = mongoose.model('serverData', serverSchema)