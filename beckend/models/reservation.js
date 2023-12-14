"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Reservation.init(
    {
      reservationSchedule: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Reservation schedule is required",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Status is required",
          },
        },
      },
      imageUrl: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "User is required",
          },
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Reservation",
    }
  );
  return Reservation;
};
