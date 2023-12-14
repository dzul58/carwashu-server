"use strict";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { Model } = require("sequelize");
let nodemailer = require("nodemailer");
const { createHash } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Reservation, { foreignKey: "userId" });
    }

    static async updateMembership(id) {
      try {
        let dataUser = await User.findByPk(id, {
          include: sequelize.models.Reservation,
        });

        // console.log(dataUser.member, " ini masukk");
        if (dataUser.member !== "regular") {
          throw { name: "sudahberlangganan" };
        } else {
          if (dataUser.balance < 950000) {
            throw { name: "saldokurang" };
          } else {
            await dataUser.decrement({
              balance: 950000,
            });
            await dataUser.update({ member: "premium" });
            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
              },
              secure: false,
              tls: {
                rejectUnauthorized: false,
              },
            });
            // console.log(dataUser, " ini masukk");
            let mailOptions = {
              from: "dzulfiqar5819@gmail.com",
              to: `${dataUser.email}`,
              subject: "langganan berhasil",
              text: "terimakasih sudah berlangganan di CarwashU",
            };
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(err);
              } else {
                console.log("berhasil langganan");
              }
            });
          }
        }
      } catch (error) {
        throw error;
      }
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email address already used",
        },
        validate: {
          notEmpty: {
            args: true,
            msg: "Email cannot be empty",
          },
          isEmail: {
            args: true,
            msg: "Must be a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password cannot be empty",
          },
          len: {
            args: [5],
            msg: "Password must be at least 5 characters",
          },
        },
      },
      fullName: DataTypes.STRING,
      carName: DataTypes.STRING,
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 1000000,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Price is required",
          },
          min: {
            args: [100000],
            msg: "Minimum cost Rp.100,000",
          },
        },
      },
      member: DataTypes.STRING,
      licensePlate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user) => {
    user.password = createHash(user.password);
    user.member = "regular";
  });
  return User;
};
