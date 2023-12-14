const { Reservation, User } = require("../models");
// const authentication = require("./authentication");
const authorizationAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dataReservation = await Reservation.findByPk(id);

    if (!dataReservation) {
      throw { name: "NotFound" };
    }
    // console.log(dataReservation.userId, "banding", req.userAccount.id);
    // console.log(req.userAccount, "ini baru bener");

    if (req.userAccount.membership !== "admin") {
      if (dataReservation.userId !== req.userAccount.id) {
        throw { name: "Forbidden" };
      }
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = authorizationAdmin;
