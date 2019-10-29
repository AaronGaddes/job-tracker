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
    skills: [
        {
            name: String,
            required: Boolean
        }
    ],
    progress: [
        {
            stage: String,
            scheduledDate: Date,
            doneDate: Date,
            notes: String
        }
    ],
    failed: Boolean,
    links: [
        {
            title: String,
            link: String
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'job'
    }
});

const Job = mongoose.model('job', jobSchema);

module.exports = Job;