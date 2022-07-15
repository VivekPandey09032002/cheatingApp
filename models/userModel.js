import mongoose  from "mongoose";
import bcrypt from 'bcrypt'

const userGfs = new mongoose.Schema( {
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    sendMsg: [
    ],
    receiveMsg:[]
})

export const userGf = new mongoose.model("gfs",userGfs)


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    section : {
        type : String,
        required : true,
    },
    batch : {
        type : Number,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    cpassword :  {
        type : String,
        required : true,
    },


})

userSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12)
        this.cpassword = await bcrypt.hash(this.cpassword,12)
    }  
    next()
})


const User = new mongoose.model('user',userSchema)

export default User;