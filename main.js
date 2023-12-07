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
    number: "39-23-6423122",
  },
];
const express = require("express");
const dexter = require("morgan");
dexter.token("body", (req) => JSON.stringify(req.body));

const app = express();
app.use(express.json());
app.use(dexter(":method :url :body"));

app.get("/api/persons", (request, response) => {
  response.json(contacts);
});
app.post("/api/persons", (request, response) => {
  const contact = { ...request.body };

  if (
    contact.name &&
    contact.number &&
    !contacts.some((c) => c.name === contact.name)
  ) {
    contact.id = Math.floor(Math.random() * 999999) + 1;
    contacts = contacts.concat(request.body);
    response.json(contacts);
  } else {
    response.status(404).json({ error: "name must be unique" });
  }
});

app.get("/api/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const contact = contacts.find((contact) => contact.id === id);
  contact
    ? response.json(contacts.find((contact) => contact.id === id))
    : response.status(404).send();
});
app.delete("/api/:id", (request, response) => {
  const id = parseInt(request.params.id);
  contacts = contacts.filter((c) => c.id !== id);
  response.send("deleted successfully");
});

app.get("/info", (request, response) => {
  response.send(`Phonebook has info for ${contacts.length} people
  ${new Date()}`);
});

app.listen(3001, () => {});
