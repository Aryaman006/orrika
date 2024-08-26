"use server";

const { Client, Account } = require('appwrite');

export const updateUser = async (formData) => {
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const account = new Account(client);

  const id = formData.get("id");
  const username = formData.get("username");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phone = formData.get("phone");

  console.log(username);

  try {
    // Update the user profile
    const response = await account.updateProfile({
      name: username || undefined,
      email: email || undefined,
      phone: phone || undefined,
    });

    // Optionally, you might want to update other user data if stored separately
    // For example, if you have additional user information in a database

    console.log(response);
  } catch (err) {
    console.error('Error updating user:', err);
  }
};
