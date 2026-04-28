const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
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

        const tasks = await Task.find().populate('teamLead assignedMembers');
        console.log('\nTasks:');
        tasks.forEach(t => {
            console.log(`- ${t.name} (${t._id})`);
            console.log(`  Lead: ${t.teamLead?.name || 'None'}`);
            console.log(`  Members: ${t.assignedMembers?.map(m => m.name).join(', ') || 'None'}`);
            console.log(`  Milestones: ${t.milestones?.length || 0}`);
        });

        process.exit();
    } catch (err) {

        console.error(err);
        process.exit(1);
    }
};

listData();
