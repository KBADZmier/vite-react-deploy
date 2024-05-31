import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const port = 3001;


app.use(bodyParser.json());
app.use(cors());


const uri = 'mongodb://localhost:27017';
const dbName = 'todoApp';
const client = new MongoClient(uri);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
  next();
});

const runServer = async () => {
  try {
    await client.connect();
    console.log('Connected to the database');
    const db = client.db(dbName);

    app.get('/', (req, res) => {
      res.send('Hello, World!');
    });



      app.post('/tasks', async (req, res) => {
        try {
          const newTask = req.body;
          const result = await db.collection('tasks').insertOne(newTask);
          res.status(201).json(result.ops[0]);
        } catch (err) {
          console.error('Error adding task:', err);
          res.status(500).json({ error: 'Error adding task' });
        }
      });
      

      app.delete('/tasks/:id', async (req, res) => {
        try {
          const taskId = req.params.id;
          const objectId = new ObjectId();
          const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(taskId) });
          if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Task deleted successfully' });
          } else {
            res.status(404).json({ error: 'Task not found' });
          }
        } catch (err) {
          console.error('Error deleting task:', err);
          res.status(500).json({ error: 'Error deleting task' });
        }
      });
      


      app.get('/tasks', async (req, res) => {
        try {
          const tasks = await db.collection('tasks').find({}).toArray();
          res.status(200).json(tasks);
        } catch (err) {
          console.error('Error retrieving tasks:', err);
          res.status(500).json({ error: 'Error retrieving tasks' });
        }
      });


    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error('blad', err);
 
  }
};

runServer();
