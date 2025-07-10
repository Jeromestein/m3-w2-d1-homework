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
        'income': '38910',
        'age': '46'
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

// Function to query all cities in California and their income
async function findCaliforniaCitiesIncome() {
    const client = new MongoClient(uri);
    try {
        // Connect to MongoDB
        console.log('🔗 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');
        
        // Access database and collection
        const db = client.db('statsdb');
        const collection = db.collection('city_stats');
        
        // Query for all cities in California
        // Example: var myquery = { address: /^S/ };
        // Here we use: var myquery = { state: 'CA' };
        var myquery = { state: 'CA' };
        
        const results = await collection.find(myquery).toArray();
        
        if (results.length > 0) {
            console.log('🌴 Found California cities and their income:');
            console.log('==========================================');
            results.forEach((city, index) => {
                console.log(`${index + 1}. ${city.city}, CA (${city.zip})`);
                console.log(`   💰 Income: $${city.income}`);
                console.log(`   👤 Age: ${city.age}`);
                console.log('---');
            });
            console.log(`📊 Total California cities found: ${results.length}`);
        } else {
            console.log('❌ No California cities found in the database');
        }
        
    } catch (error) {
        console.error('❌ Error querying California cities:', error);
    } finally {
        // Close connection
        await client.close();
        console.log('🔌 MongoDB connection closed.');
    }
}

// Function to sort records by state in ascending order and remove duplicates
async function sortRecordsByStateAndRemoveDuplicates() {
    const client = new MongoClient(uri);
    try {
        // Connect to MongoDB
        console.log('🔗 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');
        
        // Access database and collection
        const db = client.db('statsdb');
        const collection = db.collection('city_stats');
        
        // Sort records by state in ascending order (1 for ascending, -1 for descending)
        // and remove duplicates based on all fields
        const results = await collection.find({})
            .sort({ state: 1 }) // 1 for ascending order
            .toArray();
        
        // Remove duplicates by creating a Map with unique keys
        const uniqueRecords = new Map();
        results.forEach(record => {
            // Create a unique key based on all fields
            const key = `${record.city}-${record.zip}-${record.state}-${record.income}-${record.age}`;
            if (!uniqueRecords.has(key)) {
                uniqueRecords.set(key, record);
            }
        });
        
        // Convert Map values back to array
        const sortedUniqueRecords = Array.from(uniqueRecords.values());
        
        // Output message to terminal
        console.log('📊 Records sorted by state in ascending order and duplicates removed:');
        console.log('===============================================================');
        console.log(`📈 Total records after removing duplicates: ${sortedUniqueRecords.length}`);
        console.log('📋 Sorted and unique records:');
        console.log('-----------------------------');
        
        sortedUniqueRecords.forEach((record, index) => {
            console.log(`${index + 1}. ${record.city}, ${record.state} (${record.zip})`);
            console.log(`   💰 Income: $${record.income}`);
            console.log(`   👤 Age: ${record.age}`);
            console.log('---');
        });
        
        // Display the new sorted list
        console.log('🔄 New sorted list (state order):');
        console.log('================================');
        sortedUniqueRecords.forEach((record, index) => {
            console.log(`${index + 1}. ${record.state} - ${record.city}`);
        });
        
    } catch (error) {
        console.error('❌ Error sorting and removing duplicates:', error);
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

// Run the function to query California cities income
findCaliforniaCitiesIncome();

// Run the function to sort records by state and remove duplicates
sortRecordsByStateAndRemoveDuplicates();

