const client = require("../client");
const bcrypt = require("bcrypt");

async function createPost({
  creatorId,
  gameTitle,
  description,
  playersNeeded,
}) {
  const {
    rows: [post],
  } = await client.query(
    `
    INSERT INTO posts ("creatorId", "gameTitle", description, "playersNeeded")
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [creatorId, gameTitle, description, playersNeeded]
  );

  return post;
}

async function deletePost(id) {
  const {
    rows: [post],
  } = await client.query(
    `
  DELETE FROM posts
  WHERE id=$1
  RETURNING *;
  `,
    [id]
  );

  return post;
}

async function updatePost({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  const {
    rows: [post],
  } = await client.query(
    `
  UPDATE posts
  SET ${setString}
  WHERE id=${id}
  RETURNING *;
  `,
    Object.values(fields)
  );

  return post;
}

module.exports = {
  createPost,
  deletePost,
  updatePost,
};
