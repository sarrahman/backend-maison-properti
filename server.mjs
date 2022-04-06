import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import router from "./router/index.mjs";
import ImageKit from "imagekit";
import algoliasearch from "algoliasearch";
import cron from "node-cron";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

dotenv.config();

const client = algoliasearch(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_API_KEY
);
const index = client.initIndex("all_products");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: "https://ik.imagekit.io/sarrahman",
});

const app = express();
const port = process.env.PORT || 8080;

try {
  mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB");
    db.collection("products")
      .find()
      .toArray(function (err, result) {
        if (err) throw err;
        result.forEach((product) => {
          product.objectID = product._id;
          index.saveObject(product, function (err) {
            if (err) throw err;
            console.log("Product indexed in Algolia");
          });
        });
      });
  });
} catch (error) {
  console.log(error);
}

cron.schedule("*/5 * * * *", () => {
  mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection;
  db.collection("products")
    .find()
    .toArray(function (err, result) {
      if (err) throw err;
      result.forEach((product) => {
        product.objectID = product._id;
        index.saveObject(product, function (err) {
          if (err) throw err;
        });
      });
    });
  console.log("Products indexed in Algolia");
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", reason.stack || reason);
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
});

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    secure: process.env.NODE_ENV === "production",
  })
);
app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(router);

app.get("/auth", function (req, res) {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
