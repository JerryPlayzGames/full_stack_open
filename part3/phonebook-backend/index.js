const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = 3000;

const { Person } = require('./mongo');

app.use(express.json());
app.use(express.static('dist'));
app.use(morgan('tiny'));
app.use(cors());

app.get('/info', (req, res) => {
    Person.countDocuments({})
      .then(count => {
        const info = `
          <p>Phonebook has info for ${count} people</p>
          <p>${new Date()}</p>
        `;
        res.send(info);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  }).catch(err => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send('Person not found');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body || !body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        existingPerson.number = body.number;
        return existingPerson.save();
      } else {
        const newPerson = new Person({
          name: body.name,
          number: body.number
        });
        return newPerson.save();
      }
    })
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

app.put('/api/persons/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send('Invalid ID format');
      }

      const existingPerson = await Person.findById(id);

      if (!existingPerson) {
        return res.status(404).send('Person not found');
      }

      const updatedPerson = await Person.findOneAndUpdate(
        { name: existingPerson.name },
        { number: body.number },
        { new: true }
      );

      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send('Person not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  console.log(id)
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});