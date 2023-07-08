const connection = require('../config/db');
const User = require('./user');
const TopicMessage = require('./topicMessage')

class MessageReport{
  constructor(row){
    this.row = row;
  }
  update() {
    
  }
  get id(){
    return this.row.idReportMessages;
  }
  
  get about(){
    return this.row.about;
  }
  set subjectName(about){
    this.row.about = about;
  }
  
  get description (){
    return this.row.description;
  }
  set description(description){
    this.row.description = description;
  }
  get create_time (){
    return this.row.create_time;
  }
  get reporter(){
    return User.findId(this.row.idTopic, (res)=> {
      return res;
    });
  }
  set reporter(user){
    this.row.idReporter = user.id;
  }
  
  get message(){
    return TopicMessage.findId(this.row.idTopic, (res)=> {
      return res;
    });
  }

  set Message(message){
    this.row.ididMessage = message.id;
  }

  get create_time (){
    return this.row.create_time;
  }

  delete(callback){
    connection.query("DELETE FROM MessageReports WHERE idReportMessages=?;--", [this.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }

  static update(idReportMessages, idReportMessages, idReportMessages, idReportMessages, id, callback){
      connection.query('UPDATE MessageReports SET about=?, description=?, idMessage=?, idReporter=? Where idReportMessages=?', [idReportMessages, idReportMessages, idReportMessages, idReportMessages, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
  }

  static create(about, description, idMessage, idReporter, callback){
    connection.query('INSERT INTO MessageReports(create_time, about, description, idMessage, idReporter) VALUES(?,?,?,?,?)', [new Date(), about, description, idMessage, idReporter], (err, res) => {
      if (err) throw err;
      callback(res);
    });
  }

  static findByReporter(user, callback){
    connection.query('SELECT * FROM MessageReports WHERE idReporter=? LIMIT 1', [user.id], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }
  static findById(id, callback){
    connection.query('SELECT * FROM MessageReports WHERE idMessageReports=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }
  static findByMessage(message, callback){
    connection.query('SELECT * FROM MessageReports WHERE idMessage=? LIMIT 1', [message.id], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }

  static all(callback){
    connection.query("SELECT * FROM MessageReports", (err, res) => {
      if(err) throw err;
      let result = [];
      for(const row of res){
        result.push(new User(row))
      }
      callback(result)
    })
  }

}

module.exports = MessageReport;