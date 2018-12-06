const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const env = require("dotenv");
const cors = require("cors");

const API_PORT = 3001;

const app = express();
const router = express.Router();
env.config();

const dbRoute = process.env.DB_URL;

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("Magic happen to database !!"));
db.on("error", console.error.bind(console, "Connection Error"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors());

let Movie = require("./model/movie");

router
  .route("/movie")
  .post((req, res) => {
    let data = new Movie();
    const { id, title } = req.body;
    data.id = id;
    data.title = title;
    data.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  })
  .get((req, res) => {
    Movie.find((err, data) => {
      if (err) res.send(err);
      res.json(data);
    });
  });
  //function(req, res)
router.route('/movie/:id').get((req, res)=>{
  Movie.findById(req.params.id, (err,id) => {
    if (err) res.send(err);
    res.json(id);
  });
});

router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.delete("/magicDelete", (req, res) => {
  const { id } = req.body;
  Movie.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true, id: id });
  });
});

app.use("/api", router);
app.listen(API_PORT, () => console.log(`Magic happen on ${API_PORT}`));
