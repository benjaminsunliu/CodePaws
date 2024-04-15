const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    collection: 'login'  // This specifies the MongoDB collection name
});

const User = mongoose.model('User', userSchema);

module.exports = User;
