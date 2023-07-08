const { format } = require('path');
const connection = require('../config/db');
const User = require('./user');
const Formation = require('./formation');
const lessonSelect = "SELECT co.*, cu.ordre, nb.* FROM Lessons co LEFT JOIN Cursus cu ON co.idLesson=cu.idLesson LEFT JOIN (SELECT COUNT(Lessons) nb_Lessons, c.formation formationId, f.title formationTitle FROM cursus c JOIN formation f ON f.id=c.formation GROUP BY c.formation) nb ON nb.idFormation=cu.idFormation";

class Lessons {
  constructor (row) {
    this.row = row;
  }

  set title(title){
    if(title){
      connection.query("UPDATE Lessons SET title=? WHERE id=?;--", [title, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.title = title;
        return true;
      })
    }
    return false;
  }
  set content(content){
    if(content){
      connection.query("UPDATE Lessons SET content=? WHERE id=?;--", [content, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.content = content;
        return true;
      })
    }
    return false;
  }
  set author(author){
    if(author){
      connection.query("UPDATE Lessons SET author=? WHERE id=?;--", [author.id, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.author = author;
        return true;
      })
    }
    return false;
  }
  set description(description){
    if(description){
      connection.query("UPDATE Lessons SET description=? WHERE idLesson=?;--", [description, this.row.idLesson], (err, res)=>{
        if (err) throw err;
        this.row.description = description;
        return true;
      })
    }
    return false;
  }
  set formation(formation){
    if(description){
      connection.query("UPDATE Lessons SET idFormation=? WHERE idLesson=?;--", [formatio.id, this.row.idLesson], (err, res)=>{
        if (err) throw err;
        this.row.description = description;
        return true;
      })
    }
    return false;
  }
  set order(order){
    if(this.formation != null){
      if(cursus(this) != null && cursus(this).length()>0){
        if(description){
          connection.query("UPDATE Lessons SET idFormation=? WHERE idLesson=?;--", [formatio.id, this.row.idLesson], (err, res)=>{
            if (err) throw err;
            this.row.description = description;
            return true;
          })
      }}}
    return false;
  }
  
  get id(){
    return this.row.idLesson;
  }
  
  get title() {
    return this.row.title;
  }
  
  get content() {
    return this.row.content;
  }
  
  get description() {
    return this.row.description;
  }
  
  get difficulty() {
    return this.row.difficulty;
  }
  
  get author() {
    return User.findId(this.row.idCreator);
  }
  
  get order() {
    return this.row.ordre;
  }
  
  get formation() {
    return Formation.Formation.find(this.row.idFormation);
  }


  get create_time (){
    return this.row.create_time;
  }

  static cursus(formation){
    connection.query('SELECT * FROM Lessons l WHERE Lessons.idFormation=? ORDER BY l.order, l.create_time', [formation.id], (err, res) => {
      if(err) throw err;
        const a = [];
        res.foreach(line => {
          a.push(Formation.find(line.formation, (formation) => {
            return formation;
          }));
        });
        return a;
   })
  }
  static cursus(cour){
    connection.query('SELECT * FROM Lessons l WHERE Lessons.idFormation=? ORDER BY l.order, l.create_time', [cour.formation.id], (err, res) => {
      if(err) throw err;
      const a = [];
      res.foreach(line => {
        a.push(Formation.find(line.formation, (cours) => {
          return cours;
        }));
      });
      return a;
    });
  }

  delete(callback){
    connection.query("DELETE FROM Lessons c WHERE c.idFormation=?;--", [id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }
  static find(id, callback){
    connection.query('SELECT * FROM Lessons WHERE idFormation=? LIMIT 1;--', [id], (err, res) => {
      if (err) throw err;
      callback(new Lessons(res[0]));
    })
  }
  
  static allId(callback){
    connection.query('SELECT idFormation FROM Lessons;--', (err, res) => {
      if (err) throw err;
      callback(res);
    })
  }
  static all(callback){
    connection.query("SELECT * FROM Lessons;--", (err, res) => {
      if (err) throw err;
      let result = [];
      for(const row of res){
        result.push(new Lessons(row))
      }
      callback(result);
    })
  }
  

  static create(title,idFormation, ordre, idCreator, description,callback){
    connection.query('INSERT INTO Lessons(create_time, title, idFormation, ordre, idCreator, description) VALUES (?,?,?,?,?,?,?)',[new Date(), title, idFormation, ordre, idCreator, description], (err, res) =>{
      if(err) throw err;
      console.log("creation Lessonss")
      callback(res);
    });
  }
}
module.exports.Lessons = Lessons;