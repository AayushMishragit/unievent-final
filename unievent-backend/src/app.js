const express = require("express");

const cors    = require("cors");

  const dotenv  = require("dotenv");


dotenv.config();


const app = express();


app.use(cors());





app.use(express.json());


app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {




  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});




app.use("/api/auth", require("./routes/authRoutes"));



app.get("/", (req, res) => {


  res.json({ msg: " API is running 🚀" });


});



app.use((req, res) => {
  res.status(404).json({ msg: `Route ${req.method} ${req.url} not found` });



});

app.use((err, req, res, next) => {


  console.error("🔥 Unhandled error:", err.message);


  res.status(err.status || 500).json({ msg: err.message || "Internal server error" });
});

module.exports = app;