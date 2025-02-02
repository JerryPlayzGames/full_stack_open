import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './services/notification'
import "./App.css"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    const existingPerson = persons.find(p => p.name === newName)

    if (newName.length < 3) {
      alert('Name must be at least 3 characters long');
      return;
    }

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        personService
          .update(existingPerson._id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(p => p._id !== existingPerson._id ? p : updatedPerson));
            setNotificationMessage(`Updated ${newName}'s number successfully`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            console.log(error)
            setNotificationMessage(`Information of ${newName} has been removed from server`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          });
      }
    } else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        setNotificationMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      })
      .catch(error => {
        console.log(error.response.data.error);
      });
    }
  }

  const removePerson = async (id) => {
    try {
      await personService.remove(id);
      setPersons(persons.filter(p => p._id !== id));
      setNotificationMessage(`Deleted person successfully`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (error) {
      setNotificationMessage(`Error deleting person: ${error.message}`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div className='Notification'>
        <Notification message={notificationMessage} />
      </div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person._id}>
            {person.name} - {person.number}
            <button onClick={() => removePerson(person._id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App