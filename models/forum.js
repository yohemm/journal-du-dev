const connection = require('../config/db');
class Topic{
    constructor(row){
        this.row = row;
    }
    // Sujets
    get subject(){
        return this.row.subject
    }
    // Createur
    get author(){
        return this.row.author
    }
    // Messages
    get messages(){
        return this.row.messages
    }
    // ouvert LE
    get date(){
        return this.row.date
    }
}

class Message{
    constructor(row){
        this.row = row;
    }
    // Auteur
    get author(){
        return this.row.author
    }
    // Contenue
    get content(){
        return this.row.content
    }
    // reponse de ???
    get previousMess(){
        return this.row.reponse
    }
    // écrit le
    get date(){
        return this.row.date
    }
}
module.exports = Message;
module.exports = Topic;