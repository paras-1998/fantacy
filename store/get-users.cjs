const { MongoClient } = require('mongodb');

async function getUsers() {
  const uri = 'mongodb://fantacyuser:newrfantacypass@localhost:27017/fantacy?authSource=admin';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('fantacy');
    const users = await db.collection('users').find({}).toArray();
    
    console.log('\n✓ Users in database:\n');
    users.forEach((user, i) => {
      console.log(`${i + 1}. Username: ${user.username || 'N/A'}`);
      if (user.email) console.log(`   Email: ${user.email}`);
      console.log(`   Balance: ${user.balance}`);
      console.log('');
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.close();
  }
}

getUsers();
