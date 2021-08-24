const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://kalishaikh:YycC4Jt084ze91RR@fooddb.a4ga6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser : true, useUnifiedTopology : true}, function(err,db){
    if (err){
        console.log("Unable to connect to mongo");
    }
    else {
        console.log('Connected to Server');
    }
});

module.exports = {
    mongoose
};