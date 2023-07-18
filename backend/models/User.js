const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
        avatar:{ type: String, deafault: ""},
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        verified: { type: Boolean, default: false },
        verificationCode: { type: String, required: false },
        admin: { type: Boolean, deafault: false },
    }, 
    { timestamps: true }
);

//to encript password
UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
        return next()
    }
    return next()
})

UserSchema.methods.generateJWT = async function(){
    return await jsonwebtoken.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: "30d",
    }
        
        )
}

const User = mongoose.model("User", UserSchema);

module.exports = User;