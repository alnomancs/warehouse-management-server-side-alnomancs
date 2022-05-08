const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("warehouse management system");
});

app.listen(port, () => {
  console.log(`Warehose management system running on ${port}`);
});
