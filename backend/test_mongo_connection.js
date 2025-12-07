const { MongoClient, ServerApiVersion } = require('mongodb');

// Use MONGO_URI env var, otherwise instruct the user how to provide it
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('\nMissing MONGO_URI environment variable.');
  console.error('Set it with your connection string before running this script.');
  console.error("Example (PowerShell): $env:MONGO_URI = 'mongodb+srv://<user>:<password>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority'");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:');
    console.error(err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    // Ensures that the client will close when you finish/error
    try {
      await client.close();
    } catch (_err) {
      // ignore
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
