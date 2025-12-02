const express = require("express");
const router = express.Router();
const { Diary, DiaryMember, Sequelize } = require("../models");
const { isLoggedIn } = require("./middlewares");
const { Op } = Sequelize;

// 다이어리 검색
router.get("/search", isLoggedIn, async (req, res) => {
  const keyword = req.query.keyword;

  const diaries = await Diary.findAll({
    where: {
      title: { [Op.like]: `%${keyword}%` },
    },
  });

  res.render("searchResult", { diaries });
});

// 다이어리 생성 페이지
router.get("/create", isLoggedIn, (req, res) => {
  res.render("createDiary");
});

// 다이어리 생성 처리
router.post("/create", isLoggedIn, async (req, res) => {
  const { title, description } = req.body;

  const diary = await Diary.create({ title, description });

  // 만든 사람이 자동으로 멤버(승인 완료)
  await DiaryMember.create({
    userId: req.user.id,
    diaryId: diary.id,
    role: "owner",
    status: "accepted",
  });

  res.redirect("/");
});

module.exports = router;
