const { Reservation, User } = require("../models");
// const authentication = require("./authentication");
const authorization = async (req, res, next) => {
  try {
    // console.log(req.userAccount, "ini baru bener");
    if (req.userAccount.membership !== "premium") {
      if (req.userAccount.membership !== "admin") {
        throw { name: "Forbidden" };
      }
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = authorization;
