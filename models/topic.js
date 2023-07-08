const connection = require('../config/db');
const User = require('./user');
const TopicSubject = require('./topicSubject');

class Topic{
  constructor(row){
    this.row = row;
  }
  get id(){
    return this.row.idTopic;
  }
  
  get topicSubject(){
    return TopicSubject.findId(this.row.idTopicSubject, (res) =>{return res;});
  }
  set topicSubject(topicSubject){
    this.row.idsubjectName = topicSubject.id;
  }
  
  get probleme (){
    return this.row.probleme;
  }
  set probleme(probleme){
    this.row.probleme = probleme;
  }

  get title (){
    return this.row.title;
  }
  set title(title){
    this.row.title = title;
  }

  get create_time (){
    return this.row.create_time;
  }

  delete(callback){
    connection.query("DELETE FROM Topic ts WHERE t.idTopic=?;--", [this.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }

  update(){
    connection.query('UPDATE Topics SET idTopicSubject=?, title=?, probleme=? Where id=?', [this.row.idsubjectName, title, probleme, id], (err, res) => {
      if (err) throw err;
      callback(res);
    })
  }

  static create(idTopicSubject, title, probleme, callback){
    connection.query('INSERT INTO Topics(create_time, idTopicSubject, title, probleme) VALUES(?,?,?,?,?)', [new Date(), idTopicSubject, title, probleme], (err, res) => {
      if (err) throw err;
      callback(res);
    });
  }

  static findId(idTopic, callback){
    connection.query('SELECT * FROM Topics WHERE idTopic=? LIMIT 1', [idTopic], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }
  static findTitle(title, callback){
    connection.query('SELECT * FROM Topics WHERE title=? LIMIT 1', [title], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }

  static all(callback){
    connection.query("SELECT * FROM Topics", (err, res) => {
      if(err) throw err;
      let result = [];
      for(const row of res){
        result.push(new User(row))
      }
      callback(result)
    })
  }

}

module.exports = Topic;