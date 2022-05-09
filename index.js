const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ObjectID,
} = require("mongodb");
const port = process.env.PORT || 5001;

const app = express();

app.use(cors());
app.use(express.json());

const res = require("express/lib/response");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v7yk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("warehouse").collection("products");

    //add stock
    app.post("/product/addToStock", async (req, res) => {
      console.log("query", req.query);
      const id = req.query._id;
      const stock = req.query.stock;

      console.log(id, stock);

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          stock: stock,
        },
      };

      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.send(result);
    });

    //minis stock
    app.post("/product/update", async (req, res) => {
      console.log("query", req.query);
      const id = req.query._id;
      const stock = req.query.stock - 1;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          stock: stock,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.send(result);
    });
    app.delete("/product/delete/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      console.log(id, query, result);

      res.send({ result: result });
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/inventoryItem", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.limit(6).toArray();
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir());

app.get("/", (req, res) => {
  res.send("warehouse management system");
});
app.get("/hero", (req, res) => {
  res.send("hero");
});

app.listen(port, () => {
  console.log(`Warehose management system running on ${port}`);
});
