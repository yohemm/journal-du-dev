const connection = require('../config/db');
const User = require('./user');

class Warn{
  constructor(row){
    this.row = row;
  }
  update() {
    
  }
  get id (){
    return this.row.idwarn;
  }
  
  get emetor (){
    return this.row.emetor;
  }
  set emetor(emetor){
    this.row.idemetor = emetor.id;
  }
  
  get warned (){
    return this.row.warned;
  }
  set warned(warned){
    this.row.idwarned = warned.id;
  }

  get motif (){
    return this.row.motif;
  }
  set motif(motif){
    this.row.motif = motif;
  }

  get commentary (){
    return this.row.commentary;
  }
  set commentary(commentary){
    this.row.commentary = commentary;
  }
  
  get create_time (){
    return this.row.create_time;
  }

  delete(callback){
    connection.query("DELETE FROM Users u WHERE u.id=?;--", [this.row.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }

  static update(pseudo, email, bio, profilePicture, id, callback){
    if(profilePicture == undefined || profilePicture ==''){
      connection.query('UPDATE Warns SET pseudo=?, email=?, bio=? Where id=?', [pseudo, email, bio, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
    }else{
      connection.query('UPDATE Warns SET pseudo=?, email=?, bio=?, profilePicture=? Where id=?', [pseudo, email, bio, profilePicture, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
    }
  }

  static create(emetor, warned, motif,commentary, callback){
    connection.query('INSERT INTO Warns(create_time, emetor, warned, motif, commentary) VALUES(?,?,?,?,?)', [new Date(), emetor.getId(), warned.getId(), motif, commentary], (err, res) => {
      if (err) throw err;
      callback(res);
    });
  }

  static findEmetor(emetor, callback){
    connection.query('SELECT * FROM Warns WHERE idEmetor=? LIMIT 1', [emetor.geId()], (err, res) => {
      if (err) throw err;
      callback(new Warn(res[0]));
    })
  }

  static findWarned(warned, callback){
    connection.query('SELECT * FROM Warns WHERE idWarned=? LIMIT 1', [warned.geId()], (err, res) => {
      if (err) throw err;
      callback(new Warn(res[0]));
    })
  }

  static findId(id, callback){
    connection.query('SELECT * FROM Warns WHERE idWarn=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new User(res[0]));
    })
  }

  static all(callback){
    connection.query("SELECT * FROM Warns", (err, res) => {
      if(err) throw err;
      let result = [];
      for(const row of res){
        result.push(new User(row))
      }
      callback(result)
    })
  }

}

module.exports = Warn;