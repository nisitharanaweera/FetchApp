
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser =  async(req,res)=>{
    const { name, email, password} = req.body;
    const isNewUser = await User.isThisEmailInUse(email);
    
    if(!isNewUser)
        return res.json({
            success:false,
            message:'Email already in use, Please Log In',
        });

    
    const user = await User({
        name,
        email,
        password,

    });
    user.save(); 
    res.json(user);
};

exports.userSignIn = async (req,res)=>{
    const {email,password} = req.body;
    const user  = await User.findOne({email});

    if(!user) return res.json({success: false, message:'User not found, proceed to SignUp'});

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
        return res.json({
         success: false,
         message: 'email and password do not match',
    });
   const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:'1d'});

    res.json({success:true, user, token});
}