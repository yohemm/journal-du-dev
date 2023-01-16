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
  get nbCours(){
    return this.row.nb_cours;
  }
  get fristCour(){
    console.log(this.row.cour)
    return this.row.cour;
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
    connection.query('SELECT f.*, nb_cours, c2.cour FROM formation f JOIN (SELECT COUNT(cour) nb_cours, c.formation FROM cursus c JOIN formation f ON f.id=c.formation GROUP BY c.formation) nb ON nb.formation=f.id JOIN cursus c2 ON c2.formation = f.id WHERE c2.ordre=1 AND f.id=? LIMIT 1;', [id], (err, res) => {
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

  static all(callback){
    connection.query('SELECT f.*, nb_cours, c2.cour FROM formation f JOIN (SELECT COUNT(cour) nb_cours, c.formation FROM cursus c JOIN formation f ON f.id=c.formation GROUP BY c.formation) nb ON nb.formation=f.id JOIN cursus c2 ON c2.formation = f.id WHERE c2.ordre=1 ;', (err, res) => {
      if(err) throw err;
      let result = [];
      for(const row of res){
        console.log(row)
        result.push(new Formation(row));
      }
      callback(result)
    })
  }
}
module.exports.Formation = Formation;