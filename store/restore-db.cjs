const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const { BSON } = require('mongodb');

async function restoreDatabase() {
  const backupPath = 'D:\\honest\\mongo-backup-extracted\\root\\mongo-backup\\fantacy';
  
  if (!fs.existsSync(backupPath)) {
    console.log('✗ Backup path not found:', backupPath);
    console.log('\nAvailable paths:');
    const root = 'd:\\honest\\mongo-backup-extracted\\mongo-backup';
    if (fs.existsSync(root)) {
      fs.readdirSync(root).forEach(f => console.log('  -', path.join(root, f)));
    }
    return;
  }

  const uri = 'mongodb://fantacyuser:newrfantacypass@localhost:27017?authSource=admin';
  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✓ Connected');

    const db = client.db('fantacy');
    
    // Get all .bson files
    const files = fs.readdirSync(backupPath).filter(f => f.endsWith('.bson'));
    console.log(`\nFound ${files.length} collections to restore`);

    for (const file of files) {
      const collectionName = file.replace('.bson', '');
      console.log(`\nRestoring collection: ${collectionName}`);
      
      try {
        const filePath = path.join(backupPath, file);
        const data = fs.readFileSync(filePath);
        
        // Parse BSON documents
        let offset = 0;
        let count = 0;
        const documents = [];
        
        while (offset < data.length) {
          const docSize = data.readUInt32LE(offset);
          const bsonData = data.slice(offset, offset + docSize);
          const doc = BSON.deserialize(bsonData);
          documents.push(doc);
          offset += docSize;
          count++;
        }
        
        if (documents.length > 0) {
          await db.collection(collectionName).insertMany(documents);
          console.log(`✓ Restored ${documents.length} documents`);
        }
      } catch (e) {
        console.log(`⚠ Error restoring ${collectionName}:`, e.message);
      }
    }

    console.log('\n✓ Database restoration complete!');

  } catch (err) {
    console.error('✗ Error:', err.message);
  } finally {
    await client.close();
  }
}

restoreDatabase();
