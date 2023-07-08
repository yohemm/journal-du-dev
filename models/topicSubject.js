const connection = require('../config/db');

class TopicSubject{
  constructor(row){
    this.row = row;
  }
  update() {
    
  }
  get id(){
    return this.row.idTopicSubject;
  }
  
  get subjectName(){
    return this.row.subjectName;
  }
  set subjectName(subjectName){
    this.row.idsubjectName = subjectName;
  }
  
  get subjectDesc (){
    return this.row.subjectDesc;
  }
  set subjectDesc(subjectDesc){
    this.row.idWarned = subjectDesc;
  }

  get idGlobalSubject (){
    return this.row.idGlobalSubject;
  }
  set idGlobalSubject(idGlobalSubject){
    this.row.idGlobalSubject = idGlobalSubject.id;
  }
  get create_time (){
    return this.row.create_time;
  }

  delete(callback){
    connection.query("DELETE FROM TopicSubjects ts WHERE ts.idTopicSubjects=?;--", [this.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }

  static update(pseudo, email, bio, profilePicture, id, callback){
    if(profilePicture == undefined || profilePicture ==''){
      connection.query('UPDATE TopicSubjects SET pseudo=?, email=?, bio=? Where id=?', [pseudo, email, bio, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
    }else{
      connection.query('UPDATE TopicSubjects SET pseudo=?, email=?, bio=?, profilePicture=? Where id=?', [pseudo, email, bio, profilePicture, id], (err, res) => {
        if (err) throw err;
        callback(res);
      })
    }
  }

  static create(idGlobalSubject, subjectName, subjectDesc, callback){
    connection.query('INSERT INTO TopicSubjects(create_time, idGlobalSubject, subjectName, subjectDesc) VALUES(?,?,?,?,?)', [new Date(), idGlobalSubject.id, subjectName, subjectDesc], (err, res) => {
      if (err) throw err;
      callback(res);
    });
  }

  static findName(subjectName, callback){
    connection.query('SELECT * FROM TopicSubjects WHERE subjectName=? LIMIT 1', [subjectName], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }
  static findId(idTopicSubject, callback){
    connection.query('SELECT * FROM TopicSubjects WHERE idTopicSubject=? LIMIT 1', [idTopicSubject], (err, res) => {
      if (err) throw err;
      callback(new TopicSubject(res[0]));
    })
  }

  static all(callback){
    connection.query("SELECT * FROM TopicSubjects", (err, res) => {
      if(err) throw err;
      let result = [];
      for(const row of res){
        result.push(new User(row))
      }
      callback(result)
    })
  }

}

module.exports = TopicSubject;