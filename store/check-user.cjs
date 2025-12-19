const { MongoClient } = require('mongodb');

async function checkUsers() {
  const uri = 'mongodb://fantacyuser:newrfantacypass@localhost:27017/fantacy?authSource=admin';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('fantacy');
    const users = await db.collection('users').find({}).toArray();
    
    console.log('\n✓ ALL USERS IN DATABASE:\n');
    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.username} / ${user.password} (Balance: ${user.balance}, Status: ${user.status === 1 ? 'Active' : 'Deactivated'})`);
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.close();
  }
}

checkUsers();
