const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const app = express();
const PORT = 3000;

let phonebookEntries = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
];

morgan.token('postData', (req) => {
    return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors())

app.get('/api/persons', (req, res) => {
    res.json(phonebookEntries);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = phonebookEntries.find(entry => entry.id === id);
    if (person) {
        res.json(person)
    }
    else
    {
        res.status(404).send("Person not found")
    }
});

app.get('/info', (req, res) => {
    const totalEntries = phonebookEntries.length;
    const currentDate = new Date();

    const info =`
        <p>Phonebook has info for ${totalEntries} people</p>
        <p>${currentDate}</p>
    `;

    res.send(info)
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body || !body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    const existingEntry = phonebookEntries.find(entry => entry.name === body.name);
    if (existingEntry) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    const newEntry = {
        id: generateRandomId(),
        name: body.name,
        number: body.number
    };

    phonebookEntries.push(newEntry);

    res.json(newEntry);
});

const generateRandomId = () => {
    const min = 1;
    const max = 1000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const phonebookIndex = phonebookEntries.findIndex(entry => entry.id === id)

    if (phonebookIndex !== -1) {
        phonebookEntries.splice(phonebookIndex, 1)
        res.status(204).end()
    } else {
        res.status(404).send('Person not found')
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});