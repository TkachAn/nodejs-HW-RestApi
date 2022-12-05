const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const {nanoid} = require("nanoid");
const {SING_UP_EMAIL} = require("../config");
const {customError} = require("../helpers/error");
const {User} = require("../models/user");
const {
  singUp,
  singIn,
  singOut,
  currentUser,
  changeSub,
  updateAvatar,
  verifyUser,
  verifyEmail,
} = require("../services/auth");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const singUpCtrl = async (req, res) => {
  const verificationToken = nanoid();
  const {email, password, subscription} = req.body;
  await singUp(email, password, verificationToken, subscription);
  const msg = {
    to: email,
    from: SING_UP_EMAIL,
    subject: "Verification email",
    text: `Please, verify your email following this link http://localhost:3000/api/users/verify/${verificationToken}`,
    html: `<h2>Please, <a href='http://localhost:3000/api/users/verify/${verificationToken}'>verify</a> your email</h2>`,
  };

  await sgMail.send(msg);

  // res.json({
  //   status: "success",
  //   code: 201,
  //   data: {
  //     email: email,
  //     subscription: subscription,
  //     message: "Registration successful",
  //   },
  // });
};

const singInCtrl = async (req, res) => {
  const {email, password} = req.body;

  const currentUser = await singIn(email, password);
  if (!currentUser)
    throw customError({status: 401, message: "Email or password is wrong"});

  res.json({
    status: "success",
    code: 200,
    token: currentUser.token,
    data: {
      email: currentUser.email,
      subscription: currentUser.currentUser,
    },
  });
};

const singOutCtrl = async (req, res, next) => {
  const Id = req.user._id;
  console.log("Id", Id);
  await singOut(Id);

  res.json({
    status: "success",
    code: 204,
    data: {
      message: "No Content",
    },
  });
};

const currentUserCtrl = async (req, res, next) => {
  const Id = req.user._id;
  console.log("Id:", Id);
  await currentUser(Id);

  const id = String(req.user._id);
  User.findById(id);
  res.json({
    status: "success",
    code: 200,
  });
};

const subscriptCtrl = async (req, res, next) => {
  const {subscription} = req.body;
  const {_id} = req.user;

  const newSubscription = await changeSub(subscription, _id);

  if (!newSubscription) throw customError({status: 400, message: "error"});

  res.status(200).json({subscription: newSubscription});
};
const verifyUserCtrl = async (req, res) => {

    const {verificationToken} = req.params;
    await verifyUser(verificationToken);
    res.status(200).json({message: "Verification successful"});

};
