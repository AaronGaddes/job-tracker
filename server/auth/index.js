const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const db = require('../db/connection');

const users = db.get('users');
users.createIndex('username', { unique:true });


const userSchema = Joi.object().keys({
    username: Joi.string().regex(/^[a-zA-Z0-9_]*$/).min(3).max(30).required(),
    password: Joi.string().trim().min(6).required()
});

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: '🔒'
    });
});

router.post('/signup', async (req, res, next) => {

    const result = Joi.validate(req.body, userSchema,{stripUnknown: true});

    if(result.error === null) {
        const newUser = result.value;
        const existingUser = await users.findOne({
            username: newUser.username
        });

        if(existingUser) {
            next(new Error('username already exists'));
        } else {
            newUser.password = await bcrypt.hash(newUser.password, 12);
            let insertedUser = await users.insert(newUser);
            delete insertedUser.password;
            res.json(insertedUser);
        }

    } else {
        next(result.error)
    }
});



module.exports = router;