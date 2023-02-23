const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const mySchema = new Schema({
     name : { type : String , require},
     password : {type : String , require},
     email : {type : String , require},
     rollnumber : {type : Number , require}
});

const Model = mongoose.model('register', mySchema)

module.exports = Model