const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.isAuth =  async (req, res, next) =>{
    if(req.headers && req.headers.authorization){

        const token = req.headers.authorization.split(' ')[1]

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decode.userId);
        
            if(!user){
                return res.json({success:false,message:'Unauthorized Access'});
            }
            req.user = user;
            next();
            
        } catch (error) {
            if(error.name ==='JsonWebTokenError'){
                return res.json({ success:false,message:'Unauthorized Accsess'});
            }
            if(error.name ==='TokenExpiredError'){
                return res.json({ success:false,message:'Session Expired. Sign In'});
            }
            res.json({ success:false,message:'Server Error'});
        }
        
    }else{
        res.json({success:false, message: 'Unauthorized Access'})
    }

};