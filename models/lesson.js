const connection = require('../config/db');
const User = require('./user');

class Lesson {
  constructor (row) {
    this.row = row;
  }

  get createAt() {
    return this.row.create_time;
  }
  get title() {
    return this.row.title;
  }
  get content() {
    return this.row.content;
  }
  get summary() {
    return this.row.summary;
  }
  get author() {
    return this.row.author;
  }

  static find(id, callback){
    connection.query('SELECT * FROM cour WHERE id=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new Lesson(res[0]));
    })
  }
}

module.exports = Lesson;