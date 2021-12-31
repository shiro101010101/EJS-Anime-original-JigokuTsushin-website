//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "人の世は縁と申します。結んだ糸が絡みつき、脆く（もろく）哀れな彼岸花。怒り、悲しみ、涙に暮れて、午前零時の帳（とばり）の向こう、晴らせぬ怨み、晴らします。";
const aboutContent = "人の世は縁と申します。結んだ糸が絡みつき、脆く（もろく）哀れな彼岸花。怒り、悲しみ、涙に暮れて、午前零時の帳（とばり）の向こう、晴らせぬ怨み、晴らします。";
const contactContent = "よんだ？この糸を解けば契約は成立,相手はすみやかに地獄に流されるわ。ただし人を呪わば穴二つ・・・。恨みを晴らすかわりにあなたの魂も死後地獄におちることになるわ。あとは、あなたがきめることよ。";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts=[];

app.get("/0hJigokutushin",function(req,res){
  res.render("0hJigokutushin",{
  posts:posts
  });
});

// app.get("/about",function(req,res){
//   res.render("about",{About:aboutContent});
// });
//
// app.get("/contact",function(req,res){
//   res.render("contact",{Contact:contactContent});
// });


app.get("/",function(req,res){
  res.render("home",{startingcontent :homeStartingContent});
});


app.post("/",function(req,res){
  const post = {title:req.body.requesttitle};
  posts.push(post);
  res.redirect("/0hJigokutushin");
});

// app.get("/posts/:postName",function(req,res){
//   const requestedTitle = _.lowerCase(req.params.postName);
//
//   posts.forEach(function(post){
//     const storedTitle =_.lowerCase(post.title);
//
//     if(storedTitle===requestedTitle){
//       res.render("post",{
//         title:post.title,
//         content:post.content
//       });
//     }
//   });
// });



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
