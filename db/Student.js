const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name:String,
    usn:String,
    sem:String,
    section:String
});
module.exports = mongoose.model("students",studentSchema);