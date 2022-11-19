// const {customError} = require("../helpers/error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {Conflict, Unauthorized} = require("http-errors");
const {SECRET} = require("../config");
const {User} = require("../models/user");

const singUp = async (email, password, subscription) => {
  const user = await User.findOne({email});
  if (!user) {
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPass,
      subscription,
    });
    return newUser;
  }
  throw new Conflict("Email in use");
};

const singIn = async (email, password) => {
  const user = await User.findOne({email});
  const isPassCompare = await bcrypt.compare(password, user.password);
  if (!user || !isPassCompare) {
    throw new Unauthorized("Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET);
  await User.findByIdAndUpdate(user._id, {token});

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

const singOut = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Unauthorized("Not authorized");
  }
  await User.findByIdAndUpdate(id, {token: null});
};

const currentUser = async (Id) => {
  const user = await User.findOne({Id});
  if (!user) {
    throw new Unauthorized("Not authorized!");
  }
  return {
    token: user.token,
    Id,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

const changeSub = async (subscription, _id) => {
  const results = await User.findByIdAndUpdate(
    {_id},
    {subscription},
    {
      returnOriginal: false,
    }
  );

  return results.subscription;
};

module.exports = {
  // singUpServ,
  // singInServ,
  // singOutServ,
  // currentUserServ,
  // subscriptServ,
  singUp,
  singIn,
  singOut,
  currentUser,
  changeSub,
};

// const singOutController = async (req, res) => {
//   res.json({
//     status: "success",
//     code: 204,
//     data: {
//       message: "No Content",
//     },
//   });
// };

// return await User.create({email, password: await bcrypt.hash(password, 10), subscription});
