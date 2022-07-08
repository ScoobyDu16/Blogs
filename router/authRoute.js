const express= require('express');
const router= express.Router();
const User= require('./../models/User');
const bcrypt= require('bcrypt');
const passport= require('passport');
const methodOverride= require('method-override');

router.use(methodOverride("_method"));

router.get('/signup', async (req, res) =>{
    let users= await User.find();
    res.render('auth/signup', {users});
})

router.post('/signup', async (req, res) =>{
    try {
        let tempUser= new User();
        tempUser.name= req.body.name;
        tempUser.email= req.body.email;
        tempUser.password= await bcrypt.hash(req.body.password, 10);
    
        await tempUser.save()
        res.redirect('/auth/login');
    } catch (error) {
        console.log(error.message);
        res.redirect('/auth/signup');
    }
})

router.get('/login', async (req, res) =>{
    let users= await User.find();
    res.render('auth/login', {users});
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/articles',
    failureRedirect: '/auth/login',
    failureFlash: true,
    badRequestMessage: 'Something is not good.'
}))

router.delete('/logout', (req, res) =>{
    req.logout(req.user, err => {
        if(err){
            return res.send(err);
        }
        res.redirect("/auth/login");
    });
})

module.exports= router;