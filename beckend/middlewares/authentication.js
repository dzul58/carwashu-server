const { verifyToken } = require("../helpers/jwt");
const { Reservation, User } = require("../models");
const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const accessToken = authorization.split(" ")[1];
    const jwtPayload = verifyToken(accessToken);
    const user = await User.findByPk(jwtPayload.id);

    if (!user) {
      throw { name: "NotFound" };
    }

    req.userAccount = {
      // bisa dipake di authorization
      id: user.id,
      membership: user.member,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
