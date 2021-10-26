const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const app = express();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.youri.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("services")

      //POST API
      app.post('/services', async(req, res)=>{
          const service = req.body;
        //  console.log('hit the post api', service);
         const result = await servicesCollection.insertOne(service);
         res.send(result);
      });

      //GET Single Service
      app.get('/services/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const service = await servicesCollection.findOne(query)
          res.json(service)
      })
      //GET API
      app.get('/services', async(req, res) => {
          const cursor = servicesCollection.find({});
          const users = await cursor.toArray();
          res.send(users)
      });
      
      app.delete('/services/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await servicesCollection.deleteOne(query);
          res.json(result);
      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running Genius Server");
})

app.listen(port, ()=> {
    console.log("Running Genius Server on port", port);
})
