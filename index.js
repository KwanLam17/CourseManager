var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer()
var app = express()

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/my_db')

var personSchema = mongoose.Schema({
      name: String,
      age: Number,
      nationality: String
})

var Person = mongoose.model("Person", personSchema)

app.get('/person', (req, res) => {
      //console.log("Hi");
      res.render('person');
})

app.set('view engine', 'pug')
app.set('views', './views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(upload.array())
app.use(express.static('public'))

app.post('/person', (req, res) => {
      //console.log(req.body);

      var personInfo = req.body;

      if(!personInfo.name || !personInfo.age || !personInfo.nationality){
            res.render('show_message', {
                  message: "Sorry, you provided wrong info", type: "error"
            });
      } else {
            var newPerson = new Person({
                  name: personInfo.name,
                  age: personInfo.age,
                  nationality: personInfo.nationality
            });

            newPerson.save(function(err, Person){
                  if(err)
                        res.render('show_message', {message: "Database error", type: "error"});
                  else
                        res.render('show_message', {
                              message: "New person added", type: "success", person: personInfo
                        });
            })
      }
})

app.get('/findpeople', (req, res) => {
      Person.find((err, response) => {
            res.json(response);
      })
})

app.get('/findTanya', (req, res) => {
      Person.find({name: "Tanya", age: 26}, (err, response) => {
            res.json(response);
      })
})

app.get('/delete26', (req, res) => {
      Person.remove({age:26}, (err, response) => {
            console.log("deleted people aged 26");
      })
})

app.delete('/people/:id', function(req, res){
      Person.findByIdAndRemove(req.params.id, function(err, response){
         if(err) res.json({message: "Error in deleting record id " + req.params.id});
         else res.json({message: "Person with id " + req.params.id + " removed."});
      });
   });

app.listen(3000)