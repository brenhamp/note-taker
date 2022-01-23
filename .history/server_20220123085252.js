const express = require('express');
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3002;
const app = express();
const directory = path.join(__dirname, "/public");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(directory, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.listen(PORT, () => {
  console.log(`Server now on port ${PORT}!`);
});