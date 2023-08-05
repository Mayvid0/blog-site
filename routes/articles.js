const express= require('express')
const router= express.Router()
const mongo = require('mongoose')
const Article= require('./../models/articles')
const { default: mongoose } = require('mongoose')
require('dotenv').config()


router.get('/new', (req,res)=>{
    res.render('articles/new', {article : new Article()})
})

router.get('/edit/:id', async (req, res) => {
    try {
      const article = await Article.findById( req.params.id);
      if (!article) {
        return res.status(404).send('Article not found');
      }
      res.render('articles/edit', { article: article });
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching the article.');
    }
  });
  
  

router.get('/:slug',async (req,res)=>{
    const article=  await Article.findOne({slug: req.params.slug})
    if(article== null)  res.redirect('/')
    res.render('articles/show', {article: article})
})

router.post('/', async (req,res,next)=>{
    req.article= new Article()
    next()
},saveArticleAndRedirect('new'))

router.put('/:id', async (req,res,next)=>{
   req.article= await Article.findById( req.params.id )
    next()
},saveArticleAndRedirect('edit'))


//but the question is ki hum isse invoke kaisse krenge , cuz link invokes "GET" and form invokes "POST"
//need a library method-override

router.delete('/:id',async (req,res)=>{
    if(req.params.id == process.env.id){
      res.status(403).send("Ha!! u really thought. U can't delete this");
    }
    else{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
    }
    
  })

function saveArticleAndRedirect(path){
    return async (req,res)=>{
      let article= req.article
      if(req.params.id !== process.env.id){       
        article.title= req.body.title
        article.description= req.body.description
        article.markdown = req.body.markdown
        if(path=='new' ){
          article.author= req.body.author
        }
      }
    try{
        article= await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch(err){
        console.log(err)
        res.render(`articles/${path}`, {article: article})
        } 
    }
}
  

module.exports= router