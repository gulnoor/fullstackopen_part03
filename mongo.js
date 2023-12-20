const [, , password, name, number] = process.argv;
if (!password) {
  process.exit(1);
}
const url = `mongodb+srv://gulnoor5233:${password}@testing.vbsjkao.mongodb.net/?retryWrites=true&w=majority`;

//connect to database
const mongoose = require("mongoose");
mongoose.connect(url);

//create schema object
const schema = new mongoose.Schema({
  name: String,
  number: String,
});

//create model class from schema
const Contact = mongoose.model("Contact", schema);
if (name && number) {
  //create instance of model i.e document
  const contact = new Contact({
    name,
    number,
  });

  //save instance to database
  contact.save().then((response) => {
    console.log(`${response.name} added successfully`);
    mongoose.connection.close();
  });
} else {
  Contact.find({ name: "gg" }).then((all) => {
    console.log(all);
    mongoose.connection.close();
  });
}
