
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const cloudinary = require('../helper/imageUpload')

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


exports.uploadProfile = async (req,res)=>{
    const {user}= req
    if(!user) return res. status(401).json({success: false, message: 'Unauthorised Access'});
    
    

    try {
        const result = await cloudinary.uploader.upload(req.file.path,{
            public_id: `${user._id}_profile`,
            width:500,
            height:500,
            crop:'fill'
        });
        
        await User.findByIdAndUpdate(user._id,{avatar: result.url});
        res.status(201).json({success:true,message:'Profile Image Updated'});
    } catch (error) {
        res.status(500).json({success:false,message:'Server Error, Profile Image Unchanged'});

        console.log('Error Uploading the Profile Image',error.message);
        
    }
    
}