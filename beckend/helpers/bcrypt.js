const bcrypt = require("bcryptjs");

function createHash(text) {
  return bcrypt.hashSync(text);
}

function compareTextWithHash(text, hashedPassword) {
  return bcrypt.compareSync(text, hashedPassword);
}

module.exports = { createHash, compareTextWithHash };
