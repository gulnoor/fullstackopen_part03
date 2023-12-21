require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dexter = require("morgan");
dexter.token("body", (req) => JSON.stringify(req.body));

const app = express();
const ContactModel = require("./models/contact");
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(dexter(":method :url :body"));

//create
app.post("/api/persons", (request, response, next) => {
  const contact = request.body;
  ContactModel.findOneAndUpdate({ name: contact.name }, contact, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        const c = new ContactModel(contact);
        c.save()
          .then((savedc) => response.json(savedc))
          .catch((err) => next(err));
      }
      // else {
      //   response
      //     .status(404)
      //     .json({ error: "Enter details before creating contact" });
      // }
    })
    .catch((e) => next(e));
});

//read
app.get("/api/persons", (request, response, next) => {
  ContactModel.find({})
    .then((all) => {
      response.json(all);
    })
    .catch((err) => next(err));
});
app.get("/api/:id", (request, response, next) => {
  ContactModel.findById(request.params.id)
    .then((searchResult) => {
      searchResult
        ? response.json(searchResult)
        : response.status(404).send("contact not found");
    })
    .catch((err) => next(err));
});
// app.get("/info", (request, response) => {
//   response.send(`Phonebook has info for ${contacts.length} people
//   ${new Date()}`);
// });

//update
app.put("/api/persons/:id", (request, response, next) => {
  const contact = request.body;
  ContactModel.findByIdAndUpdate(request.params.id, contact, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((newContact) => response.json(newContact))
    .catch((err) => next(err));

  // else {
  //   response
  //     .status(404)
  //     .json({ error: "enter contact details before updating" });
  // }
});

//delete
app.delete("/api/:id", (request, response, next) => {
  ContactModel.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).send("deleted successfully"))
    .catch((err) => next(err));
});

//error handling middleware
const errorhandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return res.status(400).send("malformatted id");
  } else if (error.name === "ValidationError") {
    return res.status(400).send(error.message);
  }
  next(error);
};
app.use(errorhandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
