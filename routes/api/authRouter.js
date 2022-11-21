const express = require("express");
const {
  singUpCtrl,
  singInCtrl,
  singOutCtrl,
  currentUserCtrl,
  subscriptCtrl,
  avatarCtrl,
} = require("../../controller/auth");

const {checkToken} = require("../../middleWare/auth");
const {wrapper} = require("../../helpers/tryCatch");
const {schemaPost, schemaPatch} = require("../../schema/userValidation");
const {validatorBody} = require("../../middleware/validBody");
const {upload} = require("../../middleWare/upload");

const router = express.Router();

router.patch("/avatars", checkToken, upload.single("avatar"), avatarCtrl);
router.get("/current", checkToken, wrapper(currentUserCtrl));
router.post("/singup", validatorBody(schemaPost), wrapper(singUpCtrl));
router.post("/login", validatorBody(schemaPost), wrapper(singInCtrl));
router.get("/logout", checkToken, wrapper(singOutCtrl));
router.patch(
  "/subscription",
  checkToken,
  validatorBody(schemaPatch),
  wrapper(subscriptCtrl)
);

module.exports = router;
