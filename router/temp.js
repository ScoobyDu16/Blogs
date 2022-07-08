const mongoose= require('mongoose');
const User= require('./../models/User');

const findUser= async (email) =>{
    let foundUser= await User.findOne({email})
    console.log(foundUser);
}
findUser('a@a');