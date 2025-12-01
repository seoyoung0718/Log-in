const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

// 메인 페이지
router.get("/", (req, res) => {
  res.render("main");
});

// 회원가입 페이지
router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("signup");
});

// 로그인 페이지
router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login");
});

module.exports = router;
