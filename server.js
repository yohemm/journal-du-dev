require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const hash = require('hash.js');
const connection = require('./config/db');
const Commentary = require('./models/commentary');
const User = require('./models/user');
const Lesson = require('./models/lesson');
const port = 3000;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*60*24,
    secure: false // true pour + de secu
  }
  // ,store pour securité
}))
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
// app.use(require('./middlewares/flash'));

app.post('/cours', (req, res) => {
  console.log(req)
  if (req.body.pseudo == undefined || req.body.pseudo == ''){
    console.log('error: Name');
  }else if(req.body.email == undefined || req.body.email == ''){
    console.log('error: Email');
  }else if (req.body.comment == undefined || req.body.comment == ''){
    console.log('error: comment');
  }else{
    // pas d'erreur de formulaire
    Commentary.create(req.body.comment, req.session.idUser, 3, () => {

      res.redirect('/cours')
    })
  }
})
app.post('/cours/:id', (req, res) => {
  console.log(req)
  if (req.body.pseudo == undefined || req.body.pseudo == ''){
    console.log('error: Name');
  }else if(req.body.email == undefined || req.body.email == ''){
    console.log('error: Email');
  }else if (req.body.comment == undefined || req.body.comment == ''){
    console.log('error: comment');
  }else{
    // pas d'erreur de formulaire
    Commentary.create(req.body.comment, req.session.idUser, req.params.id, () => {

      res.redirect('/cours/'+req.params.id)
    })
  }
})

app.post('/inscription', (req, res) => {
  if(req.body.name == undefined || req.body.name == ''){
    console.log('error: Name')
  } else if(req.body.email == undefined || req.body.email == ''){
    console.log('error: Email')
  } else if(req.body.password == undefined || req.body.password == ''){
    console.log('error: Pass')
  } else if(req.body.password == req.body.confirmpassword){
    console.log('Formulaire bon')
    User.create(req.body.name, req.body.password, req.body.email, () => {
      res.redirect('/connection');
    })
    
  } else {
    console.log('error: diferente pass')
  }
})

app.post('/connection', (req, res) => {
  if(req.body.userid == undefined || req.body.userid == ''){
    console.log('error: user')
  } else if(req.body.password == undefined || req.body.password == ''){
    console.log('error: password')

    
  } else {
    User.findEmail(req.body.userid, (user) => {
      if (user.row == undefined){

        User.findName(req.body.userid, (user) => {
          if (user.row == undefined){
            console.log('aucune donnée ne correspond');
            res.redirect('/connection')
          }else {
            if(user.password == hash.sha256(req.body.password).digest('hex')){
              req.session.idUser = user.id;
              res.redirect('/cours')
            } else{
              console.log('mots de pass erroner')
              res.redirect('/connection')
            }
          }
        })


      }else {
        if(user.password == hash.sha256(req.body.password).digest('hex')){
          req.session.user = user.id;
          console.log('connection effectuer2')
          res.redirect('/connection')
        }else{
          console.log('mots de pass erroner2')
          res.redirect('/connection')
        }
      }
    })
  }
})

app.get('/', (req, res) => {
  res.render('pages/index');
})

app.get('/cours', (req, res) => {
  if(req.session.idUser){
    Commentary.commentInLesson(3, (commentaries)=>{
      res.render('pages/single-lesson', {commentaries : commentaries});
    })
  }else{
    res.redirect('/connection');
  }
})

app.get('/cours/:id', (req, res) => {
  Lesson.find(req.params.id, (lesson) =>{
    if(req.session.idUser){
      Commentary.commentInLesson(req.params.id ,(commentaries)=>{
        res.render('pages/single-lesson', {commentaries : commentaries, lesson : lesson});
      })
    }else{
      res.redirect('/connection');
    }
  })

  
})

app.get('/inscription', (req, res) => {
  res.render('pages/inscription');
})

app.get('/connection', (req, res) => {
  res.render('pages/connection');
})

app.listen(port, ()=>{
  console.log(`App listennig on port ${port}`);
})