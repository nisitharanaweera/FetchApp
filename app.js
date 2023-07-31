const express = require('express');
require('dotenv').config()
require('./models/db');
const userRouter = require('./routes/user');

const User = require('./models/user');

const { Result } = require('express-validator');
const app = express();

app.use(express.json());
app.use(userRouter);

// const test = async (email, password)=>{
//     const user = await User.findOne({email:email});
//     const result = await user.comparePassword(password);
//     console.log(result);
// }
// test("ranaweera@gmail.com","RANDRanwera")
app.get('/', (req,res)=>{
    res.json({success:true, message:'Backend connected'});
});

app.listen(8000,()=> {
console.log('port listening');

});
