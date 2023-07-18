const User = require('../models/User')

const registerUser = async (req, res, next) => {

    try {
        const {name, email, password } = req.body;

        //check if user exists
        let user = await User.findOne({email});

        if(user) {
            //return res.status(400).json({message: "User already registered"})
            throw new Error("User have already registered");
        }
         //creating a new user
         user = await User.create({
            name,
            email,
            password,
         })

         return res.status(201).json({
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            password: user.password,
            verified: user.verified,
            admin: user.admin,
            token: await user.generateJWT(),
         });

    } catch (error) {
       next(error);
    }
}

module.exports = { registerUser } 