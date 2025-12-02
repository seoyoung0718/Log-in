const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Diary, DiaryMember } = require("../models");

const router = express.Router();

router.use((req, res, next) => {
  console.log("🔥 현재 로그인 사용자:", req.user);
  next();
});

// 메인 페이지 - 로그인 여부로 분기
router.get("/", async (req, res) => {
  // 로그인 안 한 경우
  if (!req.user) {
    return res.render("main", { myDiaries: [] });
  }

  // 로그인 한 경우 → 다이어리 목록 조회
  const myDiaries = await DiaryMember.findAll({
    where: { userId: req.user.id, status: "approved" },
    include: [{ model: Diary }],
  });

  res.render("main", { myDiaries });
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
