const mongoose = require('mongoose')

const TargetSchema = mongoose.Schema({
    imageName: {
        type: String,
        required: true
    },
    targetName: {
        type: String,
        required: true
    },
    date: {
        type: String
    }
},
    {
        timestamps: true
    })


const Target = mongoose.model('Target', TargetSchema)
module.exports = Target