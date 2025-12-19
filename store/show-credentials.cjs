const { MongoClient } = require('mongodb');

async function showAllCredentials() {
  const uri = 'mongodb://fantacyuser:newrfantacypass@localhost:27017/fantacy?authSource=admin';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('fantacy');
    const users = await db.collection('users').find({}).toArray();
    
    console.log('\n========================================');
    console.log('ALL AVAILABLE LOGIN CREDENTIALS');
    console.log('========================================\n');
    
    users.forEach((user, i) => {
      console.log(`${i + 1}. Username: ${user.username}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Balance: ${user.balance}`);
      console.log(`   Status: ${user.status === 1 ? 'Active' : 'Deactivated'}`);
      console.log('');
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.close();
  }
}

showAllCredentials();
