const mongoose = require('mongoose');

async function checkAdmin() {
    try {
        // await mongoose.connect('mongodb://fantacyuser:newrfantacypass@localhost:27017/fantacy?authSource=admin');
        await mongoose.connect('mongodb://fantacyuser:newrfantacypass@localhost:27017/fantacy?authSource=admin');
       
        console.log('Connected to MongoDB\n');
        
        const admins = await mongoose.connection.db.collection('admins').find({}).toArray();
        
        console.log('=== ALL ADMINS IN DATABASE ===\n');
        admins.forEach((admin, index) => {
            console.log(`Admin ${index + 1}:`);
            console.log('  Name:', admin.name);
            console.log('  Email:', admin.email);
            console.log('  Password Hash:', admin.password.substring(0, 20) + '...');
            console.log('  Created:', admin.createdAt);
            console.log('---');
        });
        
        console.log('\nTotal admins:', admins.length);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAdmin();
