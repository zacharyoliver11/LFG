const client = require("./client");

const { createUser, createPost } = require("./models/index");

async function buildTables() {
  try {
    client.connect();
    console.log("One second, dropping tables...");

    await client.query(`
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS users;
    `);

    console.log("Successfully finished dropping tables!");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            platform VARCHAR(255) NOT NULL
        );

        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "creatorId" INTEGER REFERENCES users(id),
            "gameTitle" VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            "playersNeeded" INTEGER NOT NULL
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

    const users = await Promise.all(initialUsers.map(createUser));

    console.log("Users created:", users);

    console.log("Starting to create posts...");

    const initialPosts = [
      {
        creatorId: 1,
        gameTitle: "Apex Legends",
        description: "Ranked grind to masters!",
        playersNeeded: 2,
      },
      {
        creatorId: 2,
        gameTitle: "Minecraft",
        description: "Need people to help me build a cool house!",
        playersNeeded: 3,
      },
      {
        creatorId: 3,
        gameTitle: "Valorant",
        description:
          "Please someone help... Stuck in silver these randoms are griefing me.",
        playersNeeded: 5,
      },
    ];

    const posts = await Promise.all(initialPosts.map(createPost));

    console.log("Posts created:", posts);
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(createInitialData)
  .catch(console.error)
  .finally(() => client.end());
