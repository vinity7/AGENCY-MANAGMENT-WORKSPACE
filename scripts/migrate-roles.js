const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrate = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGO_URL;
        if (!uri) {
            console.error('MONGO_URI or MONGO_URL not defined');
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log('MongoDB Connected for migration...');

        const users = await User.find({});
        console.log(`Found ${users.length} users to potentialy migrate.`);

        let updatedCount = 0;

        for (let user of users) {
            let oldRole = user.role;
            let newRole = user.role;
            let legacyRole = oldRole.toLowerCase();

            // Migration logic:
            // 'Admin' -> 'owner'
            // 'Lead' -> 'product_manager'
            // 'Client' -> 'client'
            
            if (oldRole === 'Admin') {
                newRole = 'owner';
                legacyRole = 'admin';
            } else if (oldRole === 'Lead') {
                newRole = 'product_manager';
                legacyRole = 'lead';
            } else if (oldRole === 'Client') {
                newRole = 'client';
                legacyRole = 'client';
            } else if (oldRole === 'Intern') {
                newRole = 'intern';
                legacyRole = 'intern';
            } else {
                newRole = oldRole.toLowerCase();
                legacyRole = oldRole.toLowerCase();
            }

            user.role = newRole;
            user.legacyRole = legacyRole;
            user.roleVersion = 2;
            user.status = 'active';

            await user.save();
            updatedCount++;
            console.log(`Migrated user ${user.email}: ${oldRole} -> ${newRole} (legacy: ${legacyRole})`);
        }

        console.log(`Migration complete. Updated ${updatedCount} users.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
};

migrate();
