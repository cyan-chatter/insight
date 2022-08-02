// C:/Users/DELL/mongo-4/mongodb/bin/mongod.exe --dbpath=C:/Users/DELL/mongo-4/mongodb-data

const mongodb = require('mongodb')
const mongoose = require('mongoose')

//const MongoClient = mongodb.MongoClient
const dbName = 'insight-base' 
const mongoaddress =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  "mongodb://127.0.0.1:27017/insight-base";


mongoose.connect(mongoaddress,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    //useMongoClient: true
})
    



