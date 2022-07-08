const Article= require('./../models/article');

const checkAuthenticated= (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/auth/login');
}

const checkPostAuth= async (req, res, next) =>{
    const article= await Article.findById(req.params.id).populate("user");
    if(article.user.id==req.user.id){
        return next();
    }
    res.redirect(`/articles/${req.params.id}`);
}

module.exports= {checkAuthenticated, checkPostAuth};