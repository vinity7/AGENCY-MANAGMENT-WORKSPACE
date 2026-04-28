const mongoose = require('mongoose');
require('dotenv').config();
const Organization = require('../models/Organization');
const User = require('../models/User');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Invoice = require('../models/Invoice');

const migrate = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGO_URL;
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // 1. Create Legacy Organization if it doesn't exist
        let legacyOrg = await Organization.findOne({ name: 'AgencyOS Legacy' });
        
        if (!legacyOrg) {
            // Pick the first user as owner
            const firstUser = await User.findOne();
            if (!firstUser) {
                console.log('No users found. Skipping migration.');
                process.exit(0);
            }

            legacyOrg = new Organization({
                name: 'AgencyOS Legacy',
                subscriptionTier: 'Enterprise', // Give legacy users full access
                ownerId: firstUser._id,
            });
            await legacyOrg.save();
            console.log('Created AgencyOS Legacy Organization');
        }

        const orgId = legacyOrg._id;

        // 2. Assign orgId to all existing users
        const userResult = await User.updateMany({ orgId: { $exists: false } }, { $set: { orgId } });
        console.log(`Updated ${userResult.modifiedCount} users`);

        // 3. Assign orgId to all existing clients
        const clientResult = await Client.updateMany({ orgId: { $exists: false } }, { $set: { orgId } });
        console.log(`Updated ${clientResult.modifiedCount} clients`);

        // 4. Assign orgId to all existing projects
        const projectResult = await Project.updateMany({ orgId: { $exists: false } }, { $set: { orgId } });
        console.log(`Updated ${projectResult.modifiedCount} projects`);

        // 5. Assign orgId to all existing tasks
        const taskResult = await Task.updateMany({ orgId: { $exists: false } }, { $set: { orgId } });
        console.log(`Updated ${taskResult.modifiedCount} tasks`);

        // 6. Assign orgId to all existing invoices
        const invoiceResult = await Invoice.updateMany({ orgId: { $exists: false } }, { $set: { orgId } });
        console.log(`Updated ${invoiceResult.modifiedCount} invoices`);

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
