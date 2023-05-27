import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,    
    },
    address: {
        type: String,    
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
})

const User = mongoose.model('User', userSchema)

export default User