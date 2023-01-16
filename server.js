require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const hash = require('hash.js');
const connection = require('./config/db');
const Commentary = require('./models/commentary');
const User = require('./models/user');
const lesson = require('./models/lesson');
const port = 3000;
const path = require('node:path');
const { cp } = require('node:fs');
const upload = require('./middlewares/multer');


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

app.post('/user', upload.single("avatar"), (req, res) => {
  if(req.body.pseudo == undefined || req.body.pseudo == ''){
    console.log("error :Name")
    
  }else{
    if(req.body.email == undefined || req.body.email == ''){
      console.log("error :email")
      
    }else{
      User.update(req.body.pseudo, req.body.email, req.body.bio, req.file.filename, req.session.idUser, () =>{
        console.log("Modification reussit")
        res.redirect("/user")
      })
    }
  
  }

})
app.post('/cours', (req, res) => {
  if (req.body.condition == undefined || req.body.pseudo == ''){
    console.log('error: Name');
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
  if (req.body.condition == undefined || req.body.pseudo == ''){
    console.log('error: Name');
  }else if (req.body.comment == undefined || req.body.comment == ''){
    console.log('error: comment');
  }else{
    // pas d'erreur de formulaire
    Commentary.create(req.body.comment, req.session.idUser, req.params.id, () => {

      res.redirect('/cours/'+req.params.id)
    })
  }
})

app.post('/user/inscription', (req, res) => {
  if(req.body.name == undefined || req.body.name == ''){
    console.log('error: Name')
  } else if(req.body.email == undefined || req.body.email == ''){
    console.log('error: Email')
  } else if(req.body.password == undefined || req.body.password == ''){
    console.log('error: Pass')
  } else if(req.body.password == req.body.confirmpassword){
    console.log('Formulaire bon')
    User.create(req.body.name, req.body.password, req.body.email, () => {
      res.redirect('/user/connection');
    })
    
  } else {
    console.log('error: diferente pass')
  }
})

app.post('/user/connection', (req, res) => {
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
            res.redirect('/user/connection')
          }else {
            if(user.password == hash.sha256(req.body.password).digest('hex')){
              req.session.idUser = user.id;
              res.redirect('/')
            } else{
              console.log('mots de pass erroner')
              res.redirect('/user/connection')
            }
          }
        })


      }else {
        if(user.password == hash.sha256(req.body.password).digest('hex')){
          req.session.idUser = user.id;
          console.log('connection effectuer2')
          res.redirect('/')
        }else{
          console.log('mots de pass erroner2')
          res.redirect('/user/connection')
        }
      }
    })
  }
})

app.get('/', (req, res) => {
  avatar ='';
  if(req.session.idUser !== undefined && req.session.idUser !== ''){
  User.findId(req.session.idUser, (user) => {
    avatar = user.avatar;
    res.render('pages/index', {avatar: avatar});
  })
  }else {

    res.render('pages/index', {avatar: avatar});
  }
})

app.get('/cours', (req, res) => {      
      let avatar ='';
      lesson.Cour.all((allLessons) => {
        lesson.Formation.all((allFormation) => {
          if(req.session.idUser !== undefined && req.session.idUser !== ''){
            User.findId(req.session.idUser, (user) => {
              avatar = user.avatar;
              res.render('pages/lessons-container', {avatar:avatar, lessons : allLessons, formations : allFormation});
            })
          }else {
              res.render('pages/lessons-container', {avatar:avatar, lessons : allLessons, formations : allFormation});
          }
        })
      })
})


app.get('/cours/:id', (req, res) => {
  lesson.Cour.find(req.params.id, (cour) =>{
    if(req.session.idUser){
      Commentary.commentInLesson(req.params.id ,(commentaries)=>{
        avatar ='';
        if(req.session.idUser !== undefined && req.session.idUser !== ''){
          User.findId(req.session.idUser, (user) => {
            avatar = user.avatar;
            if (typeof cour.formationId !== 'undefined'){
              lesson.Formation.find(cour.formationId, (formation) => {
                formation.cours((cursus) => {
                  console.log(cursus)
                  res.render('pages/single-lesson', {avatar: avatar, commentaries : commentaries, lesson : cour, cursus : cursus});
                });
              });
            }else{
              res.render('pages/single-lesson', {avatar: avatar, commentaries : commentaries, lesson : cour});
            }
          })
        }else {
          if (typeof cour.formationId !== 'undefined'){
            lesson.Formation.find(cour.formationId, (formation) => {
              allCourFormation = formation.cours();
              res.render('pages/single-lesson', {avatar: avatar, commentaries : commentaries, lesson : cour, cursus : allCourFormation});
            });
          }else{
            res.render('pages/single-lesson', {avatar: avatar, commentaries : commentaries, lesson : cour});
          }
        }
      })
    }else{
      res.redirect('/user/connection');
    }
  })

  
})

app.get('/user/inscription', (req, res) => {
  avatar ='';
  if(req.session.idUser !== undefined && req.session.idUser !== ''){
  User.findId(req.session.idUser, (user) => {
    avatar = user.avatar;
    res.render('pages/inscription', {avatar:avatar});
  })
  }else {

    res.render('pages/inscription', {avatar:avatar});
  }
})

app.get('/user/connection', (req, res) => {
  avatar ='';
  if(req.session.idUser !== undefined && req.session.idUser !== ''){
  User.findId(req.session.idUser, (user) => {
    avatar = user.avatar;
    res.render('pages/connection', {avatar: avatar});
  })
  }else {

    res.render('pages/connection', {avatar: avatar});
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if (err) throw err;
    // cannot access session here
    req.session = undefined;
    res.redirect('/');
  });
})

app.get('/forum', (req, res) => {
  avatar ='';
  if(req.session.idUser !== undefined && req.session.idUser !== ''){
  User.findId(req.session.idUser, (user) => {
    avatar = user.avatar;
    res.render('pages/en-traveaux', {avatar: avatar});
  })
  }else {

    res.render('pages/en-traveaux', {avatar: avatar});
  }
})

app.get('/projet', (req, res) => {
  avatar ='';
  if(req.session.idUser !== undefined && req.session.idUser !== ''){
  User.findId(req.session.idUser, (user) => {
    avatar = user.avatar;
    res.render('pages/en-traveaux', {avatar: avatar});
  })
  }else {

    res.render('pages/en-traveaux', {avatar: avatar});
  }
})

app.get('/market', (req, res) => {
  avatar ='';
  if(req.session.idUser !== undefined && req.session.idUser !== ''){
  User.findId(req.session.idUser, (user) => {
    avatar = user.avatar;
    res.render('pages/en-traveaux', {avatar: avatar});
  })
  }else {

    res.render('pages/en-traveaux', {avatar: avatar});
  }
})

app.get('/user', (req, res) => {
  if(req.session.idUser){
    User.findId(req.session.idUser, (user) => {
      
  avatar ='';
  if(req.session.idUser !== undefined && req.session.idUser !== ''){
  User.findId(req.session.idUser, (user) => {
    avatar = user.avatar;
    res.render('pages/user-settings', {avatar:avatar ,user});
  })
  }else {

    res.render('pages/user-settings', {avatar:avatar ,user});
  }
    })
  }else{
    res.redirect('/user/connection')
  }
})



app.listen(port, ()=>{
  console.log(`App listennig on port ${port}`);
})