const express = require('express');
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// midelwere
app.use(cors());
app.use(express.json())


console.log(process.env.DB_pass);

// const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.0rmdzda.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb://TodoList:UyPTGCj0NF1Viz4i@ac-wotlaa2-shard-00-00.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-01.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-02.0rmdzda.mongodb.net:27017/?ssl=true&replicaSet=atlas-as340s-shard-0&authSource=admin&retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const AllTask = client.db('TodoList').collection('AllTask')
        
        app.get('/allTask', async (req, res) => {
          const cursor = AllTask.find()
          const result = await cursor.toArray()
          res.send(result)

      })
        app.post('/addTask', async (req, res) => {
          const body = req.body
          const result = await AllTask.insertOne(body);
          res.send(result)

      })
      // find todo

      app.get('/todo', async(req,res) =>{
        const quary = {status: "todo"}
        const result = await AllTask.find(quary).toArray()
        res.send(result)
      })
      // Doing
      app.get('/doing', async(req,res) =>{
        const quary = {status: "doing"}
        const result = await AllTask.find(quary).toArray()
        res.send(result)
      })
      // Done
      app.get('/done', async(req,res) =>{
        const quary = {status: "done"}
        const result = await AllTask.find(quary).toArray()
        res.send(result)
      })
      // delete

      app.delete('/delete/:id', async(req,res) =>{
        const id =req.params.id ;
        const quary = {_id : new ObjectId(id)}
        const result = await AllTask.deleteOne(quary)
        res.send(result)
      })

      // make Doing 

      app.patch('/makeDoing/:id', async(req,res) =>{
        const id = req.params.id;
        const quary = {_id : new ObjectId(id)}
        const updateDoc = {
          $set: {
            status: 'doing'
          },
        };
        const result= await AllTask.updateOne(quary,updateDoc)
        res.send(result)
      })

      // Make done 
      app.patch('/makeDone/:id', async(req,res) =>{
        const id = req.params.id;
        const quary = {_id : new ObjectId(id)}
        const updateDoc = {
          $set: {
            status: 'done'
          },
        };
        const result= await AllTask.updateOne(quary,updateDoc)
        res.send(result)
      })
      app.patch('/makeUpdate/:id', async(req,res) =>{
        const id = req.params.id;
        const body = req.body
        const title = body.title
        const description = body.description
        const quary = {_id : new ObjectId(id)}
        const updateDoc = {
          $set: {
            title: title,
            description:description
          },
        };
        const result= await AllTask.updateOne(quary,updateDoc)
        res.send(result)
      })

    
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Todo is on fire')
})

app.listen(port, () => {
    console.log(`Todo is running on ${port}`);
})