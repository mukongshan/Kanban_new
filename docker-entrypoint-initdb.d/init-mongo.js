// init-mongo.js
db = db.getSiblingDB('userDataBase');
db.createCollection('users');

db = db.getSiblingDB('projectDataBase');
db.createCollection('projects');