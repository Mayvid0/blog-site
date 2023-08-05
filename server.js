const express= require('express')
const app = new express()
const Article= require('./models/articles')
const articleRouter= require('./routes/articles')
const methodOverride = require('method-override')
const mongoose= require('mongoose')
require('dotenv').config();

const mongoURL= process.env.mongourl;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.set('view engine','ejs')

// app.get('/',async(req,res)=>{
    
//     const articles= await Article.find().sort({ dateCreated: 'desc'})
//     res.render('articles/index', {articles : articles})  //hum bhej skte hain koi bhi object to be rendered
// })

app.get('/', async (req, res) => {
  const specificArticleId = '64ce4e6a2e465a0034d4cc92';

  const specificArticle = await Article.findById(specificArticleId);
  const otherArticles = await Article.find({ _id: { $ne: specificArticleId } }).sort({ dateCreated: 'desc' });

  const articles = [specificArticle, ...otherArticles];

  res.render('articles/index', { articles: articles });
});


app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method')) //to override POST with delete wherever we mention this (not get cuz 
//fir saara delete kr dega)


app.use('/articles', articleRouter)
const port= process.env.PORT || 3000

app.listen(port, ()=>{
    console.log("server listening at: ", port)
})