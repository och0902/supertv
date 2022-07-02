var mongoose = require('mongoose');
var Counter = require('./counterDB.js');

// schema
var articleSchema = mongoose.Schema({
   numId:{type:Number},
   catagory:{type:String},
   title:{type:String, required:[true,'제목을 입력해 주세요 !']},
   content:{type:String, required:[true,'내용을 입력해 주세요 !']},
   writer:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
   views:{type:Number, default:0},
   createdAt:{type:Date, default:Date.now},
   updatedAt:{type:Date},
});

articleSchema.pre('save', async function (next){
   var article = this;
   if(article.isNew){
      counter = await Counter.findOne({name:'articles'}).exec();
      if(!counter) counter = await Counter.create({name:'articles'});
      counter.count++;
      counter.save();
      article.numId = counter.count;
   }
   return next();
});

// model & export
var Article = mongoose.model('article', articleSchema);
module.exports = Article;