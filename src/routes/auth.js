const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");

const router = express.Router();

// 회원가입 처리 라우터
router.post("/signup", async (req, res) => {
  const { email, password, nickname } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashed,
    nickname,
  });

  res.redirect("/auth/login");
});

// 로그인 처리 라우터
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

// 카카오 로그인 요청
router.get("/kakao", passport.authenticate("kakao"));

// 카카오 로그인 후 콜백
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;
