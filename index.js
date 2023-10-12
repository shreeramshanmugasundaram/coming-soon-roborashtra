import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// importing schema
import EmailSchema from "./models/EmailSchema.js";

const app = express();
dotenv.config();

app.use("/", express.static(path.join(__dirname, "/client")));

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;
  try {
    // check whether email is received
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please fill all the required inputs " });
    }
    // check the existing email
    const existing = await EmailSchema.findOne({ email });
    if (existing) {
      return res.status(400).sendFile(`${__dirname}/client/alreadyexist.html`);
    }
    // saving to database
    const result = await EmailSchema.create({
      email,
    });
    console.log("hi");
    return res.status(201).sendFile(`${__dirname}/client/success.html`);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Something went wrong, Please try later" });
  }
});

app.get("/api/emails", async (req, res) => {
  try {
    const allEmails = await EmailSchema.find();
    const filteredEmail = allEmails.map((data) => {
      return { email: data.email, time: data.time };
    });
    return res.status(201).send(filteredEmail);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try later" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/index.html"), (err) => {
    res.status(500).send(err);
  });
});
const PORT = process.env.PORT || 5000;
const DB = process.env.DB;

mongoose
  .connect(DB)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}`));
  })
  .catch((error) => {
    console.log(error);
  });
