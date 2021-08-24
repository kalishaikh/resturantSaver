const mongoose = require('mongoose');

//Schema creates a JSON object
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },

    name: {
        type: String,
        required: true,
        minlength: 1,
        trime: true
    },

    favouriteResturants: [{
        name: String,
        address: String
    }]
})

const User = mongoose.model('User', UserSchema);

module.exports = { User };
