CREATE TABLE Users(  
    idUser int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    pseudo VARCHAR(70) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(70) NOT NULL UNIQUE,
    pass int NOT NULL COMMENT 'Access Pass',
    bio VARCHAR(511),
    profilePicture VARCHAR(30),
    create_time DATETIME COMMENT 'Create Time'
) COMMENT 'all user';

CREATE TABLE Warns(  
    idWarn int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    idEmetor int NOT NULL COMMENT 'Foreign Key',
    idWarned int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idEmetor) REFERENCES Users(idUser),
    FOREIGN KEY (idWarned) REFERENCES Users(idUser),
    motif VARCHAR(70) NOT NULL UNIQUE,
    commentary VARCHAR(511),

) COMMENT 'all user s warns';


CREATE TABLE TopicSubjects(  
    idTopicSubject int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    idGlobalSubject int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idGlobalSubject) REFERENCES TopicSubjects(idTopicSubject),
    subjectName VARCHAR(70) NOT NULL,
    subjectDesc VARCHAR(511),
    create_time DATETIME COMMENT 'Create Time'
) COMMENT 'all Topic s Subjects';


CREATE TABLE Topics(  
    idTopic int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    idTopicSubject int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idTopicSubject) REFERENCES TopicSubjects(idTopicSubject),
    title VARCHAR(70) NOT NULL UNIQUE,
    probleme VARCHAR(511),
    create_time DATETIME COMMENT 'Create Time'
) COMMENT 'all Topics';

CREATE TABLE TopicMessages(  
    idMessageTopic int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    idReponseMessage int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idReponseMessage) REFERENCES TopicMessages(idMessageTopic),
    idTopic int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idTopic) REFERENCES Topics(idTopic),
    idUser int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idUser) REFERENCES Users(idUser),
    content VARCHAR(511),
    create_time DATETIME COMMENT 'Create Time'
) COMMENT 'message s Topics';

CREATE TABLE MessageReports(  
    idReportMessages int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    about VARCHAR(100),
    description VARCHAR(511),
    idMessage int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idMessage) REFERENCES TopicMessages(idMessageTopic),
    idReporter int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idReporter) REFERENCES Users(idUser),
    create_time DATETIME COMMENT 'Create Time'
) COMMENT 'message s reports';

CREATE TABLE MessageSensors(
    idMessageSensors int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    about VARCHAR(100),
    description VARCHAR(511),
    idMessage int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idMessage) REFERENCES TopicMessages(idMessageTopic),
    idReporter int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idReporter) REFERENCES Users(idUser),
    create_time DATETIME COMMENT 'Create Time'
) COMMENT 'message s sensors';

CREATE TABLE Formations(  
    idFormation int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    title VARCHAR(100),
    difficulty int NOT NULL,
    description VARCHAR(511),
    idCreator int COMMENT 'Foreign Key',
    FOREIGN KEY (idCreator) REFERENCES Users(idUser),
    create_time DATETIME COMMENT 'Create Time'
) COMMENT 'all Formations';

CREATE TABLE Cursus(  
    idCursus int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    ordre int NOT NULL,
    idFormation int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idFormation) REFERENCES Formations(idFormation),
    idLesson int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idLesson) REFERENCES Lessons(idLesson),
    create_time DATETIME COMMENT 'Create Time'
) COMMENT 'all Formations';

CREATE TABLE Lessons(  
    idLesson int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    title VARCHAR(100),
    idFormation int NOT NULL COMMENT 'Foreign Key',
    FOREIGN KEY (idFormation) REFERENCES Formations(idFormation),
    content VARCHAR(2047),
    ordre int NOT NULL,
    idCreator int COMMENT 'Foreign Key',
    FOREIGN KEY (idCreator) REFERENCES Users(idUser),
    create_time DATETIME COMMENT 'Create Time'
) COMMENT 'all Lessons';


-- Commentary, achvement