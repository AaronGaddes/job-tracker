const express = require('express');

const User = require('../db/models/user-model');

const router = express.Router();

router.put('/', async (req, res, next) => {
    try {
        let user = req.body;
        let {_id} = user;
        if(req.user._id == _id) {
            let updatedUser = await User.findByIdAndUpdate(_id,user,{new: true});
    
            res.json(updatedUser);
        } else {
            throw new Error('user does not match currently logged in user');
        }

    } catch (error) {
        next(error);
    }
})

module.exports = router;