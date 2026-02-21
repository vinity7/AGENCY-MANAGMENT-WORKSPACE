const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agency-workspace');
        const users = await User.find();
        console.log('Users in DB:');
        users.forEach(u => {
            console.log(`- Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, ID: ${u._id}`);
        });
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
