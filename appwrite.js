const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Replace with your endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) // Replace with your project ID
  .setKey(process.env.NEXT_PUBLIC_APPWRITE_KEY_ID); // Replace with your API key

const account = new sdk.Account(client);
const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);
const users = new sdk.Users(client);

module.exports = { client, account, databases, storage, users };
