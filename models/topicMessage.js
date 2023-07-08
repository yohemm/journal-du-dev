const connection = require('../config/db');
const User = require('./user');
const Topic = require('./topic');
const { findById } = require('./MessageRepport');
class TopicMessage{
  constructor(row){
    this.row = row;
  }
  update() {
    
  }
  get id(){
    return this.row.idMessageTopic;
  }
  get reponseMessage(){
    return TopicMessage.findId(this.row.idReponseMessage, (res)=> {
      return res;
    });
  }

  set reponseMessage(message){
    this.row.ididMessage = message.id;
  }
  get topic(){
    return Topic.findId(this.row.topic, (res)=> {
      return res;
    });
  }

  set topic(topic){
    this.row.topic = idTopic.id;
  }
  get user(){
    return User.findId(this.row.idUser, (res)=> {
      return res;
    });
  }

  set user(user){
    this.row.idUser = user.id;
  }
  get content(){
    return this.row.content;
  }

  set content(message){
    this.row.content = content;
  }

  get create_time (){
    return this.row.create_time;
  }

  delete(callback){
    connection.query("DELETE FROM TopicMessages WHERE idMessageTopic=?;--", [this.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }

  static update(idReponseMessage, idTopic, idUser, content, id, callback){
      connection.query('UPDATE TopicMessages SET idReponseMessage=?, idTopic=?, idUser=?, content=? Where idMessageTopic=?', [idReponseMessage, idTopic, idUser, content, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
  }

  static create(idReponseMessage, idTopic, idUser, content, callback){
    connection.query('INSERT INTO TopicMessages(create_time, idReponseMessage, idTopic, idUser, content) VALUES(?,?,?,?,?)', [new Date(), idReponseMessage, idTopic, idUser, content], (err, res) => {
      if (err) throw err;
      callback(res);
    });
  }

  static findByUser(user, callback){
    connection.query('SELECT * FROM TopicMessages WHERE idUser=? LIMIT 1', [user.id], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }

  static findById(id, callback){
    connection.query('SELECT * FROM TopicMessages WHERE idMessageTopic=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }

  static findByMasterMessage(message, callback){
    connection.query('SELECT * FROM TopicMessages WHERE idReponseMessage=? LIMIT 1', [message.id], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }

  static all(callback){
    connection.query("SELECT * FROM TopicMessages", (err, res) => {
      if(err) throw err;
      let result = [];
      for(const row of res){
        result.push(new User(row))
      }
      callback(result)
    })
  }

}

module.exports = TopicMessage;