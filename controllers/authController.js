import User from '../models/User';

const user = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({ message: 'User already Exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(200).json({message: 'User Registered Successfully!!!'});
    } catch(err) {
        res.status(500).json({error: error.message});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = User.findOne({email});
        if (user && user.compare(password, user.password)){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRY})
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token
            });
        } else {
            res.status(401).json({message: 'Invalid Email or Password!!!'})
        }
    } catch(err) {
        res.status(500).json({error: error.message});
    }
};