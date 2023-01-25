const connection = require('../config/db');
const hash = require('hash.js');

class User{
  constructor(row){
    this.row = row;
  }
  
  set name(name){
    if(name){
      connection.query("UPDATE user SET name=? WHERE email=?;--", [name,this.row.email], (err, res)=>{
        if(err) throw err;
        this.row.name = name
        return true;
      })
    }
  }
  set email(email){
    if(email){
      connection.query("UPDATE user SET email=? WHERE id=?;--", [email,this.row.id], (err, res)=>{
        if(err) throw err
        this.row.email = email
        return true;
      })
    };
  }
  set bio(bio){
    if(bio){
      connection.query("UPDATE user SET bio=? WHERE id=?;--", [bio,this.row.id], (err, res)=>{
          this.row.bio = bio;
          return true;
        })
    }
  }
  set avatar(avatar){
    if(avatar){
      connection.query("UPDATE user SET avatar=? WHERE id=?;--", [avatar,this.row.id], (err, res)=>{
          this.row.avatar = avatar;
          return true;
        })
    }
    return false;
  }
  set password(password){
    if(password){
      connection.query("UPDATE user SET password=? WHERE id=?;--", [hash.sha256(password).digest('hex'),this.row.id], (err, res)=>{
          this.row.password = password;
          return true;
        })
    }
    return false;
  }
  set access(access){
    if(access){
      connection.query("UPDATE user SET access=? WHERE id=?;--", [access, this.row.id], (err, res)=>{
          this.row.access = access;
          return true;
        })
      }
      return false;
  }
  get id (){
    return this.row.id;
  }
  
  get name (){
    return this.row.name;
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
  
  get avatar(){
    return this.row.avatar;
  }
  get access(){
    return this.row.access;
  }

  delete(callback){
    connection.query("DELETE FROM user u WHERE u.id=?;--", [this.row.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }

  static update(name, email, bio, avatar, id, callback){
    if(avatar == undefined || avatar ==''){
      connection.query('UPDATE user SET name=?, email=?, bio=? Where id=?', [name, email, bio, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
    }else{
      connection.query('UPDATE user SET name=?, email=?, bio=?, avatar=? Where id=?', [name, email, bio, avatar, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
    }
  }

  static create(name, password, email, callback){
    connection.query('INSERT INTO user(create_time, name, password, email) VALUES(?,?,?,?)', [new Date(), name, hash.sha256().update(password).digest('hex'), email], (err, res) => {
      if (err) throw err;
      callback(res);
    });
  }

  static findEmail(email, callback){
    connection.query('SELECT * FROM user WHERE email=? LIMIT 1', [email], (err, res) => {
      if (err) throw err;
      callback(new User(res[0]));
    })
  }

  static findName(name, callback){
    connection.query('SELECT * FROM user WHERE name=? LIMIT 1', [name], (err, res) => {
      if (err) throw err;
      callback(new User(res[0]));
    })
  }

  static findId(id, callback){
    connection.query('SELECT * FROM user WHERE id=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new User(res[0]));
    })
  }

  static all(callback){
    connection.query("SELECT * FROM user", (err, res) => {
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