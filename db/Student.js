const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name:String,
    usn:String,
    sem:String,
    email:String
});
module.exports = mongoose.model("students",studentSchema);