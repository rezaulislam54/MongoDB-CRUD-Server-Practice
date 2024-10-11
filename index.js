const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// qbbpgJvfDPcsxlfU

app.use(cors())
app.use(express.json())

app.get("/", (req , res)=>{
    res.send('Mongodb Crud Server Running');
})


const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hflxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
    const usersColection = client.db('UsersDB').collection('users');

    app.get("/users", async(req, res) =>{
        const cursor = usersColection.find()
        const result = await cursor.toArray();
        res.send(result)
    })


    app.get("/users/:id", async(req, res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersColection.findOne(query);
      res.send(result);
    })

      app.post("/users", async(req, res) =>{
    const user = req.body;
    const result = await usersColection.insertOne(user);
    res.send(result);
   })


   app.put("/users/:id", async(req, res) =>{
    const id = req.params.id;
    const user = req.body;
    const filter = {_id: new ObjectId(id)};
    const options = { upsert: true };
    const updatedUser = {
      $set:{
        name: user.name,
        email: user.email
      }
    }
    const result = await usersColection.updateOne(filter, updatedUser, options);
    res.send(result);

   })


   app.delete("/users/:id", async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await usersColection.deleteOne(query);
    res.send(result);
   })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`Server is Running on port ${port}`);
})