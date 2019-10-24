const express = require('express');
// const passport = require('passport');

const Job = require('../db/models/job-model');

const router = express.Router();

router.get('/', async (req, res, next) => {
    // console.log(req.user.id);

    // get all jobs for the current user populated by passport
    let jobs = await Job.find({userId:req.user.id})
    
    res.json({jobs});
});

router.post('/', async (req, res, next) => {
    try {
        let newJob = await new Job({...req.body, userId: req.user.id}).save();
        res.json(newJob);
    } catch (error) {
        next(new Error(error));
    }
    
})

module.exports = router;