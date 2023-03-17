// Import express package
const express = require('express');

// Require the JSON file and assign it to a variable called termData
const notesData = require('./db/db.json');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const path = require('path')
const PORT = 3001;

// Initialize our app variable by setting it to the value of express()
const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// res.json() allows us to return JSON instead of a buffer, string, or static file
app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };
  
      // Obtain existing notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated rnote back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });

      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);