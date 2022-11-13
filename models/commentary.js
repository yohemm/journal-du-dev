const connection = require('../config/db');
const moment = require('../config/moment')

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
    return this.row.name
  }

  static create(content, idUser, idLesson, callback) {
     connection.query('INSERT INTO comment(content, id_user, id_cour, create_time) VALUES(?,?,?,?)', [content, idUser, idLesson, new Date()] , (err, res) => {
      if (err) throw err;
      callback(res);
     });
  }

  static commentInLesson(idLesson, callback) {
    connection.query('SELECT c.create_time, c.content, u.name  FROM comment c JOIN user u ON u.id=c.id_user WHERE c.id_cour=?',[idLesson], (err, res) => {
      if (err) throw err;
      callback(res.map((row) => new Commentary(row)));
    })
  }
}

module.exports = Commentary;