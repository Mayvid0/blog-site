const mongoose = require('mongoose')
const marked= require('marked')
const slugify= require('slugify')
const createDomPurify = require('dompurify')  //so people cant run js in out markdown
const {JSDOM }= require('jsdom')  //cuz node cant run html on its own
const domPurify =  createDomPurify( new JSDOM('').window)


marked.setOptions({
    gfm: true,
    pedantic:true,
    mangle: false,
    headerIds: false,
    headerPrefix: false,
  });

const articleSchema= new mongoose.Schema({
    title: {
        type: String,
        required : true,
    },
    author:{
        type: String,
    },
    description:{
        type: String
    },
    markdown:{
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml:{
        type : String,
        required: true
    }
})

//this function would perform for every save, post,update etc..
//basically slug is to change the url to look more nicer , and lowercase, remove extra characters if any in title
articleSchema.pre('validate', function(next){
    if(this.title){
        this.slug = slugify(this.title, {lower : true , strict: true})  
    }
    if(this.markdown){
        this.sanitizedHtml= domPurify.sanitize(marked.parse(this.markdown))
    }
    next()
})
module.exports= mongoose.model('Article',articleSchema)