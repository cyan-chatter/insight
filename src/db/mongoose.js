// C:/Users/DELL/mongo-4/mongodb/bin/mongod.exe --dbpath=C:/Users/DELL/mongo-4/mongodb-data

const mongodb = require('mongodb')
const mongoose = require('mongoose')

const MongoClient = mongodb.MongoClient

const mongoaddress =  process.env.MONGODB_URL||'mongodb://127.0.0.1:27017/'
const dbName = 'insight-base' 
const connectionURL = mongoaddress + dbName

mongoose.connect(connectionURL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    


