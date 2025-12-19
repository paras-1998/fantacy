const { MongoClient } = require('mongodb');

async function setupDatabase() {
  // const uri = 'mongodb://localhost:27017';
  const uri = 'mongodb://fantacyuser:newfantacypass@localhost:27017/fantacy?authSource=admin';

  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✓ Connected');

    const adminDb = client.db('admin');
    const adminUsers = adminDb.collection('system.users');

    // Check if user exists
    const existingUser = await adminUsers.findOne({ user: 'fantacyuser' });
    
    if (!existingUser) {
      console.log('Creating user fantacyuser...');
      // Use runCommand instead of addUser
      try {
        await adminDb.admin().command({
          createUser: 'fantacyuser',
          pwd: 'newrfantacypass',
          roles: [{ role: 'root', db: 'admin' }]
        });
        console.log('✓ User fantacyuser created');
      } catch (e) {
        console.log('Create user result:', e.message);
      }
    } else {
      console.log('✓ User fantacyuser already exists');
    }

    // List databases
    const dbList = await adminDb.admin().listDatabases();
    console.log('\n✓ Databases on server:');
    dbList.databases.forEach(db => console.log('  -', db.name));

    // Try to get collections from fantacy database
    const fantacyDb = client.db('fantacy');
    try {
      const collections = await fantacyDb.listCollections().toArray();
      console.log('\nCollections in "fantacy" database:');
      if (collections.length === 0) {
        console.log('  (no collections yet)');
      } else {
        collections.forEach(col => console.log('  -', col.name));
      }
    } catch (e) {
      console.log('Could not list collections:', e.message);
    }

  } catch (err) {
    console.error('✗ Error:', err.message);
  } finally {
    await client.close();
    console.log('\n✓ MongoDB setup complete!');
    console.log('Connection string: mongodb://fantacyuser:newrfantacypass@localhost:27017/fantacy');
  }
}

setupDatabase();
