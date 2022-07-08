const express= require('express');
const router= express.Router();
const methodOverride= require('method-override');

const Article= require('./../models/article');
const Comment= require('./../models/Comment');
const {checkAuthenticated, checkPostAuth}= require('./../middlewares/authCheck');

router.use(checkAuthenticated);
router.use(methodOverride('_method'));

router.get('/', async (req, res) =>{
    try{
        const articles= await Article.find().populate("user").sort({createdAt: 'desc'});
        res.render('articles/base', {articles, currentUser: req.user});
    } catch(error){
        console.log(error);
        res.redirect('/auth/login');
    }
})

router.get('/new', (req, res) =>{ 
    res.render('articles/new', {article: new Article()});
})

router.get('/:id', async (req, res) =>{
    try{
        let article= await Article.findById(req.params.id).populate("user").populate("comments");
        if(article===null) return res.redirect('/articles');
        res.render('articles/show', {article, currentUser: req.user});
    } catch(error){
        console.log(error);
        res.redirect('/articles');
    }
})

router.post('/', async (req, res) =>{
    let currentUser= req.user;
    let article= new Article({
        title: req.body.title,
        description: req.body.description,
        user: req.user.id
    })
    try{
        article= await article.save();
        currentUser.blogs.push(article.id);
        currentUser= await currentUser.save();
        res.redirect(`/articles`);
    } catch(err){
        console.log(err);
        res.render('articles/new', {article});
    }
})

router.delete('/:id', checkPostAuth, async (req, res) =>{
    try{
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/articles');
    } catch(error){
        console.log(error);
        res.redirect('/articles');
    }
})

router.get('/edit/:id', checkPostAuth, async (req, res) =>{
    try{
        let article= await Article.findById(req.params.id);
        res.render('articles/edit', {article});
    } catch(error){
        console.log(error);
        res.redirect('/articles');
    }
})

router.put('/:id', checkPostAuth, async (req, res) =>{
    try {
        let article= await Article.findById(req.params.id);
        article.title= req.body.title;
        article.description= req.body.description.trim();
        article.createdAt= Date.now();

        article= await article.save();
        res.redirect(`/articles`);
    } catch (error) {
        console.log(error);
        res.redirect('/articles');
    }
})

router.post('/:id/addComment', async (req, res) =>{
    let newComment= new Comment({
        text: req.body.comment,
        userId: req.user.id,
        userName: req.user.name
    })
    try{
        newComment= await newComment.save()
        let article= await Article.findById(req.params.id);
        article.comments.push(newComment.id);
        article= await article.save();
        res.redirect(`/articles/${req.params.id}`);
    } catch(error){
        console.log(error);
        res.redirect(`/articles/${req.params.id}`);
    }
})

router.delete('/:blogId/:commentId', async (req, res) =>{
    try{
        let article= await Article.findById(req.params.blogId);
        let commentId= await article.comments.find(comment => {
            if(comment.toString()===req.params.commentId) return req.params.commentId;
        })
        await Comment.findByIdAndDelete(commentId);
        res.redirect(`/articles/${req.params.blogId}`);
    } catch(error){
        console.log(error);
        res.redirect('/articles');
    }
})

module.exports= router;