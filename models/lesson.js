const { format } = require('path');
const connection = require('../config/db');
const User = require('./user');

class Cour {
  constructor (row) {
    this.row = row;
    console.log(this.setCursus())
    this.cursus = this.setCursus();
  }

  get createAt() {
    return this.row.create_time;
  }
  get time(){
    return this.row.timer;
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
  get cursus() {
    return this.cursus;
  }
  setCursus(){
    connection.query('SELECT c.formation FROM cour JOIN cursus c ON c.cour=cour.id WHERE cour.id=?', [this.row.id], (err, res) => {
      console.log(this.row.id)
      if(err) throw err;
    Formation.find(res[0].formation, (formation) => {
      console.log(formation)
      return formation
    });
   })
  }
  
  static find(id, callback){
    connection.query('SELECT * FROM cour WHERE id=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new Cour(res[0]));
    })
  }
  
  static allId(callback){
    connection.query('SELECT id FROM cour', (err, res) => {
      if (err) throw err;
      console.log(res)
      callback(res);
    })
  }
  static all(callback){
    connection.query('SELECT * FROM cour', (err, res) => {
      if (err) throw err;
      let result = [];
      for(const row of res){
        console.log(row)
        result.push(new Cour(row))
      }
      callback(result);
    })
  }
}
module.exports.Cour = Cour;


class Formation{
  constructor(row){
    this.row = row;
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
    return this.row.difficulty;
  }

  static find(id, callback){
    connection.query('SELECT * FROM formation WHERE id=? LIMIT 1', [id], (err, res) => {
      if (err) throw err;
      callback(new Formation(res[0]));
    })
  }

  static findIdFormationCour(idFormation, callback){
    connection.query('SELECT id FROM formation f JOIN cursus ON f.id=c.formation', [idFormation], (err, res) => {
      if (err) throw err;
      callback(res);
    })
  }
}
module.exports.Formation = Formation;