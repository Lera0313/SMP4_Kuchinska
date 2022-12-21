//app.js SMP Laborratory work 4. Kuchinska Valeria
const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
const filmScheme = new Schema({name: String, 
    director: String, genre: String, date: Number}, 
    {versionKey: false});
const Film = mongoose.model("Film", filmScheme);
 
app.use(express.static(__dirname + "/public"));
 
// підключення до бази даних
mongoose.connect("mongodb://localhost:27017/filmsdb", 
    { useUnifiedTopology: true, useNewUrlParser: true}, 
    function(err){
    if (err) 
        return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер очікує на підключення...");
    });
});

// для отримання films
app.get("/api/films", function(req, res){
        
    Film.find({}, function(err, films){
        if(err) 
            return console.log(err);
        res.send(films)
    });
});
 
// для отримання film
app.get("/api/films/:id", function(req, res){
         
    const id = req.params.id;
    Film.findOne({_id: id}, function(err, film){       
        if(err) 
            return console.log(err);
        res.send(film);
    });
});
    
// для додавання film в базу даних
app.post("/api/films", jsonParser, function (req, res) {
        
    if(!req.body) 
        return res.sendStatus(400);
        
    const filmName = req.body.name;
    const filmDirector = req.body.director;
    const filmGenre = req.body.genre;
    const filmDate = req.body.date;
    const film = new Film({name: filmName, 
        director: filmDirector, genre: filmGenre, date: filmDate});
        
        film.save(function(err){
        if(err) 
            return console.log(err);
        res.send(film);
    });
});

// для вилучення films із бази даних
app.delete("/api/films/:id", function(req, res){
         
    const id = req.params.id;
    Film.findByIdAndDelete(id, function(err, film){            
        if(err) 
            return console.log(err);
        res.send(film);
    });
});

// для оновлення інформації про film
app.put("/api/films", jsonParser, function(req, res){
         
    if(!req.body) 
        return res.sendStatus(400);
    const id = req.body.id;
    const filmName = req.body.name;
    const filmDirector = req.body.director;
    const filmGenre = req.body.genre;
    const filmDate = req.body.date;
    const newFilm = {director: filmDirector, 
        name: filmName, genre: filmGenre, date: filmDate};
     
    Film.findOneAndUpdate({_id: id}, newFilm, {new: true}, 
        function(err, film){
        if(err) 
            return console.log(err); 
        res.send(film);
    });
});