const express = require("express");
const app = express();
const cors = require("cors");
const Controller = require("./controllers/controller");
const authentication = require("./middlewares/authentication");
const authorization = require("./middlewares/authorization");
const authorizationAdmin = require("./middlewares/authorizationAdmin");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/registerAccount", Controller.registerUser);
app.post("/login", Controller.login);
app.post("/login-google", Controller.loginGoogle);
app.use(authentication);
app.patch("/user", Controller.topUp);
app.get("/membership", Controller.updateMembershipfinal);
app.get("/reservation", Controller.readReservation);
app.post("/reservation", authorization, Controller.createReservation);
app.patch("/reservation/:id", authorizationAdmin, Controller.editStatus);
app.delete("/reservation/:id", authorizationAdmin, Controller.finishWashed);

app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`server can be access in http://localhost:${port}`);
// });

module.exports = app;
