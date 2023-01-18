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
        "money": {type: Number, default: 0},                    // Player's money (default 0)
        "atk_cd": { type: Number},                              // Timestamp til player can attack again (default 1-hour)
        "money_cd": {type: Number},                             // Timestamp til player can reuse the money command (default 24-hours)
    },
    "battle_history": {
        "player_battle_init": {type: Number, default: 0},
        "self_del": {type: Number, default: 0},
        "players_del": {type: Number, default: 0},
        "virus_del": {type: Number, default: 0},
    },
    "scores": {
        "pos_score": {type: Number, default: 0},           
        "rinri_pos_score": {type: Number, default: 0},     
        "neg_score": {type: Number, default: 0},           
        "rinri_neg_score": {type: Number, default: 0},     
    },
    "drinks_ordered": {                                         
        "milkis": {type: Number, default: 0},
        "tea": {type: Number, default: 0},
        "bubble_tea": {type: Number, default: 0},
        "milk": {type: Number, default: 0},
        "coffee": {type: Number, default: 0},
        "juice": {type: Number, default: 0},
        "cola": {type: Number, default: 0},
        "water": {type: Number, default: 0},
        "sake": {type: Number, default: 0}
    },

})

module.exports = mongoose.model('userData', userSchema)