const { run, get, all } = require("../db/dbClient");

function escape(str) {
  return String(str).replace(/'/g, "''");
}

async function createUser(dto) {
  const email = escape(dto.email);
  const name = escape(dto.name);
  const now = new Date().toISOString();

  const result = await run(`
    INSERT INTO Users (email, name, createdAt)
    VALUES ('${email}', '${name}', '${now}');
  `);

  return await get(`
    SELECT * 
    FROM Users 
    WHERE id = ${result.lastID};
  `);
}

async function getAllUsers() {
  return await all(`
    SELECT * 
    FROM Users 
    ORDER BY id DESC 
    LIMIT 100;
  `);
}

async function getUserById(id) {
  return await get(`
    SELECT * 
    FROM Users 
    WHERE id = ${Number(id)};
  `);
}

async function updateUser(id, dto) {
  const name = escape(dto.name);
  const email = escape(dto.email);

  const result = await run(`
    UPDATE Users
    SET name = '${name}',
        email = '${email}'
    WHERE id = ${Number(id)};
  `);

  return result.changes > 0;
}

async function deleteUser(id) {
  const result = await run(`
    DELETE FROM Users 
    WHERE id = ${Number(id)};
  `);

  return result.changes > 0;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};