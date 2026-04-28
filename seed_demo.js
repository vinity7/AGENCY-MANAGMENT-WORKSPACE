const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Models
const Organization = require('./models/Organization');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Initiative = require('./models/Initiative');
const Blocker = require('./models/Blocker');
const Invoice = require('./models/Invoice');
const Sprint = require('./models/Sprint');
const StandupCheckin = require('./models/StandupCheckin');

dotenv.config();

const seedDemoData = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const emails = ['owner@demo.com', 'pm@demo.com', 'po@demo.com', 'sm@demo.com', 'dev@demo.com', 'client@demo.com'];
        
        console.log('Cleaning up existing demo data...');
        const existingUsers = await User.find({ email: { $in: emails } });
        const existingOrgIds = [...new Set(existingUsers.map(u => u.orgId).filter(id => id))];
        
        await User.deleteMany({ email: { $in: emails } });
        if (existingOrgIds.length > 0) {
            await Organization.deleteMany({ _id: { $in: existingOrgIds } });
            await Project.deleteMany({ orgId: { $in: existingOrgIds } });
            await Task.deleteMany({ orgId: { $in: existingOrgIds } });
            await Initiative.deleteMany({ organizationId: { $in: existingOrgIds } });
            await Sprint.deleteMany({ orgId: { $in: existingOrgIds } });
            await Blocker.deleteMany({ organizationId: { $in: existingOrgIds } });
            await Invoice.deleteMany({ orgId: { $in: existingOrgIds } });
            await StandupCheckin.deleteMany({ organizationId: { $in: existingOrgIds } });
        }
        console.log('Cleanup complete.');

        const commonPassword = 'password123';

        // 1. Create a "Proto-Owner"
        const protoOwner = new User({
            name: 'Alex Owner',
            email: 'owner@demo.com',
            role: 'owner',
            password: commonPassword,
            status: 'active'
        });
        await protoOwner.save();
        console.log('Created Proto-Owner.');

        // 2. Create Organization
        const org = await Organization.create({
            name: 'Elite Demo Agency',
            ownerId: protoOwner._id,
            subscriptionTier: 'Enterprise'
        });
        console.log('Created Organization:', org.name);

        protoOwner.orgId = org._id;
        await protoOwner.save();

        // 3. Create other Users
        const usersData = [
            { name: 'Sarah PM', email: 'pm@demo.com', role: 'product_manager', jobTitle: 'Head of Strategy' },
            { name: 'Mike PO', email: 'po@demo.com', role: 'product_owner', jobTitle: 'Product Lead' },
            { name: 'Dave SM', email: 'sm@demo.com', role: 'scrum_master', jobTitle: 'Agile Coach' },
            { name: 'Jane Dev', email: 'dev@demo.com', role: 'developer', jobTitle: 'Senior Engineer' },
            { name: 'Client X', email: 'client@demo.com', role: 'client', jobTitle: 'Stakeholder' }
        ];

        const users = [protoOwner];
        for (const u of usersData) {
            const user = await User.create({
                ...u,
                password: commonPassword,
                orgId: org._id,
                status: 'active'
            });
            users.push(user);
            console.log(`Created User: ${user.name} (${user.role})`);
        }

        const pm = users[1];
        const po = users[2];
        const sm = users[3];
        const dev = users[4];
        const client = users[5];

        // 4. Create Project
        const project = await Project.create({
            name: 'Project Orion',
            description: 'A revolutionary cloud dashboard for next-gen enterprises.',
            status: 'In Progress',
            orgId: org._id,
            teamLead: pm._id,
            client: client._id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        });
        console.log('Created Project:', project.name);

        // 5. Create Initiatives
        const initiative = await Initiative.create({
            title: 'Global Payments Integration',
            description: 'Implementing Stripe and PayPal for international markets.',
            businessValue: 'High - Expected 15% revenue lift',
            targetQuarter: 'Q2 2026',
            status: 'active',
            organizationId: org._id,
            createdBy: pm._id,
            reach: 5000,
            impact: 3,
            confidence: 0.8,
            effort: 5
        });
        console.log('Created Initiative:', initiative.title);

        // 6. Create Tasks
        const tasks = await Task.insertMany([
            {
                name: 'Design System Refinement',
                description: 'Update buttons and inputs to use new brand colors.',
                status: 'Completed',
                priority: 'Medium',
                project: project._id,
                orgId: org._id,
                assignedMembers: [dev._id],
                teamLead: po._id,
                invoiced: true
            },
            {
                name: 'API Authentication Layer',
                description: 'Implement JWT with refresh tokens.',
                status: 'In Progress',
                priority: 'High',
                project: project._id,
                orgId: org._id,
                assignedMembers: [dev._id],
                teamLead: po._id
            },
            {
                name: 'Mobile Push Notifications',
                description: 'Setup Firebase Cloud Messaging.',
                status: 'Pending',
                priority: 'Low',
                project: project._id,
                orgId: org._id,
                assignedMembers: [dev._id],
                teamLead: po._id
            }
        ]);
        console.log('Created 3 Tasks.');

        // 7. Create Sprint
        const sprint = await Sprint.create({
            name: 'Orion Sprint 01',
            goal: 'Stabilize Core Auth',
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            capacity: 40,
            status: 'active',
            orgId: org._id,
            createdBy: sm._id,
            items: [
                { taskId: tasks[1]._id, estimate: 8 }
            ]
        });
        console.log('Created Sprint:', sprint.name);

        // 8. Create Blocker
        const blocker = await Blocker.create({
            title: 'CI/CD Pipeline Failing',
            description: 'GitHub Actions is timing out on the integration tests.',
            severity: 'P0',
            status: 'investigating',
            organizationId: org._id,
            reporter: dev._id,
            owner: sm._id,
            project: project._id
        });
        console.log('Created Blocker:', blocker.title);

        // 9. Create Invoices
        await Invoice.insertMany([
            {
                client: client._id,
                project: project._id,
                amount: 12500,
                status: 'Paid',
                orgId: org._id,
                dueDate: new Date(),
                issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            {
                client: client._id,
                project: project._id,
                amount: 8000,
                status: 'Pending',
                orgId: org._id,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                issueDate: new Date()
            }
        ]);
        console.log('Created 2 Invoices.');

        // 10. Create Standup
        await StandupCheckin.create({
            userId: dev._id,
            organizationId: org._id,
            date: new Date().toISOString().split('T')[0],
            yesterday: 'Worked on JWT implementation.',
            today: 'Debugging refresh token loop.',
            blockers: 'CI/CD pipeline issues.',
            hasBlocker: true
        });
        console.log('Created Daily Standup.');

        console.log('------------------------------------------');
        console.log('DEMO DATA SEEDED SUCCESSFULLY!');
        console.log('------------------------------------------');
        console.log('CREDENTIALS (Password for all: password123)');
        console.log('- Owner: owner@demo.com');
        console.log('- PM: pm@demo.com');
        console.log('- PO: po@demo.com');
        console.log('- SM: sm@demo.com');
        console.log('- Dev: dev@demo.com');
        console.log('- Client: client@demo.com');
        console.log('------------------------------------------');

        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedDemoData();
