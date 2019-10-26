const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    githubId: String,
    displayName: String,
    avatarURL: String,
    skills: [String]
});

const User = mongoose.model('user', userSchema);

module.exports = User;