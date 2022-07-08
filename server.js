if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express= require('express');
const app= express();
const mongoose= require('mongoose');
const methodOverride= require('method-override');
const passport= require('passport');
const flash= require('express-flash');
const session= require('express-session');

const Article= require('./models/article');
const articleRoute= require('./router/articles');
const authRoute= require('./router/authRoute');
const User= require('./models/User');
const initialisePassport= require('./passport-config');

// mongoose.connect('mongodb://localhost:27017/blogs');

const connectDb= async () =>{
    try{
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch(err){
        console.error(err);
    }
}
connectDb();

const PORT= process.env.PORT || 5000;

app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/articles', articleRoute);
app.use('/auth', authRoute);

const getUserByEmail= async (email) =>{
    try{
        let foundUser= await User.findOne({email})
        return foundUser;
    } catch(error){
        console.log(error);
    }
}
const getUserById= async (id) =>{
    try{
        let foundUser= await User.findById(id)
        return foundUser;
    } catch(error){
        console.log(error);
    }
}

initialisePassport(
    passport,
    getUserByEmail,
    getUserById
)

app.get('/', (req, res) =>{
    res.redirect('/auth/signup');
})

mongoose.connection.once('open', () =>{
    console.log('Connected to mongodb');
    app.listen(PORT, () =>{console.log(`Blog Server is running on Port : ${PORT}`)})
})