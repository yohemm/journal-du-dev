const { format } = require('path');
const connection = require('../config/db');
const User = require('./user');
const lessonSelect = "SELECT co.*, cu.ordre, nb.* FROM cour co LEFT JOIN cursus cu ON co.id=cu.cour LEFT JOIN (SELECT COUNT(cour) nb_cours, c.formation formationId, f.title formationTitle FROM cursus c JOIN formation f ON f.id=c.formation GROUP BY c.formation) nb ON nb.formationId=cu.formation";

class Cour {
  constructor (row, idCursus) {
    this.row = row;
  }

  set title(title){
    if(title){
      connection.query("UPDATE cour SET title=? WHERE id=?;--", [title, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.title = title;
        return true;
      })
    }
    return false;
  }
  set content(content){
    if(content){
      connection.query("UPDATE cour SET content=? WHERE id=?;--", [content, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.content = content;
        return true;
      })
    }
    return false;
  }
  set author(author){
    if(author){
      connection.query("UPDATE cour SET author=? WHERE id=?;--", [author, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.author = author;
        return true;
      })
    }
    return false;
  }
  set summary(summary){
    if(summary){
      connection.query("UPDATE cour SET summary=? WHERE id=?;--", [summary, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.summary = summary;
        return true;
      })
    }
    return false;
  }
  set time(time){
    if(time){
      connection.query("UPDATE cour SET time=? WHERE id=?;--", [time, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.time = time;
        return true;
      })
    }
    return false;
  }
  set description(description){
    if(description){
      connection.query("UPDATE cour SET description=? WHERE id=?;--", [description, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.description = description;
        return true;
      })
    }
    return false;
  }
  
  get id(){
    return this.row.id;
  }
  
  get createAt() {
    return this.row.create_time;
  }
  
  get title() {
    return this.row.title;
  }
  
  get time(){
    return this.row.time;
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
  
  get order() {
    return this.row.ordre;
  }
  
  get formationId() {
    return this.row.formationId;
  }
  
  get formationTitle() {
    return this.row.formationTitle;
  }

  get nbCoursFormation() {
    return this.row.nb_cours;
  }

  cursus(){
    connection.query('SELECT c.formation FROM cour JOIN cursus c ON c.cour=cour.id WHERE cour.id=?', [this.row.formation], (err, res) => {
      if(err) throw err;
    Formation.find(res[0].formation, (formation) => {
      return formation;
    });
   })
  }

  delete(callback){
    connection.query("DELETE FROM cour c WHERE c.id=?;--", [this.row.id], (err, res) =>{
      if(err) throw err;
      callback();
    })
  }
  static find(id, callback){
    connection.query(lessonSelect+' WHERE co.id=? LIMIT 1;', [id], (err, res) => {
      if (err) throw err;
      callback(new Cour(res[0]));
    })
  }
  
  static allId(callback){
    connection.query('SELECT id FROM cour;--', (err, res) => {
      if (err) throw err;
      callback(res);
    })
  }
  static all(callback){
    connection.query(lessonSelect +";--", (err, res) => {
      if (err) throw err;
      let result = [];
      for(const row of res){
        result.push(new Cour(row))
      }
      callback(result);
    })
  }
  

  static create(auteur,title, desc, summary, content,time,callback){
    connection.query('INSERT INTO cour(create_time, author, title, content, summary, time, description) VALUES (?,?,?,?,?,?,?)',[new Date(), auteur, title, content, summary, time, desc], (err, res) =>{
      if(err) throw err;
      console.log("creation cours")
      callback(res);
    });
  }
}
module.exports.Cour = Cour;


class Formation{
  constructor(row){
    this.row = row;
  }

  set title(title){
    if(title){
      connection.query("UPDATE formation SET title=? WHERE id=?;--", [title, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.title = title;
        return true;
      })
    }
    return false;
  }
  set description(description){
    if(description){
      connection.query("UPDATE formation SET description=? WHERE id=?;--", [description, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.description = description;
        return true;
      })
    }
    return false;
  }
  set difficulty(difficulty){
    if(difficulty){
      connection.query("UPDATE formation SET difficulty=? WHERE id=?;--", [difficulty, this.row.id], (err, res)=>{
        if (err) throw err;
        this.row.difficulty = difficulty;
        return true;
      })
    }
    return false;
  }
  get createAt(){
    return this.row.create_time;
  }

  get title(){
    return this.row.title;
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
    return this.row.cour;
  }
  

  cours(callback) {
    connection.query(lessonSelect + ' WHERE cu.formation=?;', [this.row.id], (err, res) => {
      if (err) throw err;
      let list = []
      res.forEach(row => {
        list.push(new Cour(row))        
      });
      callback(list)
    })    
  }
  
  delete(callback){
    connection.query("DELETE FROM formation f WHERE f.id=?;--", [this.row.id], (err, res) =>{
      if(err) throw err;
      callback();
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

  static create(title, desc, difficulty,callback){
    connection.query('INSERT INTO formation(create_time, title, description, difficulty) VALUES (?,?,?,?)',[new Date(), title, desc,difficulty], (err, res) =>{
      if(err) throw err;
      console.log("creation Fomation")
      callback(res);
    });
  }

  static all(callback){
    connection.query('SELECT f.*, nb_cours, c2.cour FROM formation f JOIN (SELECT COUNT(cour) nb_cours, c.formation FROM cursus c JOIN formation f ON f.id=c.formation GROUP BY c.formation) nb ON nb.formation=f.id JOIN cursus c2 ON c2.formation = f.id WHERE c2.ordre=1 ;', (err, res) => {
      if(err) throw err;
      let result = [];
      for(const row of res){
        result.push(new Formation(row));
      }
      callback(result)
    })
  }
}
module.exports.Formation = Formation;