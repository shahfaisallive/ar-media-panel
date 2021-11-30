const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "LSN23sds923knksdn0aswpcx32zxe312"

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isSuperAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
},
    {
        timestamps: true
    })

AdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

AdminSchema.methods.getToken = function () {
    return jwt.sign({ id: this._id, }, JWT_SECRET, {
        expiresIn: '3h'
    });
}


const Admin = mongoose.model('Admin', AdminSchema)
module.exports = Admin