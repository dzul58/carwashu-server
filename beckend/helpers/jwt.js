if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
const signToken = (payload) => {
  return jwt.sign(payload, jwtSecret);
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = { signToken, verifyToken };
