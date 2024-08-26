import { Client, Databases, Storage, Account, Query,  } from 'appwrite';

console.log('Appwrite Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
console.log('Appwrite Project ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject('669296990030574344ed')
  // .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

export { client, databases, storage, Query, account };
