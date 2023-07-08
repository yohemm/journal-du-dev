const connection = require('../config/db');
const hash = require('hash.js');

class User{
  constructor(row){
    this.row = row;
  }
  
  set pseudo(pseudo){
    if(pseudo){
      connection.query("UPDATE Users SET pseudo=? WHERE email=?;--", [pseudo,this.row.email], (err, res)=>{
        if(err) throw err;
        this.row.pseudo = pseudo
        return true;
      })
    }
  }
  set email(email){
    if(email){
      connection.query("UPDATE Users SET email=? WHERE id=?;--", [email,this.row.id], (err, res)=>{
        if(err) throw err
        this.row.email = email
        return true;
      })
    };
  }
  set bio(bio){
    if(bio){
      connection.query("UPDATE Users SET bio=? WHERE id=?;--", [bio,this.row.id], (err, res)=>{
          this.row.bio = bio;
          return true;
        })
    }
  }
  set profilePicture(profilePicture){
    if(profilePicture){
      connection.query("UPDATE Users SET profilePicture=? WHERE id=?;--", [profilePicture,this.row.id], (err, res)=>{
          this.row.profilePicture = profilePicture;
          return true;
        })
    }
    return false;
  }
  set password(password){
    if(password){
      connection.query("UPDATE Users SET password=? WHERE id=?;--", [hash.sha256(password).digest('hex'),this.row.id], (err, res)=>{
          this.row.password = password;
          return true;
        })
    }
    return false;
  }
  set pass(pass){
    if(pass){
      connection.query("UPDATE Users SET pass=? WHERE id=?;--", [pass, this.row.id], (err, res)=>{
          this.row.pass = pass;
          return true;
        })
      }
      return false;
  }
  get id (){
    return this.row.id;
  }
  
  get pseudo (){
    return this.row.pseudo;
  }
  get bio (){
    return this.row.bio;
  }
  
  get create_time (){
    return this.row.create_time;
  }
  
  get password(){
    return this.row.password;
  }
  
  get email(){
    return this.row.email;
  }
  
  get profilePicture(){
    return this.row.profilePicture;
  }
  get pass(){
    return this.row.pass;
  }

  delete(callback){
    connection.query("DELETE FROM Users u WHERE u.id=?;--", [this.row.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }

  static update(pseudo, email, bio, profilePicture, id, callback){
    if(profilePicture == undefined || profilePicture ==''){
      connection.query('UPDATE Users SET pseudo=?, email=?, bio=? Where id=?', [pseudo, email, bio, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
    }else{
      connection.query('UPDATE Users SET pseudo=?, email=?, bio=?, profilePicture=? Where id=?', [pseudo, email, bio, profilePicture, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
    }
  }

  static create(pseudo, password, email, callback){
    connection.query('INSERT INTO Users(create_time, pseudo, password, email) VALUES(?,?,?,?)', [new Date(), pseudo, hash.sha256().update(password).digest('hex'), email], (err, res) => {
      if (err) throw err;
      callback(res);
    });
  }

  static findEmail(email, callback){
    connection.query('SELECT * FROM Users WHERE email=? LIMIT 1', [email], (err, res) => {
      if (err) throw err;
      callback(new User(res[0]));
    })
  }

  static findName(pseudo, callback){
    connection.query('SELECT * FROM Users WHERE pseudo=? LIMIT 1', [pseudo], (err, res) => {
      if (err) throw err;
      callback(new User(res[0]));
    })
  }

  static findId(id, callback){
    connection.query('SELECT * FROM Users WHERE id=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new User(res[0]));
    })
  }

  static all(callback){
    connection.query("SELECT * FROM Users", (err, res) => {
      if(err) throw err;
      let result = [];
      for(const row of res){
        result.push(new User(row))
      }
      callback(result)
    })
  }

}

module.exports = User;