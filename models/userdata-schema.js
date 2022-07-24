const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    "user_id": {
        type: Number,
        required: true,
    },
    "username": {
        type: String, 
        required: true
    },
    "guild_id": {
        type: Number,
        required: true
    },
    "scores": {
        "postive_score": {type: Number, default: 0},
        "rinri_positive_score": {type: Number, default: 0},
        "negative_score": {type: Number, default: 0},
        "rinri_negative_score": {type: Number, default: 0},
    },
    "cooldown": {

    },
    "drinks_ordered": {
        "milkis": {type: Number, default: 0},
        "tea": {type: Number, default: 0},
        "milk": {type: Number, default: 0},
        "coffee": {type: Number, default: 0},
        "juice": {type: Number, default: 0},
        "soda": {type: Number, default: 0},
        "water": {type: Number, default: 0},
    }
})

module.exports = mongoose.model('testing', schema)