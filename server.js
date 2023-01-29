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
const { time } = require('node:console');

var verifConnection = (req, res, callback)=>{
  if(req.session.idUser !== undefined && req.session.idUser !== ''){
    User.findId(req.session.idUser, (user) => {
      callback(user)
    })
  }else{
    res.redirect('/user/connection')
  }
}

var verifAcces = (req, res, access,callback)=>{
  verifConnection(req, res, (user) =>{
    if(user.access >= access){
      // Formation.all((formations => {
        callback();
      // }))
    }else{
      console.log("not acess!")
      res.redirect('/')
    }
  })
}
function user(){
  //* POST
  app.post('/user', upload.single("avatar"), (req, res) => {
    if(req.body.pseudo == undefined || req.body.pseudo == ''){
      console.log("error :Name")
      
    }else if(req.body.email == undefined || req.body.email == ''){
        console.log("error :email")
        
    }else{
      User.update(req.body.pseudo, req.body.email, req.body.bio, req.file.filename, req.session.idUser, () =>{
        console.log("Modification reussit")
        res.redirect("/user")
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
              if(user.password == hash.sha256().update(req.body.password).digest('hex')){
                req.session.idUser = user.id;
                res.redirect('/')
              } else{
                console.log('mots de pass erroner')
                res.redirect('/user/connection')
              }
            }
          })
        }else {
          if(user.password == hash.sha256().update(req.body.password).digest('hex')){
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

  //* GET
  
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
}

function cour(){
  //* POST
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

  //* GET

  app.get('/cours', (req, res) => {      
    let avatar ='';
    lesson.Cour.all((allCour) => {
      lesson.Formation.all((allFormation) => {
        if(req.session.idUser !== undefined && req.session.idUser !== ''){
          User.findId(req.session.idUser, (user) => {
            avatar = user.avatar;
            res.render('pages/lessons-container', {avatar:avatar, cours : allCour, formations : allFormation});
          })
        }else {
            res.render('pages/lessons-container', {avatar:avatar, cours : allCour, formations : allFormation});
        }
      })
    })
  })

  app.get('/cours/:id', (req, res) => {
    lesson.Cour.find(req.params.id, (cour) =>{
      verifConnection(req, res, () =>{
        Commentary.commentInLesson(req.params.id ,(commentaries)=>{
          avatar ='';
          if(req.session.idUser !== undefined && req.session.idUser !== ''){
            User.findId(req.session.idUser, (user) => {
              avatar = user.avatar;
              if (typeof cour.formationId !== 'undefined'){
                lesson.Formation.find(cour.formationId, (formation) => {
                  formation.cours((cursus) => {
                    res.render('pages/single-cour', {avatar: avatar, commentaries : commentaries, cour : cour, cursus : cursus});
                  });
                });
              }else{
                res.render('pages/single-cour', {avatar: avatar, commentaries : commentaries, cour : cour});
              }
            })
          }else {
            if (typeof cour.formationId !== 'undefined'){
              lesson.Formation.find(cour.formationId, (formation) => {
                cursus = formation.cours();
                res.render('pages/single-cour', {avatar: avatar, commentaries : commentaries, cour : cour, cursus : cursus});
              });
            }else{
              res.render('pages/single-cour', {avatar: avatar, commentaries : commentaries, cour : cour});
            }
          }
        })
      })
    })
  })
}

function admin(){
  //* POST
  app.post('/create-formation', (req,res) =>{
    if(!req.body.title){
      console.log("titre")
    }else if(!req.body.desc){
      console.log("desc")
    }else if(!req.body.difficulty){
      console.log("difficulty")
    }else{
      lesson.Formation.create(req.body.title,req.body.desc, req.body.difficulty,(result) => {
        res.redirect("/admin-formation");
      })
    }
  })

  app.post('/create-cour', (req, res) => {
    if(!req.body.author){
      console.log('author')
    }else if(!req.body.title){
      console.log('title')
    }else if(!req.body.summary){
      console.log('summ')
    }else if(!req.body.content){
      console.log('content')
    }else if(!req.body.time){
      console.log('time')
    }else if(!req.body.desc){
      console.log('desc')
    }else{
      lesson.Cour.create(req.body.author, req.body.title, req.body.desc, req.body.summary, req.body.content, req.body.time, (result)=>{
        console.log(res);
        res.redirect("admin-formation");
        
      })
    }
  })

  app.post('/update-cour/:id', (req, res) => {
    console.log("POST")
    if(!req.body.author){
      console.log('author')
    }else if(!req.body.title){
      console.log('title')
    }else if(!req.body.summary){
      console.log('summ')
    }else if(!req.body.content){
      console.log('content')
    }else{
      verifAcces(req,res, 4, ()=>{
        lesson.Cour.find(req.params.id, (cour)=>{
          cour.author = req.body.author;
          cour.title = req.body.title;
          cour.summary = req.body.summary;
          cour.content = req.body.content;
          cour.description = req.body.desc;
          cour.time = req.body.time;
          res.redirect("/admin-cour/"+cour.id);
        })
      })
    }
  })

  app.post('/update-formation/:id', (req, res) => {
    if(!req.body.title){
      console.log('title')
    }else if(!req.body.desc){
      console.log('desc')
    }else if(!req.body.difficulty){
      console.log('difficulty')
    }else{
      verifAcces(req,res, 4, ()=>{
        lesson.Formation.find(req.params.id, (formation)=>{
          formation.title = req.body.title;
          formation.description = req.body.desc;
          formation.difficulty = req.body.difficulty;
          res.redirect("/admin-formation/"+formation.id);
        })
      })
    }
  })

  app.post('/admin-user/:user', (req, res)=>{
    if(!req.body.name){
      console.log("name")
    }else if(!req.body.email){
      console.log("email")
    }else if(!req.body.access){
      console.log("access")
    }else{
      verifAcces(req, res, 4, ()=>{
        User.findId(req.params.user, (user)=>{
          User.findId(req.session.idUser, (admin)=>{
            user.name = req.body.name;
            user.email = req.body.email;
            user.bio = req.body.bio;
            user.access = req.body.access<=admin.access?req.body.access:admin.access;
            res.redirect('/admin-user')
          })
        })
      })
    }
  })
  
  //* GET

  app.get("/admin-panel", (req, res) => {
    verifAcces(req, res, 4 ,() => {
      res.render('pages/admin-panel');
    })
  })

  app.get("/admin-lesson", (req, res) => {
    verifAcces(req, res, 4 ,() => {
      lesson.Formation.all((formations)=>{
        lesson.Cour.all((cours)=>{
          res.render('pages/admin-lesson', {cours:cours, formations:formations});
        })
      })
    })
  })

  app.get("/admin-cour/:id", (req, res)=>{
    lesson.Cour.find(req.params.id, (cour)=>{
      verifAcces(req, res, 4, ()=>{
        res.render("partials/update-cour", {cour:cour})
      })
    })
  })

  app.get("/admin-formation/:id", (req, res)=>{
    lesson.Formation.find(req.params.id, (formation)=>{
      verifAcces(req, res, 4, ()=>{
        res.render("partials/update-formation", {formation:formation})
      })
    })
  })

  app.get("/admin-commentary", (req, res) => {
    verifAcces(req, res, 4 ,() => {
      Commentary.all((commentaries)=>{
        res.render('pages/admin-commentary', {commentaries:commentaries});
      })
    })
  })

  app.get("/admin-user", (req, res) => {
    verifAcces(req, res, 4,() => {
      User.all((users)=>{
        res.render('pages/admin-user', {users:users});
      })
    })
  })
}

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


app.get('/', (req, res) => {
  avatar ='';
  if(req.session.idUser != undefined){
      User.findId(req.session.idUser, (user) => {
        avatar = user.avatar;
        res.render('pages/index', {avatar: avatar});
      })
  }else
    res.render('pages/index', {avatar: avatar});
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
user()
cour()
admin()

app.listen(port, ()=>{
  console.log(`App listennig on port ${port}`);
})