const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _= require("lodash");
mongoose.connect("mongodb+srv://admin-aj:Akashaj451%40@cluster0.duzhj.mongodb.net/todoListDB", {
  useNewUrlParser: true
});
//removed arrays for database...points and default content array

const itemSchema = new mongoose.Schema({
  name: String
});
const Power = mongoose.model("Power", itemSchema);
const action = new Power({
  name: "Welcome to Your To Do List"
});
const action1 = new Power({
  name: "Type your List in the Text Box"
});
const action2 = new Power({
  name: "After typing the List click + "
});

const needSchema = new mongoose.Schema({
  name: String,
  defaultcontents: [itemSchema] // check finally if this works with name;String
});

const workSchema = new mongoose.Schema({
  name: String
});
const Mass = mongoose.model("Mass", workSchema);


const Level = mongoose.model("Level", needSchema);
const defaultData = [action, action1, action2];
const wpoints = [];
const need = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Power.find({}, function(err, results) {
    if (err) {
      console.log(err);
    } else if (results.length === 0) {
      Power.insertMany(defaultData, function(err) {
        console.log(err);
      });
      res.redirect("/");
    } else {
      res.render("list", {
        wow: "To Do List",
        wonder: results
      }); // date & entering list respectively
    }
  });
});

app.get("/add/work", function(req, res) {
  Mass.find({}, function(err, specs) {
      res.render("list", {
      wow: "Work List",
      wonder: specs
    });
  });
});

app.post("/", function(req, res) {
  const data2 = req.body.list;
  const data = req.body.n1;
  const action3 = new Power({
    name: data
  });
  const mass1 = new Mass({
    name: data
  });
  //Home page section
  if (data2 === "To Do List") {
    action3.save();
    res.redirect("/");
  }
  //work list section
  else if (data2 === "Work List") {
    mass1.save();
    res.redirect("/add/work");
  }
  //other list section
  else {
    Level.findOne({
      name: data2
    }, function(err, found) {
      if (err) {
        console.log(err);
      } else {
        found.defaultcontents.push(action3);
        found.save();
      }
    });
    res.redirect("/add/" + data2);
  }
});

app.post("/delete", function(req, res) {
  const deleteData = req.body.checkbox;
  const kurupdata = req.body.kurup;
  if(kurupdata==="To Do List"){
  Power.deleteOne({name:deleteData}, function(err) { // we can use findByIdandRemove
        if (err) {
      console.log(err + "Power Error");
    } else {
      res.redirect("/");
    }
  });
}
else {
Level.findOneAndUpdate({name:kurupdata},{$pull:{defaultcontents:{name:deleteData}}},function(err){
if(!err){
  res.redirect("/add/"+kurupdata);
}
});
}
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/add/:topic", function(req, res) {
  const routeData = _.capitalize(req.params.topic);
  const level1 = new Level({
    name: routeData,
    defaultcontents: defaultData
  });

  Level.findOne({
    name: routeData
  }, function(err, stone) {
    if (!stone) {
      level1.save();
      res.redirect("/add/" + routeData); //addded routeData to avoid refetching error of stone.name
    } else {
      res.render("list", {
        wow: stone.name,
        wonder: stone.defaultcontents
      }); //displaying existing data
    }
  });
});


// let port = process.env.PORT;
// if(port==null||port==""){
//   port=3000;
// }
// app.listen(port, function() {
//   console.log("Server Started Successfully");
// });
app.listen(process.env.PORT || 3000,function(){
  console.log("Server Started Successfully");
});
