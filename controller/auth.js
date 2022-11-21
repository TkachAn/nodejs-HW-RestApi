const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const {customError} = require("../helpers/error");
const {User} = require("../models/user");
const {
  singUp,
  singIn,
  singOut,
  currentUser,
  changeSub,
  updateAvatar,
} = require("../services/auth");

const singUpCtrl = async (req, res) => {
  const {email, password, subscription} = req.body;
  await singUp(email, password, subscription);
  res.json({
    status: "success",
    code: 201,
    data: {
      email: email,
      subscription: subscription,
      message: "Registration successful",
    },
  });
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
    // token: user.token,
    // email: user.email,
    status: "success",
    code: 200,
    // data: {email, subscription},
  });
};

const subscriptCtrl = async (req, res, next) => {
  const {subscription} = req.body;
  const {_id} = req.user;

  const newSubscription = await changeSub(subscription, _id);

  if (!newSubscription) throw customError({status: 400, message: "error"});

  res.status(200).json({subscription: newSubscription});
};

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const avatarCtrl = async (req, res) => {
  const {_id: id} = req.user;
  const {path: tmpUpload, originalname} = req.file;
  try {
    const resultUpload = path.join(avatarsDir, `${id}.${originalname}`);
    await Jimp.read(tmpUpload)
      .then((img) => {
        return img.resize(255, 255).writeAsync(tmpUpload);
      })
      .catch((err) => {
        console.error(err);
      });

    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", `${id}.${originalname}`);
    const data = await updateAvatar(id, avatarURL);
    res.json(data);
  } catch (error) {
    await fs.unlink(tmpUpload);
    throw error;
  }
};
module.exports = {
  singUpCtrl,
  singInCtrl,
  singOutCtrl,
  currentUserCtrl,
  subscriptCtrl,
  avatarCtrl,
};
