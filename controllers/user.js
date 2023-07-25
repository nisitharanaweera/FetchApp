
const User = require('../models/user');
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