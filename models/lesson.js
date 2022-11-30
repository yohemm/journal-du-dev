const { format } = require('path');
const connection = require('../config/db');
const User = require('./user');

class Cour {
  constructor (row, idCursus) {
    this.row = row;
  }

  get createAt() {
    return this.row.create_time;
  }
  get time(){
    return this.row.time;
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
  get description() {
    return this.row.description;
  }
  get difficulty() {
    return this.row.difficulty;
  }
  get author() {
    return this.row.author;
  }
  get formationId() {
    return this.row.formation;
  }
  get formationTitre() {
    return this.row.titre;
  }

  get id(){
    return this.row.id;
  }
  cursus(){
    connection.query('SELECT c.formation FROM cour JOIN cursus c ON c.cour=cour.id WHERE cour.id=?', [this.row.formation], (err, res) => {
      if(err) throw err;
    Formation.find(res[0].formation, (formation) => {
      return formation;
    });
   })
  }
  
  static find(id, callback){
    connection.query('SELECT * FROM cour co LEFT JOIN cursus cu ON co.id=cu.cour LEFT JOIN formation f ON cu.formation=f.id WHERE co.id=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new Cour(res[0]));
    })
  }
  
  static allId(callback){
    connection.query('SELECT id FROM cour', (err, res) => {
      if (err) throw err;
      callback(res);
    })
  }
  static all(callback){
    connection.query('SELECT * FROM cour co LEFT JOIN cursus cu ON co.id=cu.cour LEFT JOIN formation f ON cu.formation=f.id', (err, res) => {
      if (err) throw err;
      let result = [];
      console.log( result);
      for(const row of res){
        result.push(new Cour(row))
      }
      console.log( result);
      callback(result);
    })
  }
}
module.exports.Cour = Cour;


class Formation{
  constructor(row){
    this.row = row;
    console.log(this);
  }

  get createAt(){
    return this.row.create_time;
  }

  get titre(){
    return this.row.titre;
  }

  get description(){
    return this.row.description;
  }

  get difficulty(){
    return this.row.difficulty;
  }

  get id(){
    return this.row.id;
  }

  get cursus(){
    return this.cursus
  }

  cours(callback) {
    connection.query('SELECT * FROM cour co JOIN cursus cu ON co.id=cu.cour WHERE cu.formation=?', [this.row.id], (err, res) => {
      if (err) throw err;
      let list = []
      res.forEach(row => {
        list.push(new Cour(row))        
      });
      callback(list)
    })    
  }

  static find(id, callback){
    connection.query('SELECT * FROM formation WHERE id=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new Formation(res[0]));
    })
  }

  static findIdFormationCour(idFormation, callback){
    connection.query('SELECT id FROM formation f JOIN cursus ON f.id=c.formation DISTINCT', [idFormation], (err, res) => {
      if (err) throw err;
      callback(res);
    })
  }

  static all(callback){
    connection.query('SELECT * FROM formation f JOIN cursus c ON f.id=c.formation', (err, res) => {
      if(err) throw err;
      let result 
      for(row of res){
        result.push(row);
      }
      callback(row)
    })
  }
}
module.exports.Formation = Formation;