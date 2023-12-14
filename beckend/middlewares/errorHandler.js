const errorHandler = (error, req, res, next) => {
  let status = 500;
  let message = "Internal Server Error";

  if (error.name == "SequelizeValidationError") {
    status = 400;
    message = error.errors[0].message;
  }

  if (error.name == "SequelizeDatabaseError") {
    status = 400;
    message = "Invalid input";
  }

  if (error.name == "SequelizeForeignKeyConstraintError") {
    status = 400;
    message = "Invalid input";
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    status = 400;
    message = error.errors[0].message;
  }

  if (error.name === "LoginError") {
    status = 401;
    message = "Invalid Email/Password";
  }

  if (error.name === "saldokurang") {
    status = 401;
    message = "saldo anda kurang untuk berlangganan";
  }

  if (error.name === "sudahberlangganan") {
    status = 401;
    message = "anda sudah berlangganan";
  }

  if (error.name == "Unauthorized") {
    status = 401;
    message = "Invalid token";
  }

  if (error.name == "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  }

  if (error.name == "Forbidden") {
    status = 403;
    message = "Forbidden Access";
  }

  if (error.name == "NotFound") {
    status = 404;
    message = `Data not found`;
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;
