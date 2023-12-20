let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-64231222",
  },
];
require("dotenv").config();
const express = require("express");
const dexter = require("morgan");
const cors = require("cors");

dexter.token("body", (req) => JSON.stringify(req.body));
const app = express();
const ContactModel = require("./models/contact");
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(dexter(":method :url :body"));

app.get("/api/persons", (request, response) => {
  ContactModel.find({}).then((all) => {
    response.json(all);
  });
});

app.post("/api/persons", (request, response) => {
  const contact = { ...request.body };

  if (contact.name && contact.number) {
    const c = new ContactModel(contact);
    c.save().then((savedc) => response.json(savedc));
  } else {
    response.status(404).json({ error: "bruh..." });
  }
});
app.put("/api/persons/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const contact = { ...request.body, id };

  if (contact.name && contact.number) {
    contacts = contacts.filter((c) => c.id !== id);
    contacts = contacts.concat(contact);
    response.json(contact);
  } else {
    response.status(404).json({ error: "name must be unique" });
  }
});

app.get("/api/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const contact = contacts.find((contact) => contact.id === id);
  contact ? response.json(contact) : response.status(404).send();
});

app.delete("/api/:id", (request, response) => {
  console.log(request.params.id);
  const id = parseInt(request.params.id);
  contacts = contacts.filter((c) => c.id !== id);
  response.json(contacts);
});

app.get("/info", (request, response) => {
  response.send(`Phonebook has info for ${contacts.length} people
  ${new Date()}`);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
