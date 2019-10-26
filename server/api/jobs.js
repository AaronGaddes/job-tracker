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
        next(error);
    }
    
});

router.put('/', async (req, res, next) => {
    try {
        let job = req.body;
        let {_id} = job;
        
        let updatedJob = await Job.findByIdAndUpdate(_id,job);

        res.json(updatedJob);

    } catch (error) {
        next(error);
    }
});

router.get(':id', async(req, res, next) => {
    try {
        let {id} = req.params;
        let job = await Job.findById(id);

        res.json(job);
    } catch (error) {
        next(error);
    }
})

module.exports = router;