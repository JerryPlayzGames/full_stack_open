require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MongoDB URI not found in .env file');
    process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    number: {
        type: String, required: true,
        validate: {
            validator: function (v) { return /^\d{2,3}-\d{7,}$/.test(v); },
            message: props => `${props.value} is not a valid phone number! Please use the format XX-XXXXXXX.`
        }
    }
}, { collection: 'person' });

const Person = mongoose.model('Person', personSchema);

module.exports = { Person };