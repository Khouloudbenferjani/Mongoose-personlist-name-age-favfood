//Import Express & Database function to connect
const express = require("express");
const dbConn = require("./Config/dbConfig");
const personSchema = require("./modeles/person");
var cors = require('cors')

//Define port number and express module
const port = 5000;
const app = express();

require('dotenv').config()

//Use json to be able to read json files
app.use(express.json());
app.use(cors())

dbConn();

app.post("/addPerson", async (req, res) => {
  try {
    const newPerson = new personSchema(req.body);
    await newPerson.save().then (result=>{
    console.log(result);
    })
    res.status(200).send("person created successfully");
  } catch (error) {
    res.status(500).send("unable to add new person");
    console.log(error);
  }
});

app.get("/getPersons", async (req, res) => {
  try {
    const persons = await personSchema.find();
    res.status(200).send(persons);
  } catch (error) {
    res.status(500).send("cannot get persons");
    console.log(error);
  }
});

app.get("/getpersonbyid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const person = await personSchema.findById(id);
    person
      ? res.status(200).send(person)
      : res.status(404).send("person not found");
  } catch (error) {
    res.status(500).send("cannot get person");
    console.log(error);
  }
});
//Start our server
app.listen(port, (error) => {
  error
    ? console.log(error)
    : console.log(`server running on.. http://localhost:${port}`);
});

// update from DB by Field
app.put('/UpdatePersonByName/:name', (req, res) => {
  try {
    const { name } = req.params
    personSchema.findOneAndUpdate(
      {
        name: name  // search query
      },
      {
        ...req.body  // field:values to update
      },
      {
        new: true,                       // return updated doc
        runValidators: true              // validate before update
      })
      .then(doc => {
        console.log(doc)
        if (doc) {
          res.send({ result: "user updated", newuser: doc })

        }else{
          res.send({ result: "cannot find user", newuser: doc })

        }
      })
      .catch(err => {
        console.error(err)
      })

  } catch (error) {
    console.log(error);
    res.status(500).send("server error")
  }

})
// update from DB by ID
app.put('/UpdatePersonById/:id', (req, res) => {
  try {
    const { id } = req.params
    personSchema.findByIdAndUpdate(

      id,  // search query

      {
        $set: {
          ...req.body  // field:values to update
        }
      }
      ,
      {
       // overwrite : true,
        new: true,                       // return updated doc
        runValidators: true              // validate before update
      })
      .then(doc => {
        console.log(doc)
        res.send({ result: "user updated", newuser: doc })
      })
      .catch(err => {
        console.error(err)
      })

  } catch (error) {
    console.log(error);
    res.status(500).send("server error")
  }

})

//delete from DB by ID 

app.delete('/deletePersonById/:id', (req, res) => {
    try {
      const { id } = req.params
      personSchema.findByIdAndDelete(id).then(response=>{
        if (response) {
          const newList = personSchema.find()
            res.send(newList)
            
        }else{
            res.send("error")
        }
      })
        } catch (error) {
            console.log(error);
            res.status(500).send("server error")
          }   
    })
  
  
    
  