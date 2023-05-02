const client = require("../client")
const bcrypt = require("bcrypt");

async function createUser({ username, password, platform }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const {
    rows: [user],
  } = await client.query(
    `
  INSERT INTO users (username, password, platform)
  VALUES ($1, $2, $3)
  RETURNING *;
    `,
    [username, hashedPassword, platform]
  );

  delete user.password;

  return user;
}

module.exports = {
  createUser,
};
