const connection = require('../config/db');
const moment = require('../config/moment')

const comQuery = 'SELECT c.create_time, c.content, u.name author, cr.title cour, c.id_cour idCour, c.id_user idUser FROM comment c JOIN user u ON u.id=c.id_user JOIN cour cr ON c.id_cour=cr.id';

class Commentary {
  constructor(row) {
    this.row = row;
  }

  get content () {
    return this.row.content
  }

  get createdAt () {
    return moment(this.row.create_time)
  }

  get author () {
    return this.row.author
  }
  get idUser () {
    return this.row.author
  }
  get idCour () {
    return this.row.idCour
  }
  get cour () {
    return this.row.cour
  }
  
  delete(callback){
    connection.query("DELETE FROM comment c WHERE c.id=?;--", [this.row.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }

  static create(content, idUser, idLesson, callback) {
     connection.query('INSERT INTO comment(content, id_user, id_cour, create_time) VALUES(?,?,?,?)', [content, idUser, idLesson, new Date()] , (err, res) => {
      if (err) throw err;
      callback(res);
     });
  }

  static commentInLesson(idLesson, callback) {
    connection.query(comQuery+' WHERE c.id_cour=?',[idLesson], (err, res) => {
      if (err) throw err;
      callback(res.map((row) => new Commentary(row)));
    })
  }

  static all(callback){
    connection.query(comQuery+" ORDER BY c.create_time DESC",(err, res) => {
      if(err) throw err
      callback(res.map((row) => new Commentary(row)));
    })
  }
}

module.exports = Commentary;