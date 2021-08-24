const mongoose = require('mongoose');

const ResturantSchema = new mongoose.Schema({

    favouriteResturants: [{
        name: String,
        address: String
    }]

})

const Resturant = mongoose.model('Resturant', ResturantSchema);

module.exports = { Resturant };
