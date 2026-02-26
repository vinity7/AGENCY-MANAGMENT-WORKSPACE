const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agency-workspace');
        console.log('Connected to DB');

        const interns = await User.find({ role: 'Intern' });
        console.log('Interns found with {role: "Intern"}:', interns.length);

        const allUsers = await User.find();
        console.log('Total Users:', allUsers.length);
        console.log('Roles found in all users:', [...new Set(allUsers.map(u => u.role))]);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

test();
