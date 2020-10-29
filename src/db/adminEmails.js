const mongoose = require('mongoose')
const adminEmailsSchema = new mongoose.Schema({
    aEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    }
}) 

const adminEmails = mongoose.model('adminEmails',adminEmailsSchema)
console.log('adminEmails called')
module.exports = adminEmails
//manually put emails in this collection in the database