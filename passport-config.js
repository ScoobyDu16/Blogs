const LocalStrategy= require('passport-local').Strategy;
const bcrypt= require('bcrypt');

const initialisePassport= (passport, getUserByEmail, getUserById) =>{
    const authenticateUser= async (email, password, done) =>{
        try{
            const user= await getUserByEmail(email);
            if(user===null){
                return done(null, false, {message: 'Enter Valid Credentials to Continue.'});
            }
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            } else{
                return done(null, false, {message: 'Enter Valid Credentials to Continue.'});
            }
        } catch(error){
            return done(error);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        let tempUser= await getUserById(id);
        return done(null, tempUser);
    });
}

module.exports= initialisePassport;