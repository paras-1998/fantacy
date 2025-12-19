const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        await mongoose.connect('mongodb://fantacyuser:newrfantacypass@localhost:27017/fantacy?authSource=admin');
        console.log('Connected to MongoDB');
        
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const adminData = {
            name: 'Admin',
            email: 'admin@admin.com',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Check if admin already exists
        const existingAdmin = await mongoose.connection.db.collection('admins').findOne({ email: 'admin@admin.com' });
        
        if (existingAdmin) {
            console.log('\nAdmin already exists. Updating password...');
            await mongoose.connection.db.collection('admins').updateOne(
                { email: 'admin@admin.com' },
                { $set: { password: hashedPassword, updatedAt: new Date() } }
            );
            console.log('Password updated successfully!');
        } else {
            console.log('\nCreating new admin...');
            await mongoose.connection.db.collection('admins').insertOne(adminData);
            console.log('Admin created successfully!');
        }
        
        console.log('\n=== ADMIN LOGIN CREDENTIALS ===');
        console.log('Email: admin@admin.com');
        console.log('Password: admin123');
        console.log('\nLogin at: http://localhost:3005');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();
