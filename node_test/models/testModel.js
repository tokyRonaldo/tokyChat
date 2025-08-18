const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    title: {type: String,required : true},
    completed: {type: Boolean,default : false},
},
{timestamp : true}
);

module.exports = mongoose.model('Test', testSchema);