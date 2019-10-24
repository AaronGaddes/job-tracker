const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: String,
    company: {
        name :String,
        logoURL: String,
        address: String,
        location: {
            latitude: Number,
            longitude: Number
        }
    },
    type: String,
    description: String,
    renumeration: {
        min: Number,
        max: Number,
        quoted: Number,
        period: String
    },
    skills: [String],
    progress: [
        {
            stage: String,
            scheduledDate: Date,
            doneDate: Date,
            notes: String
        }
    ],
    failed: Boolean,
    coverLetter: {
        type: String,
        content: String,
        link: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'job'
    }
});

const Job = mongoose.model('job', jobSchema);

module.exports = Job;