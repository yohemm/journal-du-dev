const { format } = require('path');
const connection = require('../config/db');
const User = require('./user');
const lessonSelect = "SELECT co.*, cu.ordre, nb.* FROM cour co LEFT JOIN cursus cu ON co.id=cu.cour LEFT JOIN (SELECT COUNT(cour) nb_cours, c.formation formationId, f.title formationTitle FROM cursus c JOIN formation f ON f.id=c.formation GROUP BY c.formation) nb ON nb.formationId=cu.formation";
class Formation{
  constructor(row){
    this.row = row;
  }

  set title(title){
    if(title){
      connection.query("UPDATE formations SET title=? WHERE idFormation=?;--", [title, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.title = title;
        return true;
      })
    }
    return false;
  }
  set description(description){
    if(description){
      connection.query("UPDATE formations SET description=? WHERE idFormation=?;--", [description, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.description = description;
        return true;
      })
    }
    return false;
  }
  set difficulty(difficulty){
    if(difficulty){
      connection.query("UPDATE formations SET difficulty=? WHERE idFormation=?;--", [difficulty, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.difficulty = difficulty;
        return true;
      })
    }
    return false;
  }
  get createAt(){
    return this.row.create_time;
  }

  get title(){
    return this.row.title;
  }

  get description(){
    return this.row.description;
  }

  get difficulty(){
    return this.row.difficulty;
  }
  get creator(){
    return User.findId(this.row.idCreator, (res) => {
      return res;
    });
  }

  get id(){
    return this.row.idFormation;
  }

  cours(callback) {
    connection.query(lessonSelect + ' WHERE cu.formation=?;', [this.row.id], (err, res) => {
      if (err) throw err;
      let list = []
      res.forEach(row => {
        list.push(new Cour(row))        
      });
      callback(list)
    })    
  }
  
  delete(callback){
    connection.query("DELETE FROM Formations f WHERE f.idFormation=?;--", [this.row.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }

  static find(id, callback){
    connection.query('SELECT * FROM Formations WHERE idFormation=? LIMIT 1;--', [id], (err, res) => {
      if (err) throw err;
      callback(new Formation(res[0]));
    });
  }

  static findIdFormationCour(idFormation, callback){
    connection.query('SELECT DISTINCT c.id FROM formation f JOIN cursus c ON f.id=c.formation WHERE f.id=? ORDER BY c.ordre ASC;', [idFormation], (err, res) => {
      if (err) throw err;
      callback(res);
    })
  }

  static create(title, desc, difficulty, user,callback){
    connection.query('INSERT INTO Formations(create_time, title, description, difficulty, idCreator) VALUES (?,?,?,?)',[new Date(), title, desc,difficulty, user.id], (err, res) =>{
      if(err) throw err;
      console.log("creation Fomation")
      callback(res);
    });
  }

  static all(callback){
    connection.query('SELECT * FROM Formations', (err, res) => {
      if(err) throw err;
      let result = [];
      for(const row of res){
        result.push(new Formation(row));
      }
      callback(result)
    })
  }
}
module.exports.Formation = Formation;