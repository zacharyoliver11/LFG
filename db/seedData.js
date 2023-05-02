const client = require("./client");

const { createUser } = require("./models/users");

async function buildTables() {
  try {
    client.connect();
    console.log("One second, dropping tables...");

    await client.query(`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS posts;
    `);

    console.log("Successfully finished dropping tables!");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) UNIQUE NOT NULL,
            platform VARCHAR(255) UNIQUE NOT NULL
        );

        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            description VARCHAR(255) UNIQUE NOT NULL
         );

        `);

    console.log("Successfully finished creating tables!");
  } catch (error) {
    throw error;
  }
}

async function createInitialData() {
  try {
    console.log("Starting to create users...");

    const initialUsers = [
      {
        username: "rat with a hat",
        password: "hello123",
        platform: "PC",
      },
      {
        username: "King Fish FPS",
        password: "wraithmain234",
        platform: "Xbox",
      },
      {
        username: "Dark samurai726",
        password: "ilovemydog62",
        platform: "PS5",
      },
    ];

    const users = await Promise.all(initialUsers);

    console.log("Users created:", users);
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(createInitialData)
  .catch(console.error)
  .finally(() => client.end());
