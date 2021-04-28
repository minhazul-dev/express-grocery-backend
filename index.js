const express = require('express')
const cors = require('cors')
const objectID = require('mongodb').ObjectID
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 4040
const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('express grocery backend')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oysdd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection erroe', err);
  const productsCollection = client.db("grocery").collection("products");
  const ordersCollection = client.db("grocery").collection("orders");
  // perform actions on the collection object
  console.log('db connected succesfully');


  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    // console.log(newOrder);
  })


  app.get('/orders', (req, res) => {
    // console.log(req.query.email);

    ordersCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


  app.get('/products', (req, res) => {
    productsCollection.find()
      .toArray((err, items) => {
        res.send(items)
        // console.log('from db',items)
      })

  })


  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    productsCollection.insertOne(newProduct)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })

  })

  app.delete('/deleteProduct/:id', (req, res) => {

    const id = objectID(req.params.id);
    console.log('delete this ', id);
    productsCollection.findOneAndDelete({ _id: objectID(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
        console.log(result);
      });
    console.log(req.params.id);

  })
  //   client.close();
});




app.listen(process.env.PORT || port)