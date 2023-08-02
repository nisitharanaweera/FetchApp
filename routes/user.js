const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { createUser, userSignIn, uploadProfile } = require('../controllers/user');
const { validateUserSignUp, userValidation, validateUserSignIn } = require('../middlewares/validation/user');
const { isAuth } = require('../middlewares/auth');

const multer = require('multer');


const storage = multer.diskStorage({})
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
router.post('/upload-profile', isAuth, uploads.single('profile'), uploadProfile )
module.exports = router;