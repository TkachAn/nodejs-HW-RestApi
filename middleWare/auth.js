const passport = require("passport");
require("../config/passport");

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", {session: false}, (err, user) => {
    const token = req.get("Authorization")?.split(" ")[1];
    console.log("token", token);
    if (!user || err || token !== user.token) {
      return next({
        status: 401,
        message: "Not authorized",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = {authMiddleware};
