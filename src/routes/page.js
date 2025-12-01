const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const router = express.Router();

// 메인 페이지 (비로그인/로그인 둘 다 접근 가능)
router.get("/", (req, res) => {
  res.render("main");
});

// 회원가입 페이지 (로그인 한 사람은 접근 불가)
router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("signup");
});

// 프로필 페이지 (로그인 필요)
router.get("/mypage", isLoggedIn, (req, res) => {
  res.render("mypage");
});

module.exports = router;
