const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agency-workspace');

        const email = 'admin_test@example.com';
        let user = await User.findOne({ email });
        if (user) await user.deleteOne();

        user = new User({
            name: 'Admin Test',
            email: email,
            password: 'password123',
            role: 'Admin'
        });

        await user.save();
        console.log('Admin user created successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
