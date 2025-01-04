import axios from 'axios'

const API_URL = 'http://localhost:3001/persons'

const getAll = async () => {
    const response = await axios.get(API_URL)
    return response.data
}

const create = async (newObject) => {
    const response = await axios.post(API_URL, newObject)
    return response.data
}

const update = async (id, newObject) => {
    const response = await axios.put(`${API_URL}/${id}`, newObject)
    return response.data
}

const remove = (id) => {
    return axios.delete(`${API_URL}/${id}`)
}

export default { getAll, create, remove, update }