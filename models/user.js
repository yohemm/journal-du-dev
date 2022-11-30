const connection = require('../config/db');
const hash = require('hash.js');

class User{
  constructor(row){
    this.row = row;
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
    connection.query('INSERT INTO user(create_time, name, password, email) VALUES(?,?,?,?)', [new Date(), name, hash.sha256(password).digest('hex'), email], (err, res) => {
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

}

module.exports = User;