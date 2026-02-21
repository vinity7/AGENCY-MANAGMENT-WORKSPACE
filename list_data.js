const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
require('dotenv').config();

const listData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agency-workspace');

        const projects = await Project.find();
        console.log('Projects:');
        projects.forEach(p => console.log(`- ${p.name} (${p._id})`));

        const interns = await User.find({ role: 'Intern' });
        console.log('\nInterns:');
        interns.forEach(i => console.log(`- ${i.name} (${i._id})`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listData();
