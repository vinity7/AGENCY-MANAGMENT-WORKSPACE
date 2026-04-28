const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const user = await User.findOne({ email: 'vinityk2004@gmail.com' });
        if (user) {
            console.log('User found:', {
                id: user._id,
                email: user.email,
                role: user.role,
                orgId: user.orgId,
                hasPassword: !!user.password
            });
        } else {
            console.log('User not found');
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUser();
