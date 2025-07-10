const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = "mongodb://localhost:27017";

// Stats data array
var stats = [
    {
        'city': 'San Juan', 
        'zip': '00926', 
        'state': 'PR', 
        'income': '34781',
        'age': '44'
    },
    {
        'city': 'Corona', 
        'zip': '11368', 
        'state': 'NY', 
        'income': '50797',
        'age': '32'
    },
    {
        'city': 'Chicago', 
        'zip': '60629', 
        'state': 'IL', 
        'income': '42019',
        'age': '31'
    },
    {
        'city': 'El Paso', 
        'zip': '79936', 
        'state': 'TX', 
        'income': '54692',
        'age': '31'
    },
    {
        'city': 'Los Angeles', 
        'zip': '90011', 
        'state': 'CA', 
        'income': '36954',
        'age': '28'
    },
    {
        'city': 'Norwalk', 
        'zip': '90650', 
        'state': 'CA', 
        'income': '66453',
        'age': '35'
    },
    {
        'city': 'Pacoima',
        'zip': '91331',
        'state': 'CA',
        'income': '60360',
        'age': '33'
    },
    {
        'city': 'Ketchikan',
        'zip': '99950',
        'state': 'AK',
        'income': '00000',
        'age': '00'
    }
];

// Function to add data to collection
async function addDataToCollection() {
    const client = new MongoClient(uri);
    try {
        // Connect to MongoDB
        console.log('🔗 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');
        
        // Access database and collection
        const db = client.db('statsdb');
        const collection = db.collection('city_stats');
        
        // Insert the stats data into collection
        const result = await collection.insertMany(stats);
        
        // Output success message to terminal
        console.log('🎉 Data successfully added to collection!');
        console.log(`📊 Inserted ${result.insertedCount} documents into city_stats collection`);
        console.log('📋 Data includes:');
        stats.forEach((stat, index) => {
            console.log(`   ${index + 1}. ${stat.city}, ${stat.state} (${stat.zip}) - Income: $${stat.income}, Age: ${stat.age}`);
        });
        
    } catch (error) {
        console.error('❌ Error adding data to collection:', error);
    } finally {
        // Close connection
        await client.close();
        console.log('🔌 MongoDB connection closed.');
    }
}

// Function to create database and insert data
async function createStatsDatabase() {
    const client = new MongoClient(uri);
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');
        
        // Create database
        const db = client.db('statsdb');
        console.log('📊 Database "statsdb" created successfully!');
        
        // Create collection and insert data
        const collection = db.collection('city_stats');
        const result = await collection.insertMany(stats);
        console.log(`📈 Successfully inserted ${result.insertedCount} documents into statsdb.city_stats collection!`);
        
        // Create uscensus collection
        const uscensusCollection = db.collection('uscensus');
        console.log('📋 Successfully created uscensus collection!');
        
        // List all databases to confirm creation
        const adminDb = client.db('admin');
        const databases = await adminDb.admin().listDatabases();
        console.log('🗄️ Available databases:');
        databases.databases.forEach(db => {
            console.log(`   - ${db.name}`);
        });
        
    } catch (error) {
        console.error('❌ Error creating database:', error);
    } finally {
        // Close connection
        await client.close();
        console.log('🔌 MongoDB connection closed.');
    }
}

// Function to query Corona, NY zip code
async function findCoronaZipCode() {
    const client = new MongoClient(uri);
    try {
        // Connect to MongoDB
        console.log('🔗 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');
        
        // Access database and collection
        const db = client.db('statsdb');
        const collection = db.collection('city_stats');
        
        // Query for Corona, NY
        const result = await collection.findOne({ 
            'city': 'Corona', 
            'state': 'NY' 
        });
        
        if (result) {
            console.log('🎯 Found Corona, NY data:');
            console.log(`📍 City: ${result.city}, ${result.state}`);
            console.log(`📮 Zip Code: ${result.zip}`);
            console.log(`💰 Income: $${result.income}`);
            console.log(`👤 Age: ${result.age}`);
        } else {
            console.log('❌ No data found for Corona, NY');
        }
        
    } catch (error) {
        console.error('❌ Error querying database:', error);
    } finally {
        // Close connection
        await client.close();
        console.log('🔌 MongoDB connection closed.');
    }
}

// Run the function to add data to collection
addDataToCollection();

// Run the function to query Corona, NY zip code
findCoronaZipCode();

