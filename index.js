const express = require('express');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qu1uq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('cycloneTour');
    const toursCollection = database.collection('tours');
    const usersCollection = database.collection('users');

    // create a document to insert

    // GET Single Tour
    app.get('/tours/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await toursCollection.findOne(query);
      res.json(tour);
    });

    // GET API
    app.get('/tours', async (req, res) => {
      const cursor = toursCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      console.log(users);
      res.json(users);
    });

    // POST API
    app.post('/tours', async (req, res) => {
      const tour = req.body;
      const result = await toursCollection.insertOne(tour);
      res.json(result);
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // UPDATE API
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const query = { _id: ObjectId(id) };

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedData.status,
        },
      };

      const result = await usersCollection.updateOne(query, updateDoc, options);
      console.log('updating user with id', result);
      res.json(result);
    });

    // DELETE API
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      console.log('deleting user with id', result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('<h1>Hello, Tourist. Welcome to Cyclone-Tour!</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
