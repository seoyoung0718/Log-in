const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");

const router = express.Router();

// 회원가입 처리 라우터
router.post("/signup", async (req, res) => {
  const { email, password, password2, nick } = req.body;

  // 1) 비밀번호 검증
  if (password !== password2) {
    return res.status(400).send("비밀번호가 일치하지 않습니다.");
  }

  try {
    // 2) 이메일 중복 확인
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).send("이미 존재하는 이메일입니다.");
    }

    // 3) 비밀번호 해싱
    const hashed = await bcrypt.hash(password, 10);

    // 4) 새 User 저장
    await User.create({
      email,
      password: hashed,
      nick,
      provider: "local", // 일반 회원으로 설정
    });

    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res.status(500).send("회원가입 실패");
  }
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

// 로그아웃
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // 세션 쿠키 삭제
      return res.redirect("/");
    });
  });
});

module.exports = router;
