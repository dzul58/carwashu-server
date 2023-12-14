const { compareTextWithHash } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { Reservation, User } = require("../models");
const { OAuth2Client } = require("google-auth-library");

class Controller {
  static async registerUser(req, res, next) {
    try {
      const { email, password, fullName, carName, licensePlate } = req.body;
      const newUser = {
        email,
        password,
        fullName,
        carName,
        licensePlate,
      };

      const response = await User.create(newUser);
      if (!response) {
        throw new Error("Create new User Failed");
      }
      res.status(201).json({ message: "Create new Account Success" });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "LoginError" };
      }

      if (!password) {
        throw { name: "LoginError" };
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "LoginError" };
      }

      const isValidPassword = compareTextWithHash(password, user.password);
      // console.log(isValidPassword, "ini useeeer");
      if (!isValidPassword) {
        throw { name: "LoginError" };
      }

      const accessToken = signToken({ id: user.id });
      res.json({ access_token: accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async loginGoogle(req, res, next) {
    try {
      const { token } = req.headers;
      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience:
          "591377960443-89jv1flki86d7um8jhh14d357rl101sd.apps.googleusercontent.com",
      });

      // console.log(ticket, "tesss");
      const payload = ticket.getPayload();

      const [user, created] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        default: {
          email: payload.email,
          password: "password-google",
        },
        hooks: false,
      });
      // console.log(user, "ini userrrnya");
      const access_token = signToken({ id: user.id });
      res.status(200).json(access_token);
    } catch (error) {
      next(error);
    }
  }

  static async createReservation(req, res, next) {
    try {
      const { reservationSchedule, status } = req.body;
      const newReservation = {
        reservationSchedule,
        status,
        userId: req.userAccount.id,
      };

      const response = await Reservation.create(newReservation);
      if (!response) {
        throw new Error("ReservationFailed");
      }
      res.status(201).json({ message: "Create Reservation Success" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async readReservation(req, res, next) {
    try {
      const reservations = await Reservation.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
        ],
      });

      res.status(200).json({
        message: "Success read Reservations",
        reservations,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateMembershipfinal(req, res, next) {
    try {
      const { id } = req.userAccount;
      await User.updateMembership(+id);
      res.status(201).json({ message: "Success" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async finishWashed(req, res, next) {
    try {
      // console.log(req.params, "ini tess");
      const { id } = req.params;
      const reservation = await Reservation.findByPk(+id, {
        include: [{ model: User }],
      });
      if (!reservation) {
        throw { name: "NotFound" };
      }
      const platnomer = reservation.User.licensePlate;
      await reservation.destroy();
      res.status(200).json({
        message: `The car with license plate ${platnomer} has already left the car wash.`,
      });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async editStatus(req, res, next) {
    try {
      const { id } = req.params;
      const reservation = await Reservation.findByPk(+id, {
        include: [{ model: User }],
      });

      if (!reservation) {
        throw { name: "NotFound" };
        // throw { name: "NotFound", id };
      }

      await Reservation.update(
        {
          status: "finish",
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: `The car ${reservation.User.carName} with license plate number ${reservation.User.licensePlate} has been washed.`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async topUp(req, res, next) {
    try {
      const { id } = req.userAccount;
      const userBalanace = await User.findByPk(id);
      // console.log(userBalanace, "ini userrrrr");

      const topup = +req.body.topup;

      let totalBalance = topup + userBalanace.balance;

      // console.log(totalBalance, "ini hasill");

      await User.update(
        { balance: totalBalance },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: `balance is Rp.${totalBalance}`,
      });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
