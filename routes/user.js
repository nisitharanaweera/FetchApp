const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { createUser, userSignIn } = require('../controllers/user');
const { validateUserSignUp, userValidation, validateUserSignIn } = require('../middlewares/validation/user');
const { isAuth } = require('../middlewares/auth');
const sharp = require('sharp');
const multer = require('multer');


const storage = multer.memoryStorage();
const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb('invalid image',false);
    }
}


const uploads = multer({storage: storage,fileFilter });

router.post('/sign-in', validateUserSignIn, userValidation, userSignIn);
router.post('/create-user',validateUserSignUp,userValidation, createUser);

// router.post('/create-post', isAuth,(req,res)=>{
//     res.send('accessed secret route');
// })
router.post('/upload-profile', isAuth, uploads.single('profile'), async (req,res)=>{
    const {user}= req
    if(!user) return res. status(401).json({success: false, message: 'Unauthorised Access'});
    
    try {
        const profilebuffer = req.file.buffer;
        const {width, height} = await sharp(profilebuffer).metadata();
        const avatar = await sharp(profilebuffer).resize(Math.round(width*0.5),Math.round(height*0.5)).toBuffer()
    
        await User.findByIdAndUpdate(user._id,{avatar});
        res.status(201).json({success:true,message:'Profile Image Updated'});
    } catch (error) {
        res.status(500).json({success:false,message:'Server Error, Profile Image Unchanged'});

        console.log('Error Uploading the Profile Image',error.message);
        
    }
    
})
module.exports = router;