const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const { response } = require("express");
require("dotenv").config();
const app = express();
app.use(formidable());
app.use(cors());

const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;

const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

app.post("/form", async (req, res) => {
  try {
    console.log("/form");

    const dataForm = ({ subject: "mail", firstname, lastname, email, message } =
      req.fields);
    console.log(dataForm);
    const data = {
      from: `${dataForm.firstname} ${dataForm.lastname} ${dataForm.email}`,
      to: "murzynthomas@gmail.com",
      subject: dataForm.subject,
      text: dataForm.message,
    };

    mailgun.messages().send(data, (error, body) => {
      if (!error) {
        return console.log("ok");
      } else {
        res.status(401);
      }
    });

    res.json({ message: "Un mail de confirmation vous a été envoyé." });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.all("*", () => {
  response.send("404 not found");
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
